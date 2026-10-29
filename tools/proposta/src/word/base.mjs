/**
 * Peças do Word no desenho do PDF: medidas (mm → twips), cores e fontes da marca, texto com
 * **negrito**, parágrafos, tabelas sem bordas por padrão, imagens com recorte e as marcas que
 * viram campos/equações/marcadores depois que o .docx é montado (ver posProcessar).
 *
 * As medidas e cores são as de src/estilos.mjs: o Word reproduz o mesmo desenho com o que o
 * Word tem (tabelas para grades e caixas, bordas de célula para os fios, recuos para as colunas).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AlignmentType,
  BorderStyle,
  HorizontalPositionRelativeFrom,
  ImageRun,
  LineRuleType,
  NoBreakHyphen,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  VerticalPositionRelativeFrom,
  WidthType,
  HeightRule,
} from "docx";
import JSZip from "jszip";
import { raiz } from "../util.mjs";

// ─── Medidas ──────────────────────────────────────────────────────────────────────────────────
/** mm → twips (1/20 pt) */
export const mm = (v) => Math.round(v * 56.6929);
/** pt → meios-pontos (tamanho de fonte do Word) */
export const pt = (v) => Math.round(v * 2);
/** espessura de borda em mm → oitavos de ponto */
export const bmm = (v) => Math.max(2, Math.round((v / 0.3528) * 8));
/** mm → pixels a 96 dpi (tamanho de imagem no docx) */
export const px = (v) => Math.round((v / 25.4) * 96);

/** Largura útil da página com moldura (A4, margens laterais de 18 mm). */
export const UTIL = 174;

// ─── Cores (estilos.mjs; as transparências já misturadas com o fundo) ─────────────────────────
export const COR = {
  g: "22252A",
  g2: "4F5560",
  g3: "6B717C",
  g4: "9AA0A9",
  o: "EF6C1A",
  oi: "B94E0C",
  ow: "FBF0E8",
  painel: "F3F2EE",
  zebra: "F8F7F4",
  fio: "E2E3E3", // rgba(34,37,42,.13) sobre branco
  fio2: "C1C2C3", // rgba(34,37,42,.28)
  papel: "FAFAF8",
  branco: "FFFFFF",
  cinzaClaro: "C9CCD2",
  cinzaCapa: "B9BDC4",
  cab2: "3A3E45", // 2ª linha de cabeçalho das tabelas
  // sobre o grafite da capa
  fioCapa22: "52545A",
  fioCapa16: "474A4F",
  fioCapa18: "494B4F",
  fioCapa85: "D8D8D7",
};

export const TEXTO = "Manrope";
export const MONO = "Space Grotesk";

/** Fontes embutidas no .docx (TrueType estáticas geradas das variáveis do Google Fonts, OFL). */
export const fontesEmbutidas = () => {
  const f = (n) => readFileSync(join(raiz, "assets", "fonts", "word", n));
  return [
    { name: TEXTO, data: f("Manrope-Regular.ttf"), bold: f("Manrope-Bold.ttf") },
    { name: MONO, data: f("SpaceGrotesk-Regular.ttf"), bold: f("SpaceGrotesk-Bold.ttf") },
  ];
};

// ─── Texto ────────────────────────────────────────────────────────────────────────────────────
/**
 * Trechos de texto. `t` aceita **negrito**; opções: fonte ("texto" | "mono"), tam (pt), negrito,
 * cor, corForte (cor dos trechos em **negrito**), italico, caixaAlta, espaco (letter-spacing em em).
 */
export function txt(t, o = {}) {
  const tam = o.tam ?? 9.6;
  const espaco = o.espaco != null ? Math.round(o.espaco * tam * 20) : undefined;
  // CNPJ não quebra no hífen (no PDF ele é nowrap): hífen inseparável do Word
  const filhos = (texto) =>
    /\/\d{4}-\d{2}/.test(texto) ? texto.split(/(?<=\/\d{4})-(?=\d{2})/).flatMap((p, i) => (i ? [new NoBreakHyphen(), p] : [p])) : [texto];
  const base = (texto, forte) =>
    new TextRun({
      children: filhos(texto),
      font: o.fonte === "mono" ? MONO : TEXTO,
      size: pt(tam),
      bold: forte || o.negrito || undefined,
      italics: o.italico || undefined,
      color: (forte && o.corForte) || o.cor || COR.g,
      allCaps: o.caixaAlta || undefined,
      characterSpacing: espaco,
      highlight: o.realce,
    });
  // sem quebra entre "R$" e o valor
  const limpo = String(t).replace(/R\$ (?=\d)/g, "R$\u00a0");
  // "\n" no texto = quebra de linha do Word (no w:t ele viraria espaço)
  return limpo.split("\n").flatMap((linha, i) => [
    ...(i ? [new TextRun({ break: 1, font: o.fonte === "mono" ? MONO : TEXTO, size: pt(tam) })] : []),
    ...linha
      .split(/(\*\*[^*]+\*\*)/)
      .filter(Boolean)
      .map((p) => (p.startsWith("**") && p.endsWith("**") ? base(p.slice(2, -2), true) : base(p, false))),
  ]);
}

