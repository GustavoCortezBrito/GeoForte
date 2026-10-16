import type { NextRequest } from "next/server";
import { Resend } from "resend";

/**
 * Recebe o formulário de diagnóstico e envia por e-mail via Resend.
 *
 * Variáveis de ambiente (ver .env.example):
 *  - RESEND_API_KEY      chave da API do Resend
 *  - CONTACT_TO_EMAIL    quem recebe as solicitações
 *  - CONTACT_FROM_EMAIL  remetente (opcional; padrão: onboarding@resend.dev,
 *                        que só entrega para o dono da conta Resend até o
 *                        domínio ser verificado)
 */

const MAX = { name: 120, company: 120, email: 254, phone: 40, message: 4000 };
const PROJECT_TYPES = ["residencial", "comercial", "industrial", "infraestrutura", "outro"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limite por IP. Em ambiente serverless cada instância tem a sua memória,
// então isto é um freio contra abuso casual, não uma garantia.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// Remove quebras de linha para o valor nunca virar cabeçalho de e-mail.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: campo invisível que só robôs preenchem. Finge sucesso e descarta.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente de novo." },
      { status: 429 },
    );
  }

  const name = oneLine(text(body.name, MAX.name));
  const company = oneLine(text(body.company, MAX.company));
  const email = oneLine(text(body.email, MAX.email));
  const phone = oneLine(text(body.phone, MAX.phone));
  const message = text(body.message, MAX.message);
  const projectType = PROJECT_TYPES.includes(text(body.projectType, 30))
    ? text(body.projectType, 30)
    : "";

  if (!name || !company || !phone || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Preencha nome, empresa, e-mail e telefone." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contato] RESEND_API_KEY ou CONTACT_TO_EMAIL não configurados.");
    return Response.json(
      { error: "Envio indisponível no momento. Fale conosco pelo WhatsApp." },
      { status: 500 },
    );
  }

  const from = process.env.CONTACT_FROM_EMAIL || "Site Geoforte <onboarding@resend.dev>";
  const rows: [string, string][] = [
    ["Nome", name],
    ["Empresa", company],
    ["E-mail", email],
    ["Telefone / WhatsApp", phone],
    ["Tipo de empreendimento", projectType || "não informado"],
  ];

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#22252a;max-width:560px">
      <h2 style="margin:0 0 16px;border-bottom:3px solid #ef6c1a;padding-bottom:12px">
        Nova solicitação de diagnóstico técnico
      </h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 12px 8px 0;color:#696f7a;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px">Detalhes do projeto</h3>
      <p style="white-space:pre-wrap;margin:0;line-height:1.5">${escapeHtml(message) || "—"}</p>
      <p style="margin-top:28px;font-size:12px;color:#696f7a">
        Responda este e-mail para falar direto com ${escapeHtml(name)}.
      </p>
    </div>`;

  const plain = [
    "Nova solicitação de diagnóstico técnico",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Detalhes do projeto:",
    message || "—",
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Diagnóstico técnico — ${company} (${name})`,
      html,
      text: plain,
    });
    if (error) {
      console.error("[contato] Resend recusou o envio:", error);
      return Response.json(
        { error: "Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contato] Falha ao chamar o Resend:", err);
    return Response.json(
      { error: "Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
