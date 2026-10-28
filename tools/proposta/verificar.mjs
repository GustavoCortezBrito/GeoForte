/**
 * Confere o PDF gerado contra a proposta original (Word), para garantir que
 * nada do conteúdo se perdeu ou mudou na troca de visual.
 *
 *   npm run verificar [-- caminho/da/proposta-original.pdf]            (contenção)
 *   npm run verificar:fundacao [-- caminho/da/proposta-original.docx]  (fundação)
 *
 * 1. Carta e cláusulas 1–10: diferença palavra a palavra (sem diferenciar
 *    maiúsculas e pontuação). Devem aparecer só as correções de CORRECOES e as
 *    mudanças de forma (cabeçalhos de tabela, aviso da Tabela 01, campos de assinatura).
 * 2. Memorial (11): contenção — todos os números do original precisam estar no
 *    gerado, na mesma quantidade. Fundação — todo o texto do memorial precisa estar
 *    no gerado, e todos os números das planilhas do Excel (coladas no Word como
 *    imagem) também.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import * as mupdf from "mupdf";
import { raiz } from "./src/util.mjs";
import { id, pacote } from "./src/pacote.mjs";

const paginasTexto = (arquivo) => {
  const doc = mupdf.Document.openDocument(readFileSync(arquivo), "application/pdf");
  return Array.from({ length: doc.countPages() }, (_, i) => doc.loadPage(i).toStructuredText().asText());
};

// ─── Diferença palavra a palavra ────────────────────────────────────────────
const tokens = (t) =>
  t
    .normalize("NFC")
    .toLowerCase()
    .replace(/[“”"'‘’]/g, "")
    .split(/[\s ]+/)
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

/** Trechos em que os dois textos diferem, com 4 palavras de contexto. */
function diferencas(original, gerado) {
  const A = tokens(original), B = tokens(gerado);
  const d = diff(A, B);
  const blocos = [];
  for (let k = 0; k < d.length; k++) {
    if (d[k][0] === "=") continue;
    const ini = k;
    while (k < d.length && d[k][0] !== "=") k++;
    const trecho = d.slice(ini, k);
    blocos.push({
      ctx: d.slice(Math.max(0, ini - 4), ini).map((x) => x[1]).join(" "),
      menos: trecho.filter((x) => x[0] === "-").map((x) => x[1]).join(" "),
      mais: trecho.filter((x) => x[0] === "+").map((x) => x[1]).join(" "),
    });
  }
  return { palavrasOriginal: A.length, palavrasGerado: B.length, iguais: d.filter((x) => x[0] === "=").length, blocos };
}

const imprimirBlocos = (blocos, { mais = true } = {}) => {
  for (const b of blocos) {
    console.log(`   …${b.ctx}`);
    if (b.menos) console.log(`      - ${b.menos}`);
    if (mais && b.mais) console.log(`      + ${b.mais}`);
  }
};

const numeros = (t) => {
  const c = new Map();
  for (const m of t.replace(/−/g, "-").matchAll(/-?\d+(?:[.,]\d+)*/g)) c.set(m[0], (c.get(m[0]) ?? 0) + 1);
  return c;
};
const comparaNumeros = (nO, nG) => {
  const faltam = [], sobram = [];
  for (const [k, v] of nO) if ((nG.get(k) ?? 0) < v) faltam.push([k, v - (nG.get(k) ?? 0)]);
  for (const [k, v] of nG) if ((nO.get(k) ?? 0) < v) sobram.push([k, v - (nO.get(k) ?? 0)]);
  return { faltam, sobram, total: [...nO.values()].reduce((a, b) => a + b, 0) };
};
const lista = (l) => (l.length ? l.map(([k, v]) => `${k} (${v}×)`).join(", ") : "nenhum");

/** Linhas da moldura (cabeçalho e rodapé de cada página) a descartar do texto gerado. */
const semMoldura = (t, molduras) =>
  t
    .split("\n")
    .filter((l) => !molduras.some((re) => re.test(l.trim())))
    .join("\n");

