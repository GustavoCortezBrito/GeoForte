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
import { deflateSync } from "node:zlib";
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
/** Space Grotesk peso 500 (no PDF: sumário, subtítulos da capa e da abertura do anexo). */
export const MONO_MEDIO = "Space Grotesk Medium";
const familia = (fonte) => (fonte === "mono" ? MONO : fonte === "medio" ? MONO_MEDIO : TEXTO);

/** Fontes embutidas no .docx (TrueType estáticas geradas das variáveis do Google Fonts, OFL). */
export const fontesEmbutidas = () => {
  const f = (n) => readFileSync(join(raiz, "assets", "fonts", "word", n));
  return [
    { name: TEXTO, data: f("Manrope-Regular.ttf"), bold: f("Manrope-Bold.ttf") },
    { name: MONO, data: f("SpaceGrotesk-Regular.ttf"), bold: f("SpaceGrotesk-Bold.ttf") },
    { name: MONO_MEDIO, data: f("SpaceGrotesk-Medium.ttf") },
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
      font: familia(o.fonte),
      size: pt(tam),
      bold: forte || o.negrito || undefined,
      italics: o.italico || undefined,
      color: (forte && o.corForte) || o.cor || COR.g,
      allCaps: o.caixaAlta || undefined,
      characterSpacing: espaco,
      highlight: o.realce,
      kern: 2, // kerning ligado, como no PDF (sem ele o texto sai mais largo e quebra mais linhas)
    });
  // sem quebra entre "R$" e o valor
  const limpo = String(t).replace(/R\$ (?=\d)/g, "R$\u00a0");
  // "\n" no texto = quebra de linha do Word (no w:t ele viraria espaço)
  return limpo.split("\n").flatMap((linha, i) => [
    ...(i ? [new TextRun({ break: 1, font: familia(o.fonte), size: pt(tam) })] : []),
    ...linha
      .split(/(\*\*[^*]+\*\*)/)
      .filter(Boolean)
      .map((p) => (p.startsWith("**") && p.endsWith("**") ? base(p.slice(2, -2), true) : base(p, false))),
  ]);
}

/** Várias linhas com quebra manual (as mesmas quebras do PDF). */
export const linhasTxt = (linhas, o) => linhas.flatMap((l, i) => [...(i ? [new TextRun({ break: 1, font: familia(o.fonte), size: pt(o.tam ?? 9.6) })] : []), ...txt(l, o)]);

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
    // entrelinha menor que a altura natural da fonte (1,37 em na Manrope, 1,44 em na Space Grotesk)
    // só sai igual ao PDF como "exatamente": no "pelo menos" o Word usa a altura natural
    spacing: { before: mm(o.antes ?? 0), after: mm(o.depois ?? 0), ...(o.exata || (o.fator ?? 1.52) < 1.45 ? linhaExata(tam, o.fator ?? 1.52) : linha(tam, o.fator ?? 1.52)) },
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

/** Parágrafo vazio com altura exata (espaçador). manter = fica com o bloco seguinte (entre título e conteúdo). */
export const espaco = (alturaMm, { manter = false } = {}) =>
  new Paragraph({
    children: [],
    keepNext: manter || undefined,
    spacing: { before: 0, after: 0, line: Math.max(20, mm(alturaMm)), lineRule: LineRuleType.EXACT },
  });

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
 * semQuebra }]; recuo (mm) à esquerda. junto = a tabela não se divide entre páginas (como
 * break-inside: avoid no PDF): todas as linhas, menos a última, ficam "com a próxima".
 */