/** Várias linhas com quebra manual (as mesmas quebras do PDF). */
export const linhasTxt = (linhas, o) => linhas.flatMap((l, i) => [...(i ? [new TextRun({ break: 1, font: o.fonte === "mono" ? MONO : TEXTO, size: pt(o.tam ?? 9.6) })] : []), ...txt(l, o)]);

/** Espaçamento de linha "pelo menos" (como o line-height do CSS, que é tamanho × fator). */
export const linha = (tam, fator) => ({ line: Math.round(tam * fator * 20), lineRule: LineRuleType.AT_LEAST });
export const linhaExata = (tam, fator) => ({ line: Math.round(tam * fator * 20), lineRule: LineRuleType.EXACT });

/**
 * Parágrafo. `filhos` = texto (com **negrito**) ou lista de TextRun/ImageRun.
 * o: antes/depois (mm), tam, fator (line-height), alinhar, recuo {esq, pend, dir} (mm), tabs,
 * manter (keepNext), quebra (pageBreakBefore), borda {topo|base: {cor, mm, espaco}}, fundo.
 */
export function par(filhos, o = {}) {
  const tam = o.tam ?? 9.6;
  const children = Array.isArray(filhos) ? filhos : txt(filhos, o);
  const borda = {};
  for (const lado of ["topo", "base", "esq", "dir"]) {
    const b = o.borda?.[lado];
    if (!b) continue;
    const chave = { topo: "top", base: "bottom", esq: "left", dir: "right" }[lado];
    borda[chave] = { style: BorderStyle.SINGLE, size: bmm(b.mm ?? 0.25), color: b.cor ?? COR.fio, space: Math.round(((b.espaco ?? 0) / 0.3528)) };
  }
  return new Paragraph({
    children,
    spacing: { before: mm(o.antes ?? 0), after: mm(o.depois ?? 0), ...(o.exata ? linhaExata(tam, o.fator ?? 1.52) : linha(tam, o.fator ?? 1.52)) },
    alignment: o.alinhar,
    indent: o.recuo ? { left: mm(o.recuo.esq ?? 0), hanging: o.recuo.pend ? mm(o.recuo.pend) : undefined, right: o.recuo.dir ? mm(o.recuo.dir) : undefined } : undefined,
    tabStops: o.tabs?.map((t) => ({ type: t.tipo, position: mm(t.mm), leader: t.guia })),
    keepNext: o.manter || undefined,
    keepLines: o.junto || undefined,
    pageBreakBefore: o.quebra || undefined,
    border: Object.keys(borda).length ? borda : undefined,
    shading: o.fundo ? { type: ShadingType.CLEAR, color: "auto", fill: o.fundo } : undefined,
    widowControl: true,
  });
}

/** Parágrafo vazio com altura exata (espaçador). */
export const espaco = (alturaMm) =>
  new Paragraph({ children: [], spacing: { before: 0, after: 0, line: Math.max(20, mm(alturaMm)), lineRule: LineRuleType.EXACT } });

// ─── Tabelas ──────────────────────────────────────────────────────────────────────────────────
const NADA = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
export const borda = (cor = COR.fio, espessura = 0.25) => ({ style: BorderStyle.SINGLE, size: bmm(espessura), color: cor });

/**
 * Célula. o: filhos (parágrafos), fundo, bordas {topo, base, esq, dir} (de borda()), margem
 * {t, b, e, d} (mm), vAlign ("topo" | "meio" | "base"), cs, rs, largura (mm, preenchida por tabela()).
 */
