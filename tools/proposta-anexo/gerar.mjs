/**
 * Gera o Anexo B — Obras executadas (PDF A4, retrato, 5 páginas).
 *
 *   npm install      (uma vez)
 *   npm run gerar    → saida/anexo-b.html e saida/anexo-b-obras-executadas.pdf
 *
 * Usa o Chrome instalado na máquina (ou CHROME_PATH). Identidade visual do site
 * da Geoforte: grafite #22252A, laranja #EF6C1A, papel #FAFAF8, Space Grotesk
 * (títulos) e Manrope (texto). O conteúdo está em dados.mjs.
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { proposta, empresa, abertura, obras, placeholders } from "./dados.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const saida = join(here, "saida");
const asset = (p) => pathToFileURL(join(here, "assets", p)).href;

// ─── Utilidades ─────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Valor preenchido ou placeholder destacado (campo ainda sem dado). */
const val = (v, ph) => (v == null || v === "" ? `<span class="ph">${esc(ph)}</span>` : esc(v));

// ─── Peças comuns ───────────────────────────────────────────────────────────
const cabecalho = () => `
  <header class="cab">
    <img class="cab-logo" src="${asset("logos/geoforte-logo.svg")}" alt="Geoforte Fundações" />
    <div class="cab-txt">${esc(proposta.codigo)}<br />${esc(proposta.projeto)}</div>
  </header>
  <div class="fio" aria-hidden="true"></div>`;

const rodape = (pagina) => `
  <footer class="rod">
    <div class="rod-txt">
      <strong>${esc(empresa.razaoSocial)} · CNPJ ${esc(empresa.cnpj)}</strong><br />
      ${esc(empresa.endereco)}<br />
      ${esc(empresa.cidade)}<br />
      ${esc(empresa.contatos)}
    </div>
    <div class="rod-selos">
      <img class="selo-abef" src="${asset("logos/logo-abef.png")}" alt="ABEF" />
      <img class="selo-geoselos" src="${asset("logos/geoselos-medalha.png")}" alt="GeoSelos" />
      <span class="rod-pag">${esc(pagina)}</span>
    </div>
  </footer>`;

const pagina = (num, corpo) => `
  <section class="pagina">
    ${cabecalho()}
    <main class="corpo">${corpo}</main>
    ${rodape(num)}
  </section>`;

// ─── B.1 — Abertura ─────────────────────────────────────────────────────────
const paginaAbertura = () =>
  pagina(
    "B.1",
    `
    <p class="sobre">${esc(abertura.sobretitulo)}</p>
    <h1 class="titulo">${esc(abertura.titulo)}</h1>
    <p class="subtitulo">${esc(abertura.subtitulo)}</p>
    <p class="intro">${esc(abertura.texto)}</p>

    <div class="grade">
      ${obras
        .map(
          (o, i) => `
        <article class="card">
          <div class="card-foto">
            <img src="${asset("fotos/" + o.fotoPrincipal.arquivo)}" alt="${esc(o.nome)}" />
            <span class="num">${esc(o.numero)}</span>
          </div>
          <div class="card-txt">
            <div>
              <h2 class="card-nome">${esc(o.nome)}</h2>
              <p class="card-constr">${esc(o.construtora)}</p>
            </div>
            <span class="card-pag">PÁG. B.${i + 2}</span>
          </div>
        </article>`,
        )
        .join("")}
    </div>`,
  );

// ─── B.2 a B.5 — Uma página por obra ────────────────────────────────────────
const linhaFicha = (rotulo, valorHtml) => `
  <div class="ficha-linha"><span class="ficha-rot">${esc(rotulo)}</span><span class="ficha-val">${valorHtml}</span></div>`;