// ═══ Contenção: o original é o PDF gerado do Word ════════════════════════════
function contencao() {
  const original =
    process.argv.find((a) => a.endsWith(".pdf")) ??
    join(raiz, "..", "..", "documento", "Proposta GEO 2701A-25 - CONT - Est Justaposta - GRAND PALLADIUM - 23.10.26.pdf");
  const gerado = join(raiz, "saida", `${pacote.saida.arquivo}.pdf`);
  for (const f of [original, gerado]) if (!existsSync(f)) throw new Error("Arquivo não encontrado: " + f);

  // Original: sem o cabeçalho de página do Word
  const orig = paginasTexto(original).map((t) => t.replace(/[\s\S]*?E-mail: projetos@geoforte\.com\.br\s*/, ""));
  const origCorpo = orig.slice(0, 8).join("\n");
  // o original repete o número da fase ("Fase 1" e logo abaixo "Fase 1 - Berma"); o gerado mostra "Fase 1 · Berma"
  const origMemorial = orig.slice(8, 27).join("\n").replace(/Fase (\d)\s*\n\s*(?=Fase \1\s*-)/g, "");

  // Gerado: só o corpo, sem a moldura
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
  const gerCorpoTudo = ger.slice(iCarta, iAnexo).map((t) => semMoldura(t, MOLDURA)).join("\n");
  const corte = gerCorpoTudo.search(/\n\s*11\s*\n?\s*Memorial de cálculo/);
  const gerCorpo = gerCorpoTudo.slice(0, corte);
  const gerMemorial = gerCorpoTudo.slice(corte);

  const d = diferencas(origCorpo, gerCorpo);
  console.log(`\n1) CARTA E CLÁUSULAS 1–10 — ${d.palavrasOriginal} palavras no original, ${d.palavrasGerado} no gerado, ${d.iguais} em comum`);
  console.log(`   ${d.blocos.length} trechos diferentes (- só no original · + só no gerado):\n`);
  imprimirBlocos(d.blocos);

  const { faltam, sobram, total } = comparaNumeros(numeros(origMemorial), numeros(gerMemorial));
  console.log(`\n2) MEMORIAL DE CÁLCULO — ${total} números no original`);
  console.log(`   faltando no gerado: ${lista(faltam)}`);
  console.log(`   a mais no gerado:   ${lista(sobram)}`);
}