export const cel = (filhos, o = {}) => ({ filhos: Array.isArray(filhos) ? filhos : [filhos], ...o });

/**
 * Tabela. larguras (mm) das colunas; linhas: [{ celulas: [cel], cabecalho, altura (mm), exata,
 * semQuebra }]; recuo (mm) à esquerda.
 */
export function tabela({ larguras, linhas, recuo = 0, semQuebra = true }) {
  const L = larguras.map(mm);
  const ocupado = [];
  const rows = linhas.map((l, r) => {
    const tomadas = (ocupado[r] ??= new Set());
    let col = 0;
    const cells = [];
    for (const c of l.celulas) {
      while (tomadas.has(col)) col++;
      const cs = c.cs ?? 1;
      const largura = L.slice(col, col + cs).reduce((a, b) => a + b, 0);
      const m = c.margem ?? {};
      cells.push(
        new TableCell({
          children: c.filhos.length ? c.filhos : [new Paragraph({ children: [] })],
          width: { size: largura, type: WidthType.DXA },
          columnSpan: cs > 1 ? cs : undefined,
          rowSpan: c.rs > 1 ? c.rs : undefined,
          shading: c.fundo ? { type: ShadingType.CLEAR, color: "auto", fill: c.fundo } : undefined,
          verticalAlign: { topo: VerticalAlign.TOP, meio: VerticalAlign.CENTER, base: VerticalAlign.BOTTOM }[c.vAlign ?? "topo"],
          margins: { top: mm(m.t ?? 0), bottom: mm(m.b ?? 0), left: mm(m.e ?? 0), right: mm(m.d ?? 0), marginUnitType: WidthType.DXA },
          borders: {
            top: c.bordas?.topo ?? NADA,
            bottom: c.bordas?.base ?? NADA,
            left: c.bordas?.esq ?? NADA,
            right: c.bordas?.dir ?? NADA,
          },
        }),
      );
      for (let k = 1; k < (c.rs ?? 1); k++) for (let j = 0; j < cs; j++) (ocupado[r + k] ??= new Set()).add(col + j);
      col += cs;
    }
    return new TableRow({
      children: cells,
      tableHeader: l.cabecalho || undefined,
      cantSplit: l.semQuebra ?? semQuebra,
      height: l.altura != null ? { value: mm(l.altura), rule: l.exata ? HeightRule.EXACT : HeightRule.ATLEAST } : undefined,
    });
  });
  return new Table({
    rows,
    width: { size: L.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: L,
    layout: TableLayoutType.FIXED,
    indent: recuo ? { size: mm(recuo), type: WidthType.DXA } : undefined,
    borders: { top: NADA, bottom: NADA, left: NADA, right: NADA, insideHorizontal: NADA, insideVertical: NADA },
    margins: { top: 0, bottom: 0, left: 0, right: 0, marginUnitType: WidthType.DXA },
  });
}

// ─── Imagens ──────────────────────────────────────────────────────────────────────────────────
export function tamanhoImagem(buffer) {
  const b = buffer;
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), tipo: "png" };
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5), tipo: "jpg" };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("Imagem sem tamanho legível");
}

/**
 * Imagem no tamanho (mm) da caixa, recortada como object-fit: cover, com o ponto `foco`
 * ("50% 30%") preservado. `dados` = Buffer ou caminho em assets/.
 */
export function imagem(dados, { larg, alt, foco, nome, flutuante } = {}) {
  const buffer = Buffer.isBuffer(dados) ? dados : readFileSync(join(raiz, "assets", dados));
  const { w, h, tipo } = tamanhoImagem(buffer);
  let alto = alt ?? (larg * h) / w;
  let crop;
  if (alt != null) {
    // recorte "cover": a imagem cobre a caixa; o que sobra sai pelos lados, conforme o foco
    const caixa = larg / alt;
    const img = w / h;
    const [fx, fy] = String(foco ?? "50% 50%")
      .split(/\s+/)
      .map((v) => Number.parseFloat(v) / 100);
    if (img > caixa) {
      const sobra = 1 - caixa / img; // fração da largura que sai
      crop = { left: sobra * fx * 100, right: sobra * (1 - fx) * 100, top: 0, bottom: 0 };
    } else if (img < caixa) {
      const sobra = 1 - img / caixa;
      crop = { top: sobra * (fy ?? 0.5) * 100, bottom: sobra * (1 - (fy ?? 0.5)) * 100, left: 0, right: 0 };
    }
  }
  return new ImageRun({
    type: tipo,
    data: buffer,
    transformation: { width: px(larg), height: px(alto) },
    crop,
    altText: { title: nome ?? "imagem", description: nome ?? "imagem", name: nome ?? "imagem" },
    floating: flutuante
      ? {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
          behindDocument: true,
          allowOverlap: true,
          lockAnchor: true,
          layoutInCell: false,
          zIndex: 0,
        }
      : undefined,
  });
}