const paginaObra = (o, i) => {
  const f = o.ficha;
  const complemento = f.complemento.confirmar
    ? `<span class="ph ph-2l">${esc(f.complemento.valor)}<br />[confirmar]</span>`
    : esc(f.complemento.valor);

  return pagina(
    `B.${i + 2}`,
    `
    <p class="sobre">ANEXO B · OBRAS EXECUTADAS</p>
    <div class="obra-topo">
      <span class="num num-grande">${esc(o.numero)}</span>
      <div>
        <h1 class="obra-nome">${esc(o.nome)}</h1>
        <p class="obra-linha">${esc(o.construtora)} · ${val(o.bairro, placeholders.bairro)}, Salvador – BA · ${val(o.ano, placeholders.ano)}</p>
      </div>
    </div>

    <figure class="foto-principal">
      <img src="${asset("fotos/" + o.fotoPrincipal.arquivo)}" alt="${esc(o.fotoPrincipal.legenda)}" />
      <figcaption class="legenda">${esc(o.fotoPrincipal.legenda)}</figcaption>
    </figure>

    <div class="duas">
      <figure class="foto-detalhe">
        <img src="${asset("fotos/" + o.fotoDetalhe.arquivo)}" alt="${esc(o.fotoDetalhe.legenda)}" />
        <figcaption class="legenda">${esc(o.fotoDetalhe.legenda)}</figcaption>
      </figure>
      <div class="ficha">
        <p class="ficha-tit">Ficha técnica</p>
        ${linhaFicha("Solução", esc(f.solucao))}
        ${linhaFicha("Complemento", complemento)}
        ${linhaFicha("Área de contenção", val(f.areaContencao, placeholders.areaContencao))}
        ${linhaFicha("Altura de escavação", val(f.alturaEscavacao, placeholders.alturaEscavacao))}
        ${linhaFicha("Estacas", val(f.estacas, placeholders.estacas))}
        ${linhaFicha("Execução", val(f.execucao, placeholders.execucao))}
      </div>
    </div>

    <div class="destaque">
      <p class="sobre sobre-destaque">Destaque da obra</p>
      ${
        o.destaque
          ? `<p class="destaque-txt">${esc(o.destaque)}</p>`
          : `<p class="destaque-txt"><span class="ph ph-bloco">${esc(placeholders.destaque)}</span></p>`
      }
    </div>`,
  );
};