export function tabela({ larguras, linhas, recuo = 0, semQuebra = true, junto = false, juntoFim = 0 }) {
  const L = larguras.map(mm);
  const ocupado = [];
  const rows = linhas.map((l, r) => {
    const tomadas = (ocupado[r] ??= new Set());
    let col = 0;
    const cells = [];
    // Respiro vertical diferente entre células da mesma linha: o LibreOffice usa o mesmo em todas.
    // Nesse caso o respiro vira um espaçador dentro da célula (igual no Word e no LibreOffice).
    const tops = l.celulas.map((c) => c.margem?.t ?? 0);
    const bots = l.celulas.map((c) => c.margem?.b ?? 0);
    const misto = new Set(tops).size > 1 || new Set(bots).size > 1;
    for (const c of l.celulas) {
      while (tomadas.has(col)) col++;
      const cs = c.cs ?? 1;
      const largura = L.slice(col, col + cs).reduce((a, b) => a + b, 0);
      const m = misto ? { ...(c.margem ?? {}), t: 0, b: 0 } : (c.margem ?? {});
      const filhos = c.filhos.length ? c.filhos : [new Paragraph({ children: [] })];
      const conteudo = misto ? [...((c.margem?.t ?? 0) > 0 ? [espaco(c.margem.t)] : []), ...filhos, ...((c.margem?.b ?? 0) > 0 ? [espaco(c.margem.b)] : [])] : filhos;
      cells.push(
        new TableCell({
          children: conteudo,
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
      // junto: a tabela inteira; juntoFim: as últimas n linhas ficam com a última (sem total sozinho)
      keepNext: (junto || r >= linhas.length - 1 - juntoFim) && r < linhas.length - 1 ? true : undefined,
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

// ─── Fio de duas cores (laranja + cinza) como imagem: um parágrafo, que fica preso ao texto ────
const crc32 = (buf) => {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
};
/** PNG de faixas horizontais de cor sólida. partes = [{ mm, cor: "RRGGBB" }] */
function pngFaixa(partes, alturaMm) {
  const k = 10; // px por mm
  const w = Math.max(1, Math.round(partes.reduce((a, p) => a + p.mm, 0) * k));
  const h = Math.max(2, Math.round(alturaMm * k));
  const linhaPx = Buffer.alloc(1 + w * 3);
  let x = 0;
  for (const p of partes) {
    const fim = Math.min(w, x + Math.round(p.mm * k));
    const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(p.cor.slice(i, i + 2), 16));
    for (; x < fim; x++) linhaPx.set([r, g, b], 1 + x * 3);
  }
  const bruto = Buffer.concat(Array.from({ length: h }, () => linhaPx));
  const bloco = (tipo, dados) => {
    const t = Buffer.from(tipo);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(dados.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, dados])));
    return Buffer.concat([len, t, dados, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), bloco("IHDR", ihdr), bloco("IDAT", deflateSync(bruto)), bloco("IEND", Buffer.alloc(0))]);
}
/** Parágrafo com o fio (manter = fica com o próximo bloco). */
export const fio = (partes, alturaMm, { manter = true, antes = 0 } = {}) =>
  new Paragraph({
    children: [
      new ImageRun({
        type: "png",
        data: pngFaixa(partes, alturaMm),
        transformation: { width: px(partes.reduce((a, p) => a + p.mm, 0)), height: Math.max(1, px(alturaMm)) },
        altText: { title: "fio", description: "fio", name: "fio" },
      }),
    ],
    keepNext: manter || undefined,
    spacing: { before: mm(antes), after: 0, line: 20, lineRule: LineRuleType.AT_LEAST },
  });

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
export const equacao = (omml, { bloco = false, cor, tam } = {}) => {
  extras.push({ tipo: "eq", omml: formatarEq(omml, cor ?? COR.g, tam), bloco });
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
  return new TextRun({ text: `§X:${extras.length - 1}§`, font: MONO, size: pt(o.tam ?? 10), bold: o.negrito || undefined, color: o.cor });
};

/**
 * Cor e tamanho em todos os trechos da equação (o Word original usa azul e tamanhos variados).
 * Dentro de w:rPr a ordem dos elementos é fixa: cor e tamanho entram antes de highlight/u/lang….
 */
const DEPOIS_DO_TAMANHO = /<w:(highlight|u|effect|bdr|shd|fitText|vertAlign|rtl|cs|em|lang|eastAsianLayout|specVanish|oMath)\b/;
function formatarEq(omml, cor, tam) {
  const props = `<w:color w:val="${cor}"/>${tam ? `<w:sz w:val="${pt(tam)}"/><w:szCs w:val="${pt(tam)}"/>` : ""}`;
  const rPr = (dentro) => {
    let limpo = dentro.replace(/<w:(color|spacing|w|kern|position)\b[^>]*\/>/g, "");
    if (tam) limpo = limpo.replace(/<w:sz(?:Cs)? [^>]*\/>/g, "");
    const i = limpo.search(DEPOIS_DO_TAMANHO);
    return `<w:rPr>${i < 0 ? limpo + props : limpo.slice(0, i) + props + limpo.slice(i)}</w:rPr>`;
  };
  return (
    omml
      .replace(/<w:rPr>((?:(?!<\/w:rPr>)[\s\S])*?)<\/w:rPr>/g, (_, dentro) => rPr(dentro))
      // trechos de equação sem w:rPr: ganham um (depois do m:rPr, se houver)
      .replace(/<m:r>((?:<m:rPr>(?:(?!<\/m:rPr>)[\s\S])*?<\/m:rPr>)?)(?!<w:rPr>)/g, (_, mpr) => `<m:r>${mpr}${rPr("")}`)
  );
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
  // algarismos tabulares na Space Grotesk (font-variant-numeric: tabular-nums no PDF): o "1" com base
  xml = xml.replace(/(<w:rPr>(?:(?!<\/w:rPr>)[\s\S])*?w:ascii="Space Grotesk(?: Medium)?"(?:(?!<\/w:rPr>)[\s\S])*?)<\/w:rPr>/g, '$1<w14:numSpacing w14:val="tabular"/></w:rPr>');
  zip.file("word/document.xml", xml);
  extras.length = 0;
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

export { AlignmentType };