/** Parágrafo só com a imagem (alinhada). */
export const parImagem = (img, o = {}) =>
  new Paragraph({
    children: [img],
    alignment: o.alinhar ?? AlignmentType.LEFT,
    spacing: { before: mm(o.antes ?? 0), after: mm(o.depois ?? 0) },
    keepNext: o.manter || undefined,
    pageBreakBefore: o.quebra || undefined,
  });

// ─── Marcas que viram XML depois (equações, campos de página, marcadores) ──────────────────────
const extras = [];
/** Equação do Word (OMML). bloco = parágrafo de equação centrado. */
export const equacao = (omml, { bloco = false, cor } = {}) => {
  extras.push({ tipo: "eq", omml: recolorir(omml, cor), bloco });
  return new TextRun({ text: `§X:${extras.length - 1}§`, font: TEXTO, size: pt(9.6) });
};
/** Marcador (destino do número de página no sumário). */
export const marcador = (nome) => {
  extras.push({ tipo: "bm", nome });
  return new TextRun({ text: `§X:${extras.length - 1}§`, font: TEXTO, size: 2 });
};
/** Número da página de um marcador (campo PAGEREF), já com o valor calculado no PDF. */
export const paginaDe = (nome, valor, o = {}) => {
  extras.push({ tipo: "pg", nome, valor: String(valor), o });
  return new TextRun({ text: `§X:${extras.length - 1}§`, font: MONO, size: pt(o.tam ?? 10) });
};

/** Troca a cor das equações (o Word original usa azul; o PDF usa a cor do texto). */
function recolorir(omml, cor) {
  // só troca o valor: a ordem dos elementos dentro de w:rPr é rígida no Word
  return omml.replace(/(<w:color w:val=")[^"]*(")/g, `$1${cor ?? COR.g}$2`);
}

const nomeMarcador = (n) => `s_${n.replace(/[^\w]/g, "_")}`;
const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Troca as marcas §X:n§ do document.xml pelo XML de cada extra. */
export async function posProcessar(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  let xml = await zip.file("word/document.xml").async("string");
  let bmId = 1000;
  xml = xml.replace(/<w:r>((?:(?!<\/w:r>)[\s\S])*?)§X:(\d+)§((?:(?!<\/w:r>)[\s\S])*?)<\/w:r>/g, (_, a, i) => {
    const e = extras[Number(i)];
    if (e.tipo === "eq") return e.bloco ? `<m:oMathPara>${e.omml}</m:oMathPara>` : e.omml;
    if (e.tipo === "bm") {
      const id = bmId++;
      return `<w:bookmarkStart w:id="${id}" w:name="${nomeMarcador(e.nome)}"/><w:bookmarkEnd w:id="${id}"/>`;
    }
    // campo PAGEREF com o valor do PDF como resultado guardado (Word: F9 atualiza)
    const rPr = /<w:rPr>[\s\S]*?<\/w:rPr>/.exec(a)?.[0] ?? "";
    return (
      `<w:r>${rPr}<w:fldChar w:fldCharType="begin"/></w:r>` +
      `<w:r>${rPr}<w:instrText xml:space="preserve"> PAGEREF ${nomeMarcador(e.nome)} \\h </w:instrText></w:r>` +
      `<w:r>${rPr}<w:fldChar w:fldCharType="separate"/></w:r>` +
      `<w:r>${rPr}<w:t>${xmlEsc(e.valor)}</w:t></w:r>` +
      `<w:r>${rPr}<w:fldChar w:fldCharType="end"/></w:r>`
    );
  });
  if (/§X:\d+§/.test(xml)) throw new Error("Sobrou marca §X§ no document.xml (equação/campo dividido entre trechos?)");
  zip.file("word/document.xml", xml);
  extras.length = 0;
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

export { AlignmentType };