// ═══ Fundação: o original é o Word (.docx) ═══════════════════════════════════
async function fundacao() {
  const { lerDocx, textoDoBloco } = await import("./importar/docx.mjs");
  const { lerEmf } = await import("./importar/emf.mjs");
  const docx =
    process.argv.find((a) => a.endsWith(".docx")) ??
    join(raiz, "..", "..", "documento", "fundacao", "Proposta GEO 2993A-26 - FUND - Hélice e Metálica - GRAND PALLADIUM - 28.10.26 (Em Rev).docx");
  const gerado = join(raiz, "saida", `${pacote.saida.arquivo}.pdf`);
  for (const f of [docx, gerado]) if (!existsSync(f)) throw new Error("Arquivo não encontrado: " + f);

  // Original: texto do Word, em três partes (carta + cláusulas, memorial, anexo)
  const { blocos, zip } = await lerDocx(readFileSync(docx));
  const textos = blocos.map(textoDoBloco).filter(Boolean);
  const iMem = textos.findIndex((t) => /^11\.\s+MEMORIAL DE CÁLCULO/i.test(t));
  const iAnexoDoc = textos.findIndex((t) => /^ANEXO$/i.test(t));
  if (iMem < 0 || iAnexoDoc < 0) throw new Error(`Não localizei o memorial (${iMem}) ou o anexo (${iAnexoDoc}) no Word.`);
  const origCorpo = textos.slice(0, iMem).join("\n");
  const origMemorial = textos.slice(iMem, iAnexoDoc).join("\n");

  // Gerado: da carta ao anexo, sem a moldura
  const ger = paginasTexto(gerado);
  const iCarta = ger.findIndex((t) => t.includes("Prezados Senhores"));
  // (o subtítulo do anexo quebra em duas linhas na página de abertura)
  const iAnexo = ger.findIndex((t) => /Obras executadas\s+Fundações\s+em\s+estacas\s+hélice\s+contínua\s+monitorada\s+e\s+estacas\s+metálicas/.test(t));
  if (iCarta < 0 || iAnexo < 0) throw new Error(`Não localizei a carta (${iCarta}) ou o anexo (${iAnexo}) no PDF gerado.`);
  const MOLDURA = [
    /^PROPOSTA GEO 2993A\/26$/,
    /^EXPANSÃO GRAND PALLADIUM IMBASSAÍ$/,
    /^Geofor Obras de Fundações Ltda · CNPJ/,
    /^Av\. Luís Viana Filho, 13145/,
    /^São Cristóvão · Salvador – BA$/,
    /^\(71\) 99708-2005/,
    /^Pág\. \d+$/,
  ];
  const gerTudo = ger.slice(iCarta, iAnexo).map((t) => semMoldura(t, MOLDURA)).join("\n");
  const corte = gerTudo.search(/\n\s*11\s*\n?\s*Memorial de cálculo/);
  const gerCorpo = gerTudo.slice(0, corte);
  const gerMemorial = gerTudo.slice(corte);

  const d1 = diferencas(origCorpo, gerCorpo);
  console.log(`\n1) CARTA E CLÁUSULAS 1–10 — ${d1.palavrasOriginal} palavras no original, ${d1.palavrasGerado} no gerado, ${d1.iguais} em comum`);
  console.log(`   ${d1.blocos.length} trechos diferentes (- só no original · + só no gerado):\n`);
  imprimirBlocos(d1.blocos);

  // O memorial do gerado traz também as tabelas (que no Word são imagens): só o que falta importa aqui.
  const d2 = diferencas(origMemorial, gerMemorial);
  const sobrando = d2.blocos.reduce((n, b) => n + (b.mais ? b.mais.split(" ").length : 0), 0);
  console.log(`\n2) MEMORIAL (texto) — ${d2.palavrasOriginal} palavras no original, ${d2.iguais} encontradas em ordem no gerado`);
  console.log(`   ${sobrando} palavras a mais no gerado (tabelas, fórmulas, legendas); trechos do original que NÃO estão no gerado:\n`);
  imprimirBlocos(
    d2.blocos.filter((b) => b.menos),
    { mais: true },
  );

  // Planilhas do Excel coladas como imagem (EMF): todos os números têm que estar no PDF
  const emfs = Object.keys(zip.files).filter((f) => /^word\/media\/image\d+\.emf$/.test(f));
  let esperado = "";
  for (const f of emfs) esperado += lerEmf(await zip.file(f).async("nodebuffer")).textos.map((t) => t.s).join("\n") + "\n";
  // As duas imagens coladas da Tabela 7 (Recepção) repetiam 11 linhas (P75 a P88): contadas uma vez no PDF.
  const { tabelas } = await import("./dados/fundacao/dados.mjs");
  const REPETIDAS = new Set(["P75", "P76", "P78", "P79", "P80", "P81", "P82", "P85", "P86", "P87", "P88"]);
  const bloco = tabelas.estaqueamento.recepcao.find((g) => g.rotulo === "BLOCO A");
  const repetidas = (bloco?.linhas ?? []).filter((l) => REPETIDAS.has(l.pilar));
  const gerNum = numeros(gerTudo.slice(gerTudo.search(/\n\s*5\s*\n?\s*Preços/)));
  for (const l of repetidas) for (const [k, v] of numeros(Object.values(l).join("\n"))) gerNum.set(k, (gerNum.get(k) ?? 0) + v);
  const { faltam } = comparaNumeros(numeros(esperado), gerNum);
  console.log(`\n3) PLANILHAS DO EXCEL (${emfs.length} imagens do Word) — ${[...numeros(esperado).values()].reduce((a, b) => a + b, 0)} números`);
  console.log(`   linhas repetidas no Word, contadas uma vez: ${repetidas.length} (${[...REPETIDAS].join(", ")})`);
  console.log(`   faltando no PDF: ${lista(faltam)}`);
}

if (id === "contencao") contencao();
else await fundacao();
