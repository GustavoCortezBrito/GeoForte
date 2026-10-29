/**
 * Lê o HTML que o gerador do PDF já imprimiu (saida/html/<proposta>/) para o Word sair igual:
 * mede posições e tamanhos (fotos, figuras, blocos da capa) e rasteriza o que o Word não desenha
 * sozinho — o fundo grafite com a malha e o símbolo da capa, o fundo da abertura do anexo, os
 * logos (SVG) e o certificado GeoSelos (PDF).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import * as mupdf from "mupdf";
import { dataUri, raiz } from "../util.mjs";

const chromes = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);

const PX_MM = 96 / 25.4;

/**
 * @param {string} pastaHtml  saida/html/<proposta>
 * @returns medidas e imagens (Buffers) para o Word
 */
export async function medir(pastaHtml) {
  for (const f of ["capa.html", "corpo.html", "anexo-abertura.html", "anexo.html", "paginas.json"])
    if (!existsSync(join(pastaHtml, f))) throw new Error(`Falta ${f} em ${pastaHtml}: gere o PDF antes (npm run gerar…).`);
  const executablePath = chromes.find((p) => existsSync(p));
  if (!executablePath) throw new Error("Chrome não encontrado. Defina CHROME_PATH.");
  const browser = await puppeteer.launch({ executablePath, headless: true });
  const page = await browser.newPage();
  await page.emulateMediaType("print");

  const abrir = async (arquivo, larguraMm, alturaMm) => {
    await page.setViewport({ width: Math.round(larguraMm * PX_MM), height: Math.round(alturaMm * PX_MM), deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(join(pastaHtml, arquivo)).href, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
  };
  /** retângulos (mm) dos elementos, relativos a `base` (ou à página) */
  const caixas = (sel, base) =>
    page.evaluate(
      (sel, base, k) => {
        const b = base ? document.querySelector(base).getBoundingClientRect() : { left: 0, top: 0 };
        return [...document.querySelectorAll(sel)].map((e) => {
          const r = e.getBoundingClientRect();
          return { x: (r.left - b.left) / k, y: (r.top - b.top) / k, w: r.width / k, h: r.height / k, src: e.currentSrc || e.getAttribute("src") || "" };
        });
      },
      sel,
      base,
      PX_MM,
    );
  /** quebras de linha de um texto como o Chrome fez no PDF (para o Word quebrar igual) */
  const linhasDe = (sel) =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const linhas = [];
      let atual = [];
      let topo = null;
      const range = document.createRange();
      const andar = (no) => {
        if (no.nodeType === 3) {
          let pos = 0;
          for (const w of no.textContent.split(" ")) {
            if (w) {
              range.setStart(no, pos);
              range.setEnd(no, pos + w.length);
              const t = range.getClientRects()[0]?.top ?? topo;
              if (topo != null && Math.abs(t - topo) > 4) {
                linhas.push(atual.join(" "));
                atual = [];
              }
              topo = t;
              atual.push(w);
            }
            pos += w.length + 1;
          }
        } else for (const f of no.childNodes) andar(f);
      };
      andar(el);
      if (atual.length) linhas.push(atual.join(" "));
      return linhas;
    }, sel);
  /** fundo de uma página inteira (capa / abertura), sem os textos e fotos */
  const fundo = async (esconder) => {
    await page.setViewport({ width: Math.round(210 * PX_MM), height: Math.round(297 * PX_MM), deviceScaleFactor: 2.5 });
    await page.addStyleTag({ content: `${esconder}{visibility:hidden!important}` });
    const el = await page.$(".capa");
    return Buffer.from(await el.screenshot({ type: "jpeg", quality: 88 }));
  };
  /** SVG/PNG em assets → PNG nítido com fundo transparente */
  const rasterizar = async (arquivo, alturaPx) => {
    const p = await browser.newPage(); // página nova: about:blank, sem o estado do HTML anterior
    await p.setViewport({ width: 1600, height: alturaPx + 20, deviceScaleFactor: 1 });
    await p.setContent(`<html><body style="margin:0;background:transparent"><img id="i" src="${dataUri(arquivo)}" style="height:${alturaPx}px;display:block"></body></html>`, { waitUntil: "load" });
    const el = await p.$("#i");
    const png = Buffer.from(await el.screenshot({ type: "png", omitBackground: true }));
    await p.close();
    return png;
  };


  const m = {};

  // Capa
  await abrir("capa.html", 210, 297);
  m.capa = Object.fromEntries(
    await Promise.all(
      [
        ["logo", ".capa-logo"],
        ["cod", ".capa-cod"],
        ["tipo", ".capa-tipo"],
        ["titulo", ".capa-titulo"],
        ["sub", ".capa-sub"],
        ["fio", ".capa-fio"],
        ["obra", ".capa-obra"],
        ["fatos", ".capa-fatos"],
        ["pe", ".capa-pe"],
      ].map(async ([k, s]) => [k, (await caixas(s, ".capa"))[0]]),
    ),
  );
  m.capa.linhasTitulo = await linhasDe(".capa-titulo");
  m.capa.linhasSub = await linhasDe(".capa-sub");
  m.capa.fundo = await fundo(".capa-topo,.capa-meio,.capa-pe");

  // Abertura do anexo
  await abrir("anexo-abertura.html", 210, 297);
  m.abertura = {
    topo: (await caixas(".capa-topo", ".capa"))[0],
    cab: (await caixas(".ab-cab", ".capa"))[0],
    titulo: (await caixas(".ab-titulo", ".capa"))[0],
    grade: (await caixas(".ab-grade", ".capa"))[0],
    fotos: await caixas(".ab-foto", ".capa"),
    textos: await caixas(".ab-txt", ".capa"),
    pe: (await caixas(".ab-pe", ".capa"))[0],
  };
  m.abertura.linhasSub = await linhasDe(".ab-sub");
  m.abertura.fundo = await fundo(".capa-topo,.ab-cab,.ab-grade,.ab-pe");

  // Páginas do anexo (uma .pag por página, 174 × 234 mm)
  await abrir("anexo.html", 174, 234);
  m.anexo = await page.evaluate((k) => {
    return [...document.querySelectorAll(".pag")].map((pag) => {
      const b = pag.getBoundingClientRect();
      const rel = (e) => {
        const r = e.getBoundingClientRect();
        return { x: (r.left - b.left) / k, y: (r.top - b.top) / k, w: r.width / k, h: r.height / k };
      };
      const um = (s) => (pag.querySelector(s) ? rel(pag.querySelector(s)) : null);
      return {
        fotos: [...pag.querySelectorAll(".ob-foto img")].map((i) => ({ ...rel(i.parentElement), src: i.getAttribute("src") })),
        topo: um(".ob-topo"),
        legenda: um(".ob-legenda") ?? um(".of-leg"),
        etapas: um(".ob-etapas"),
        fatos: um(".ob-fatos"),
        base: um(".ob-base"),
        tabela: um(".cmp"),
        frase: um(".cmp-frase"),
        cmpFotos: um(".cmp-fotos"),
      };
    });
  }, PX_MM);

  m.cmpCols = await page.evaluate((k) => [...document.querySelectorAll(".cmp thead th")].map((th) => th.getBoundingClientRect().width / k), PX_MM);

  // Fotos já recortadas como no PDF (com o número no canto), em alta resolução
  const fotografar = async (arquivo, larguraMm, alturaMm, sel) => {
    await page.setViewport({ width: Math.round(larguraMm * PX_MM), height: Math.round(alturaMm * PX_MM), deviceScaleFactor: 2.5 });
    await page.goto(pathToFileURL(join(pastaHtml, arquivo)).href, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const out = [];
    for (const el of await page.$$(sel)) out.push(Buffer.from(await el.screenshot({ type: "jpeg", quality: 90 })));
    return out;
  };
  const fotosAnexo = await fotografar("anexo.html", 174, 234, ".ob-foto");
  let idx = 0;
  for (const pag of m.anexo) for (const f of pag.fotos) f.jpg = fotosAnexo[idx++];
  const fotosAbertura = await fotografar("anexo-abertura.html", 210, 297, ".ab-foto");
  m.abertura.fotos.forEach((f, i) => (f.jpg = fotosAbertura[i]));

  // Corpo: tamanho de cada imagem, na ordem do documento (figuras do memorial, fases…)
  await abrir("corpo.html", 174, 234);
  m.corpo = {
    imagens: await caixas("img", null),
    totais: await caixas(".total-v", null),
    /** colunas (mm) de cada tabela, por classe e na ordem: lidas da linha com mais células */
    tabelas: await page.evaluate((k) => {
      const out = {};
      for (const t of document.querySelectorAll("table")) {
        const linhas = [...t.rows];
        const cheia = linhas.reduce((a, r) => (r.cells.length > (a?.cells.length ?? 0) ? r : a), null);
        const cols = cheia ? [...cheia.cells].map((c) => c.getBoundingClientRect().width / k) : [];
        const chave = [...t.classList].filter((c) => c !== "t").join(".") || "t";
        (out[chave] ??= []).push({ cols, largura: t.getBoundingClientRect().width / k });
      }
      return out;
    }, PX_MM),
  };

  // Logos
  m.logo = await rasterizar("logos/geoforte-logo.svg", 230);
  m.logoInvertido = await rasterizar("logos/geoforte-logo-invertido.svg", 300);

  await browser.close();

  // Certificado GeoSelos: a página do PDF original vira imagem de página inteira
  const cert = mupdf.Document.openDocument(readFileSync(join(raiz, "assets", "certificado-geoselos.pdf")), "application/pdf");
  const k = 200 / 72;
  m.certificado = Buffer.from(cert.loadPage(0).toPixmap(mupdf.Matrix.scale(k, k), mupdf.ColorSpace.DeviceRGB, false, true).asJPEG(90));

  m.paginas = JSON.parse(readFileSync(join(pastaHtml, "paginas.json"), "utf8")).paginas;
  return m;
}
