/**
 * Confere o PDF gerado contra a proposta original (Word), para garantir que
 * nada do conteúdo se perdeu ou mudou na troca de visual.
 *
 *   npm run verificar [-- caminho/da/proposta-original.pdf]
 *
 * 1. Carta e cláusulas 1–10: diferença palavra a palavra (sem diferenciar
 *    maiúsculas e pontuação). Devem aparecer só as correções de CORRECOES e as
 *    mudanças de forma (cabeçalhos de tabela, aviso da Tabela 01, campos de assinatura).
 * 2. Memorial (11): todos os números do original precisam estar no gerado, na
 *    mesma quantidade.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import * as mupdf from "mupdf";
import { raiz } from "./src/util.mjs";

const original =
  process.argv[2] ?? join(raiz, "..", "..", "documento", "Proposta GEO 2701A-25 - CONT - Est Justaposta - GRAND PALLADIUM - 23.10.26.pdf");
const gerado = join(raiz, "saida", "Proposta GEO 2701A-25 - Grand Palladium.pdf");
for (const f of [original, gerado]) if (!existsSync(f)) throw new Error("Arquivo não encontrado: " + f);

const paginasTexto = (arquivo) => {
  const doc = mupdf.Document.openDocument(readFileSync(arquivo), "application/pdf");
  return Array.from({ length: doc.countPages() }, (_, i) => doc.loadPage(i).toStructuredText().asText());
};

// ─── Original: sem o cabeçalho de página do Word ────────────────────────────
const orig = paginasTexto(original).map((t) => t.replace(/[\s\S]*?E-mail: projetos@geoforte\.com\.br\s*/, ""));
const origCorpo = orig.slice(0, 8).join("\n");
// o original repete o número da fase ("Fase 1" e logo abaixo "Fase 1 - Berma"); o gerado mostra "Fase 1 · Berma"
const origMemorial = orig.slice(8, 27).join("\n").replace(/Fase (\d)\s*\n\s*(?=Fase \1\s*-)/g, "");

// ─── Gerado: só o corpo, sem a moldura ──────────────────────────────────────
const ger = paginasTexto(gerado);
const iCarta = ger.findIndex((t) => t.includes("Prezados Senhores"));
// (o sobretítulo "ANEXO B" tem espaçamento entre letras e sai como "A N E X O B")
const iAnexo = ger.findIndex((t) => /Obras executadas\s*\n\s*Cortinas de estacas justapostas em Salvador/.test(t));
if (iCarta < 0 || iAnexo < 0) throw new Error(`Não localizei a carta (${iCarta}) ou o anexo (${iAnexo}) no PDF gerado.`);
const MOLDURA = [
  /^PROPOSTA GEO 2701A\/25$/,
  /^EXPANSÃO GRAND PALLADIUM IMBASSAÍ$/,
  /^Geofor Obras de Fundações Ltda · CNPJ/,
  /^Av\. Luís Viana Filho, 13145/,
  /^São Cristóvão · Salvador – BA$/,
  /^\(71\) 99708-2005/,
  /^Pág\. \d+$/,
];
const semMoldura = (t) =>
  t
    .split("\n")
    .filter((l) => !MOLDURA.some((re) => re.test(l.trim())))
    .join("\n");
const gerCorpoTudo = ger.slice(iCarta, iAnexo).map(semMoldura).join("\n");
const corte = gerCorpoTudo.search(/\n\s*11\s*\n?\s*Memorial de cálculo/);
const gerCorpo = gerCorpoTudo.slice(0, corte);
const gerMemorial = gerCorpoTudo.slice(corte);

// ─── 1. Diferença palavra a palavra ─────────────────────────────────────────
const tokens = (t) =>
  t
    .normalize("NFC")
    .toLowerCase()
    .replace(/[“”"'‘’]/g, "")
    .split(/[\s ]+/)
    .map((w) => w.replace(/^[.,;:!?()[\]–—\-·]+|[.,;:!?()[\]–—\-·]+$/g, ""))
    .filter(Boolean);

function diff(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push(["=", a[i]]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) out.push(["-", a[i++]]);
    else out.push(["+", b[j++]]);
  }
  while (i < n) out.push(["-", a[i++]]);
  while (j < m) out.push(["+", b[j++]]);
  return out;
}

const A = tokens(origCorpo), B = tokens(gerCorpo);
const d = diff(A, B);
const blocos = [];
for (let k = 0; k < d.length; k++) {
  if (d[k][0] === "=") continue;
  const ini = k;
  while (k < d.length && d[k][0] !== "=") k++;
  const trecho = d.slice(ini, k);
  const ctx = d.slice(Math.max(0, ini - 4), ini).map((x) => x[1]).join(" ");
  blocos.push({
    ctx,
    menos: trecho.filter((x) => x[0] === "-").map((x) => x[1]).join(" "),
    mais: trecho.filter((x) => x[0] === "+").map((x) => x[1]).join(" "),
  });
}
const iguais = d.filter((x) => x[0] === "=").length;
console.log(`\n1) CARTA E CLÁUSULAS 1–10 — ${A.length} palavras no original, ${B.length} no gerado, ${iguais} em comum`);
console.log(`   ${blocos.length} trechos diferentes (- só no original · + só no gerado):\n`);
for (const b of blocos) {
  console.log(`   …${b.ctx}`);
  if (b.menos) console.log(`      - ${b.menos}`);
  if (b.mais) console.log(`      + ${b.mais}`);
}

// ─── 2. Números do memorial ─────────────────────────────────────────────────
const numeros = (t) => {
  const c = new Map();
  for (const m of t.matchAll(/-?\d+(?:[.,]\d+)*/g)) c.set(m[0], (c.get(m[0]) ?? 0) + 1);
  return c;
};
const nO = numeros(origMemorial), nG = numeros(gerMemorial);
const faltam = [], sobram = [];
for (const [k, v] of nO) if ((nG.get(k) ?? 0) < v) faltam.push(`${k} (${v - (nG.get(k) ?? 0)}×)`);
for (const [k, v] of nG) if ((nO.get(k) ?? 0) < v) sobram.push(`${k} (${v - (nO.get(k) ?? 0)}×)`);
const total = [...nO.values()].reduce((a, b) => a + b, 0);
console.log(`\n2) MEMORIAL DE CÁLCULO — ${total} números no original`);
console.log(`   faltando no gerado: ${faltam.length ? faltam.join(", ") : "nenhum"}`);
console.log(`   a mais no gerado:   ${sobram.length ? sobram.join(", ") : "nenhum"}`);
