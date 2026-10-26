/**
 * Gera a proposta GEO 2701A/25 completa, na identidade visual do site:
 *
 *   capa → sumário → carta e cláusulas 1–10 → assinaturas → memorial (11)
 *   → Anexo B (abertura + obras executadas) → certificado GeoSelos original
 *
 *   npm install      (uma vez)
 *   npm run gerar    → saida/Proposta GEO 2701A-25 - Grand Palladium.pdf
 *
 * Usa o Chrome instalado (ou CHROME_PATH). Fontes, logos e fotos são locais:
 * não precisa de internet.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import * as mupdf from "mupdf";
import { raiz } from "./src/util.mjs";
import { htmlCapa, htmlSumario, entradasSumario } from "./src/frente.mjs";
import { htmlCorpo } from "./src/corpo.mjs";
import { htmlAnexo, htmlAnexoAbertura } from "./src/anexo.mjs";
import { htmlMoldura } from "./src/moldura.mjs";
import { proposta } from "./dados/empresa.mjs";
import { obras } from "./dados/obras.mjs";

const saida = join(raiz, "saida");
const pastaHtml = join(saida, "html");
mkdirSync(pastaHtml, { recursive: true });
const ARQUIVO_FINAL = join(saida, "Proposta GEO 2701A-25 - Grand Palladium.pdf");

const chromes = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = chromes.find((p) => existsSync(p));
if (!executablePath) throw new Error("Chrome não encontrado. Defina CHROME_PATH.");

const browser = await puppeteer.launch({ executablePath, headless: true });

/** Grava o HTML (útil para inspecionar) e imprime em PDF. */
async function imprimir(nome, html, opcoes) {
  const arquivo = join(pastaHtml, `${nome}.html`);
  writeFileSync(arquivo, html, "utf8");
  const page = await browser.newPage();
  await page.goto(pathToFileURL(arquivo).href, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  const fontesOk = await page.evaluate(
    () => document.fonts.check('700 12pt "Space Grotesk"') && document.fonts.check('400 12pt "Manrope"'),
  );
  if (!fontesOk) throw new Error(`Fontes da marca não carregaram em ${nome}.html`);
  const pdf = await page.pdf({ format: "A4", printBackground: true, ...opcoes });
  await page.close();
  return pdf;
}

/** Páginas com moldura: o tamanho e as margens vêm do @page do próprio HTML. */
const PAGINA = { preferCSSPageSize: true };
/** Páginas inteiras, sem moldura (capa e abertura do anexo). */
const SANGRIA = { preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } };

/**
 * Carimba a moldura (cabeçalho e rodapé) por cima de cada página do conteúdo.
 * @param {(i:number)=>string} rotulo  rótulo da página i (0-based): "Pág. 3", "B.2" ou ""
 */
async function carimbar(nome, conteudo, rotulo) {
  const doc = await PDFDocument.load(conteudo);
  const n = doc.getPageCount();
  const moldura = await imprimir(`moldura-${nome}`, htmlMoldura(Array.from({ length: n }, (_, i) => rotulo(i))), PAGINA);
  const folhas = await doc.embedPdf(moldura, [...Array(n).keys()]);
  doc.getPages().forEach((p, i) => {
    const { width, height } = p.getSize();
    p.drawPage(folhas[i], { x: 0, y: 0, width, height });
  });
  return doc.save();
}

const contarPaginas = async (bytes) => (await PDFDocument.load(bytes)).getPageCount();

/** Página (1-based) de cada marca §TOC:id§ no PDF. */
function localizarMarcas(bytes) {
  const doc = mupdf.Document.openDocument(bytes, "application/pdf");
  const achadas = {};
  for (let i = 0; i < doc.countPages(); i++) {
    const texto = doc.loadPage(i).toStructuredText().asText();
    for (const m of texto.matchAll(/§TOC:([^§]+)§/g)) achadas[m[1]] ??= i + 1;
  }
  return achadas;
}

// 1) Corpo, 1ª passada: com as marcas, só para descobrir as páginas das seções.
//    As marcas têm position:absolute, então não mexem na paginação.
const corpoMarcado = await imprimir("corpo-marcas", htmlCorpo({ marcas: true }), PAGINA);
const paginas = localizarMarcas(corpoMarcado);
const faltando = entradasSumario().filter((e) => !e.pagina && !paginas[e.id]);
if (faltando.length) throw new Error("Seções não localizadas no PDF: " + faltando.map((e) => e.id).join(", "));

// 2) Corpo final (sem marcas) — conferindo que a paginação não mudou.
const corpoBruto = await imprimir("corpo", htmlCorpo(), PAGINA);
const nCorpo = await contarPaginas(corpoBruto);
if (nCorpo !== (await contarPaginas(corpoMarcado))) throw new Error("Paginação do corpo mudou entre as passadas.");

// 3) Capa, sumário e anexo (abertura sem moldura + uma página por obra).
const capa = await imprimir("capa", htmlCapa(), SANGRIA);
const sumarioBruto = await imprimir("sumario", htmlSumario(paginas), PAGINA);
const abertura = await imprimir("anexo-abertura", htmlAnexoAbertura(), SANGRIA);
const anexoBruto = await imprimir("anexo", htmlAnexo(), PAGINA);

for (const [nome, bytes, esperado] of [
  ["capa", capa, 1],
  ["sumário", sumarioBruto, 1],
  ["abertura do anexo", abertura, 1],
  ["anexo", anexoBruto, obras.length],
]) {
  const n = await contarPaginas(bytes);
  if (n !== esperado) throw new Error(`${nome}: ${n} páginas (esperado ${esperado}) — algum conteúdo transbordou.`);
}
// 4) Moldura em todas as páginas, exceto a capa e a abertura do anexo (B.1).
const sumario = await carimbar("sumario", sumarioBruto, () => "");
const corpo = await carimbar("corpo", corpoBruto, (i) => `Pág. ${i + 1}`);
const anexo = await carimbar("anexo", anexoBruto, (i) => `B.${i + 2}`);
await browser.close();

// 5) Junta as partes e acrescenta o certificado GeoSelos original (não refeito).
const final = await PDFDocument.create();
const partes = [capa, sumario, corpo, abertura, anexo, readFileSync(join(raiz, "assets", "certificado-geoselos.pdf"))];
for (const bytes of partes) {
  const src = await PDFDocument.load(bytes);
  for (const p of await final.copyPages(src, src.getPageIndices())) final.addPage(p);
}
final.setTitle(`Proposta ${proposta.codigo} — Contenções em estacas justapostas — Expansão Grand Palladium`);
final.setAuthor("Geofor Obras de Fundações Ltda");
final.setSubject("Proposta técnica e comercial: projeto e execução global das contenções em estacas justapostas");
final.setLanguage("pt-BR");
final.setCreator("Geoforte — gerador de propostas (tools/proposta)");
writeFileSync(ARQUIVO_FINAL, await final.save());
// Cópia baixada pela proposta web do site (/propostas/grand-palladium).
const pastaWeb = join(raiz, "..", "..", "public", "propostas", "grand-palladium");
if (existsSync(pastaWeb)) copyFileSync(ARQUIVO_FINAL, join(pastaWeb, "Proposta-GEO-2701A-25-Grand-Palladium.pdf"));

console.log("Páginas das seções (Pág. n):", JSON.stringify(paginas));
console.log(`Corpo: ${nCorpo} páginas · Total: ${final.getPageCount()} páginas`);
console.log("PDF:", ARQUIVO_FINAL);