// ─── Estilos ────────────────────────────────────────────────────────────────
const css = `
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --grafite: #22252a; --grafite-2: #555b66; --grafite-3: #696f7a;
  --laranja: #ef6c1a; --laranja-ink: #b94e0c; --laranja-wash: #fbf0e8;
  --papel: #fafaf8; --painel: #f1f0ec; --fio: rgba(34,37,42,.14);
}
html, body { background: #fff; color: var(--grafite); }
body { font-family: "Manrope", system-ui, sans-serif; font-size: 10pt; line-height: 1.45;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1, h2, .sobre, .num, .cab-txt, .card-pag, .ficha-tit, .legenda, .rod-pag {
  font-family: "Space Grotesk", system-ui, sans-serif; }
img { display: block; }

/* Página A4: 210 × 297 mm, margens internas ≥ 12 mm */
.pagina { width: 210mm; height: 297mm; padding: 12mm 14mm 11mm; display: flex; flex-direction: column;
  overflow: hidden; page-break-after: always; break-after: page; background: #fff; }
.pagina:last-child { page-break-after: auto; break-after: auto; }

/* Cabeçalho */
.cab { display: flex; align-items: center; justify-content: space-between; }
.cab-logo { height: 11mm; width: auto; }
.cab-txt { text-align: right; font-weight: 700; font-size: 9pt; letter-spacing: .08em; line-height: 1.35; color: var(--grafite); }
.fio { margin-top: 4mm; height: .6mm;
  background: linear-gradient(to right, var(--laranja) 0, var(--laranja) 18mm, var(--fio) 18mm, var(--fio) 100%); }

.corpo { flex: 1; display: flex; flex-direction: column; padding-top: 8mm; min-height: 0; }

/* Rodapé */
.rod { margin-top: 5mm; padding-top: 4mm; border-top: .3mm solid var(--fio); display: flex; align-items: center;
  justify-content: space-between; gap: 6mm; }
.rod-txt { font-size: 9pt; line-height: 1.4; color: var(--grafite-2); }
.rod-txt strong { color: var(--grafite); font-weight: 700; }
.rod-selos { display: flex; align-items: center; gap: 4mm; flex-shrink: 0; }
.selo-abef { height: 9mm; width: auto; }
.selo-geoselos { height: 12mm; width: auto; }
.rod-pag { padding-left: 4mm; border-left: .3mm solid var(--fio); font-weight: 700; font-size: 10pt; color: var(--grafite); }

/* Tipografia de títulos */
.sobre { font-weight: 700; font-size: 9pt; letter-spacing: .16em; text-transform: uppercase; color: var(--laranja-ink); }
.titulo { margin-top: 2.5mm; font-weight: 700; font-size: 38pt; line-height: 1.02; letter-spacing: -.03em; }
.subtitulo { margin-top: 3mm; font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 500; font-size: 15pt;
  line-height: 1.25; color: var(--grafite); }
.intro { margin-top: 4mm; font-size: 11pt; line-height: 1.55; color: var(--grafite-2); max-width: 160mm; }

/* Número da obra */
.num { display: inline-flex; align-items: center; justify-content: center; width: 9.5mm; height: 9.5mm;
  background: var(--grafite); color: #fff; font-weight: 700; font-size: 11pt; letter-spacing: .02em; }
.num-grande { width: 15mm; height: 15mm; font-size: 16pt; flex-shrink: 0; }

/* B.1 — grade 2 × 2 */
.grade { margin-top: 8mm; flex: 1; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;
  gap: 7mm 6mm; min-height: 0; }
.card { display: flex; flex-direction: column; min-height: 0; }
.card-foto { position: relative; flex: 1; min-height: 0; border-top: .8mm solid var(--grafite); }
.card-foto img { width: 100%; height: 100%; object-fit: cover; }
.card-foto .num { position: absolute; top: 0; left: 0; }
.card-txt { display: flex; align-items: flex-start; justify-content: space-between; gap: 4mm; padding-top: 3mm; }
.card-nome { font-weight: 700; font-size: 13pt; line-height: 1.15; letter-spacing: -.01em; }
.card-constr { margin-top: .8mm; font-size: 9.5pt; color: var(--grafite-2); }
.card-pag { flex-shrink: 0; font-weight: 700; font-size: 9pt; letter-spacing: .1em; color: var(--grafite-3); padding-top: 1mm; }

/* B.2–B.5 — obra */
.obra-topo { margin-top: 3.5mm; display: flex; align-items: center; gap: 5mm; }
.obra-nome { font-weight: 700; font-size: 26pt; line-height: 1.05; letter-spacing: -.025em; }
.obra-linha { margin-top: 1.2mm; font-size: 10.5pt; color: var(--grafite-2); }

.foto-principal { position: relative; margin-top: 6mm; height: 96mm; flex-shrink: 0; }
.foto-principal img, .foto-detalhe img { width: 100%; height: 100%; object-fit: cover; }
.legenda { position: absolute; left: 3.5mm; bottom: 3.5mm; padding: 1.4mm 2.6mm; background: rgba(34,37,42,.92);
  color: #fff; font-weight: 500; font-size: 9pt; line-height: 1.2; }

.duas { margin-top: 5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; height: 70mm; flex-shrink: 0; }
.foto-detalhe { position: relative; height: 100%; }

.ficha { background: var(--painel); padding: 5mm 5.5mm; display: flex; flex-direction: column; }
.ficha-tit { font-weight: 700; font-size: 9pt; letter-spacing: .16em; text-transform: uppercase; padding-bottom: 3mm;
  margin-bottom: .5mm; border-bottom: .6mm solid var(--grafite); }
.ficha-linha { flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 4mm;
  border-bottom: .3mm solid var(--fio); }
.ficha-linha:last-child { border-bottom: 0; }
.ficha-rot { font-size: 9.5pt; color: var(--grafite-2); }
.ficha-val { font-size: 10pt; font-weight: 700; text-align: right; color: var(--grafite); }

.destaque { margin-top: 5mm; }
.sobre-destaque { margin-bottom: 2mm; }
.destaque-txt { font-size: 11pt; line-height: 1.5; }

/* Placeholder: campo sem dado, visível na revisão (e também em escala de cinza) */
.ph { background: var(--laranja-wash); color: var(--laranja-ink); font-weight: 700;
  outline: .3mm dashed var(--laranja-ink); outline-offset: -.3mm; padding: .2mm 1.3mm; }
.ph-2l { display: inline-block; line-height: 1.3; padding: .6mm 1.6mm; }
.ph-bloco { display: block; padding: 3mm 3.5mm; font-weight: 600; }
`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Anexo B — Obras executadas · ${esc(proposta.codigo)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=block" rel="stylesheet" />
  <style>${css}</style>
</head>
<body>
  ${paginaAbertura()}
  ${obras.map(paginaObra).join("")}
</body>
</html>`;

// ─── Saída ──────────────────────────────────────────────────────────────────
if (!existsSync(saida)) mkdirSync(saida, { recursive: true });
const htmlPath = join(saida, "anexo-b.html");
writeFileSync(htmlPath, html, "utf8");

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
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
// Confere se as fontes da marca carregaram de fato (sem elas o PDF sai com fonte do sistema)
const fontes = await page.evaluate(() => ({
  grotesk: document.fonts.check('700 12pt "Space Grotesk"'),
  manrope: document.fonts.check('400 12pt "Manrope"'),
}));
if (!fontes.grotesk || !fontes.manrope) {
  console.warn("Aviso: fontes da marca não carregaram (sem internet?).", fontes);
}
const pdfPath = join(saida, "anexo-b-obras-executadas.pdf");
await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("HTML:", htmlPath);
console.log("PDF :", pdfPath);
