/**
 * Word editável (.docx) da proposta, montado dos mesmos dados do PDF: carta, cláusulas 1–10,
 * assinaturas, memorial (na fundação), obras do anexo e a lista de pontos de atenção.
 * O objetivo é a equipe poder corrigir texto e números no Word; o PDF é refeito depois a partir
 * dos dados, no mesmo modelo. Por isso as cláusulas mantêm a numeração do PDF, as tabelas são
 * tabelas do Word (não imagens) e as fórmulas do memorial são equações do Word.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableLayoutType,
  TableRow,
  TableCell,
  TabStopType,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import JSZip from "jszip";
import { raiz } from "./util.mjs";

const COR = { g: "22252A", o: "EF6C1A", oi: "B94E0C", g2: "4F5560", g3: "6B717C", fio: "D5D6D9", painel: "F3F2EE", zebra: "F8F7F4", branco: "FFFFFF" };
const FONTE = "Calibri";
const LARGURA = 9638; // largura útil (A4, margens de 2 cm) em DXA

// ─── Texto ──────────────────────────────────────────────────────────────────────────────────
/** Texto com **negrito** → trechos do Word. */
const trechos = (texto, { rev = false, negrito = false, cor, tam, italico } = {}) =>
  String(texto)
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((p) => {
      const forte = p.startsWith("**") && p.endsWith("**");
      return new TextRun({
        text: forte ? p.slice(2, -2) : p,
        bold: forte || negrito,
        italics: italico,
        color: cor,
        size: tam,
        font: FONTE,
        highlight: rev ? "yellow" : undefined,
      });
    });

const para = (texto, op = {}) =>
  new Paragraph({
    spacing: { before: op.antes ?? 60, after: op.depois ?? 60, line: 276 },
    alignment: op.alinhar,
    indent: op.recuo,
    keepNext: op.manter,
    pageBreakBefore: op.quebra,
    children: Array.isArray(texto) ? texto : trechos(texto, op),
  });

const clausula = (n, texto, { rev = false, recuo = 1000 } = {}) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: recuo }],
    indent: { left: recuo, hanging: recuo },
    spacing: { before: 70, after: 70, line: 276 },
    children: [new TextRun({ text: n, bold: true, color: COR.g3, font: FONTE }), new TextRun({ text: "\t", font: FONTE }), ...trechos(texto, { rev })],
  });

const marcador = (texto, { rev = false, nivel = 0 } = {}) =>
  new Paragraph({
    numbering: { reference: "marcadores", level: nivel },
    spacing: { before: 30, after: 30, line: 276 },
    children: trechos(texto, { rev }),
  });

const titulo1 = (n, texto, op = {}) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 120 },
    keepNext: true,
    pageBreakBefore: op.quebra,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COR.fio, space: 3 } },
    children: [
      ...(n ? [new TextRun({ text: `${n}  `, bold: true, color: COR.o, font: FONTE, size: 28 })] : []),
      new TextRun({ text: texto, bold: true, color: COR.g, font: FONTE, size: 28 }),
    ],
  });

const titulo2 = (n, texto, op = {}) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    keepNext: true,
    pageBreakBefore: op.quebra,
    children: [
      ...(n ? [new TextRun({ text: `${n}  `, bold: true, color: COR.o, font: FONTE, size: 24 })] : []),
      new TextRun({ text: texto, bold: true, color: COR.g, font: FONTE, size: 24 }),
    ],
  });

const rotuloSub = (texto) =>
  new Paragraph({ spacing: { before: 200, after: 60 }, keepNext: true, children: trechos(texto, { negrito: true, cor: COR.g }) });

// ─── Tabelas ────────────────────────────────────────────────────────────────────────────────
const semBorda = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const linhaFina = { style: BorderStyle.SINGLE, size: 4, color: COR.fio };

/**
 * Célula: texto, ou { t, cs, rs, c } (colspan, rowspan, classe: r = direita, c = centro, nome = negrito,
 * dest = destaque). `cab` = célula de cabeçalho (fundo grafite, texto branco).
 */
function celula(c, larguras, i, { cab = false, tam = 17, alinhar, zebra = false, escuro = false } = {}) {
  const o = c !== null && typeof c === "object" ? c : { t: c };
  const cls = String(o.c ?? "");
  const cs = o.cs ?? 1;
  const largura = larguras.slice(i, i + cs).reduce((a, b) => a + b, 0);
  const texto = o.t === "-" || o.t === "–" ? "–" : String(o.t ?? "");
  const claro = cab || escuro;
  const fundo = claro ? (cls.includes("dest") ? COR.oi : COR.g) : cls.includes("dest") || cls.includes("nota") ? COR.painel : zebra ? COR.zebra : undefined;
  return new TableCell({
    columnSpan: cs > 1 ? cs : undefined,
    rowSpan: o.rs && o.rs > 1 ? o.rs : undefined,
    width: { size: largura, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: fundo ? { type: ShadingType.CLEAR, color: "auto", fill: fundo } : undefined,
    margins: { top: 40, bottom: 40, left: 70, right: 70 },
    borders: { top: linhaFina, bottom: linhaFina, left: semBorda, right: semBorda },
    children: String(texto)
      .split("\n")
      .map(
        (linha) =>
          new Paragraph({
            alignment: cls.includes("r") && !cls.includes("nome") ? AlignmentType.RIGHT : cls.includes("c") || cab ? AlignmentType.CENTER : (alinhar ?? AlignmentType.LEFT),
            spacing: { before: 0, after: 0, line: 252 },
            children: trechos(linha, { negrito: cab || cls.includes("nome") || cls.includes("tot"), cor: claro ? COR.branco : undefined, tam }),
          }),
      ),
  });
}

/**
 * Tabela a partir de { larguras (DXA), cabecalho: [[célula]], linhas: [[célula] | { escuro, cells }] }.
 * Uma linha { escuro: true, cells } vira uma faixa grafite (rótulo de bloco). Células com rs/cs
 * seguem a mesma regra do HTML (a linha de baixo não repete a célula que desce).
 */
function tabela({ larguras, cabecalho = [], linhas, tam = 17, zebra = false, alinhar }) {
  const soma = larguras.reduce((a, b) => a + b, 0);
  const L = larguras.map((w) => Math.round((w * LARGURA) / soma));
  const montar = (rows, cab) => {
    const ocupado = []; // ocupado[r] = colunas tomadas por células de cima que descem (rowspan)
    return rows.map((linha, r) => {
      const cells = Array.isArray(linha) ? linha : linha.cells;
      const escuro = !Array.isArray(linha) && linha.escuro;
      const tomadas = (ocupado[r] ??= new Set());
      let col = 0;
      const out = [];
      for (const c of cells) {
        while (tomadas.has(col)) col++;
        const o = c !== null && typeof c === "object" ? c : { t: c };
        out.push(celula(c, L, col, { cab, tam, escuro, zebra: zebra && !cab && r % 2 === 1, alinhar }));
        for (let k = 1; k < (o.rs ?? 1); k++) for (let j = 0; j < (o.cs ?? 1); j++) (ocupado[r + k] ??= new Set()).add(col + j);
        col += o.cs ?? 1;
      }
      return new TableRow({ tableHeader: cab, cantSplit: true, children: out });
    });
  };
  return new Table({
    width: { size: LARGURA, type: WidthType.DXA },
    columnWidths: L,
    layout: TableLayoutType.FIXED,
    rows: [...montar(cabecalho, true), ...montar(linhas, false)],
  });
}

const espaco = (depois = 120) => new Paragraph({ spacing: { before: 0, after: depois }, children: [] });
const legendaTab = (texto) =>
  new Paragraph({ spacing: { before: 160, after: 60 }, keepNext: true, children: trechos(texto, { negrito: true, cor: COR.g, tam: 19 }) });

// ─── Imagens ────────────────────────────────────────────────────────────────────────────────
function tamanhoImagem(arquivo) {
  const b = readFileSync(arquivo);
  if (b[0] === 0x89 && b[1] === 0x50) return [b.readUInt32BE(16), b.readUInt32BE(20), "png"];
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5), "jpg"];
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error("Imagem desconhecida: " + arquivo);
}

/** Parágrafo com a imagem (largura em cm). */
function imagem(caminho, larguraCm, alt) {
  const arquivo = join(raiz, "assets", caminho);
  const [w, h, tipo] = tamanhoImagem(arquivo);
  const largura = Math.round((larguraCm / 2.54) * 96);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 60 },
    children: [
      new ImageRun({
        type: tipo,
        data: readFileSync(arquivo),
        transformation: { width: largura, height: Math.round((largura * h) / w) },
        altText: { title: alt ?? caminho, description: alt ?? caminho, name: caminho },
      }),
    ],
  });
}

// ─── Equações: entram como equações do Word (OMML), no lugar de marcas de texto ──────────────────
const equacoesDoc = []; // { omml, bloco }
const marcaEq = (omml, bloco) => {
  equacoesDoc.push({ omml, bloco });
  return `§EQ:${equacoesDoc.length - 1}§`;
};
async function injetarEquacoes(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  let xml = await zip.file("word/document.xml").async("string");
  xml = xml.replace(/<w:r>(?:(?!<\/w:r>)[\s\S])*?§EQ:(\d+)§(?:(?!<\/w:r>)[\s\S])*?<\/w:r>/g, (_, i) => {
    const { omml, bloco } = equacoesDoc[Number(i)];
    return bloco ? `<m:oMathPara>${omml}</m:oMathPara>` : omml;
  });
  if (!/xmlns:m=/.test(xml.slice(0, 3000))) throw new Error("document.xml sem o namespace de matemática (m).");
  zip.file("word/document.xml", xml);
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

// ─── Blocos das cláusulas ───────────────────────────────────────────────────────────────────
function blocoClausula(b) {
  const rev = b.rev;
  switch (b.tipo) {
    case "contencoes":
      return [
        legendaTab(b.titulo),
        tabela({
          larguras: [1100, 3900, 3000, 1638],
          cabecalho: [["Item", "Contenção", "Solução", { t: "Área (m²)", c: "r" }]],
          linhas: b.linhas.map((l) => [l.n, { t: l.nome, c: "nome" }, l.solucao, { t: l.area, c: "r" }]),
        }),
        espaco(),
      ];
    case "modulos":
      return [
        legendaTab(b.titulo),
        tabela({
          larguras: [1100, 4100, 2219, 2219],
          cabecalho: [["Item", "Módulo", ...b.colunas.map((c) => ({ t: c, c: "r" }))]],
          linhas: b.linhas.map((l) => [l.n, { t: l.nome, c: "nome" }, ...l.valores.map((v) => ({ t: v ?? "–", c: "r" }))]),
        }),
        espaco(),
      ];
    case "total":
      return [clausula(b.n, `**${b.rotulo}** **${b.valor}** — ${b.t}`, { rev })];
    case "tabela-precos":
      return [
        legendaTab(b.legenda),
        b.linhas
          ? tabela({ larguras: [6638, 3000], cabecalho: [], linhas: b.linhas.map(([a, v]) => [a, { t: v, c: "r" }]) })
          : para("[Tabela de preços globais: inserir. A tabela não consta no arquivo original da proposta.]", { negrito: true, cor: COR.oi }),
        espaco(),
      ];
    case "planilha": {
      const linhas = b.linhas.map((l) => {
        const nd = (v) => (v == null || v === "" ? "" : v === "-" ? "–" : v);
        if (l.tipo === "titulo") return { l, cells: [{ t: l.item, c: "nome" }, { t: l.desc, cs: 5, c: "nome" }] };
        if (l.tipo === "total") return { l, cells: [{ t: l.desc, cs: 5, c: "nome" }, { t: nd(l.total), c: "r tot" }] };
        const porExtenso = l.un == null && l.qtd != null && /[a-zà-ú]/i.test(l.qtd);
        const qtdUn = porExtenso ? [{ t: l.qtd, cs: 2, c: "r" }] : [{ t: nd(l.qtd), c: "r" }, nd(l.un)];
        const forte = l.tipo === "grupo" ? "nome" : "";
        return { l, cells: [{ t: l.item, c: forte }, { t: l.desc, c: forte }, ...qtdUn, { t: nd(l.unit), c: "r" }, { t: nd(l.total), c: l.tipo === "grupo" ? "r tot" : "r" }] };
      });
      return [
        legendaTab(b.legenda),
        tabela({
          larguras: [750, 3700, 1000, 600, 1700, 1888],
          tam: 16,
          cabecalho: [["Item", "Descrição", { t: "Quant.", c: "r" }, "Un.", { t: "Preço unit. (R$)", c: "r" }, { t: "Total (R$)", c: "r" }]],
          linhas: linhas.map((x) => x.cells),
        }),
        espaco(),
      ];
    }
    case "faturamento":
    case "cartoes":
      return [
        clausula(b.n, `**${b.rotulo}**`, { rev }),
        ...b.partes.map((p) => para([...trechos(`**${p.pct}** — `, { cor: COR.oi }), ...trechos(p.t)], { recuo: { left: 1000 } })),
      ];
    case "obs":
      return b.itens.map((t, i) => para(`**Obs.: ${i + 1}.** ${t}`, { recuo: { left: 1000 }, cor: COR.g2 }));
    case "paragrafo":
      return [para(b.t)];
    default: {
      const out = [clausula(b.n, b.t, { rev })];
      for (const x of b.sub ?? []) out.push(subitem(x, rev));
      if (b.insumos)
        out.push(tabela({ larguras: [5200, 4438], cabecalho: [], linhas: b.insumos.map(([a, v]) => [a, { t: v, c: "r nome" }]) }), espaco(60));
      if (b.complemento) out.push(para(b.complemento, { recuo: { left: 1000 }, rev }));
      for (const l of b.lista ?? []) out.push(marcador(l, { rev }));
      return out;
    }
  }
}

const subitem = (s) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: 1600 }],
    indent: { left: 1600, hanging: 600 },
    spacing: { before: 50, after: 50, line: 276 },
    children: [new TextRun({ text: s.n, bold: true, color: COR.oi, font: FONTE }), new TextRun({ text: "\t", font: FONTE }), ...trechos(s.t)],
  });

// ─── Memorial da fundação ───────────────────────────────────────────────────────────────────
async function carregarOmml() {
  const { equacoes, eq } = await import("../dados/fundacao/dados.mjs");
  const mapa = new Map();
  equacoes.forEach((e, n) => mapa.set(eq(n), { omml: e.omml.replaceAll(">KN<", ">kN<"), bloco: e.bloco }));
  // As (área de aço): no Word o símbolo da lista “Onde:” estava repetido como Ac; aqui vai o correto
  mapa.set(
    "<math><msub><mrow><mi>A</mi></mrow><mrow><mi>s</mi></mrow></msub></math>",
    { omml: "<m:oMath><m:sSub><m:e><m:r><m:t>A</m:t></m:r></m:e><m:sub><m:r><m:t>s</m:t></m:r></m:sub></m:sSub></m:oMath>", bloco: false },
  );
  return mapa;
}

function blocoMemorial(b, omml) {
  const eqRun = (mathml, forcarInline) => {
    const e = omml.get(mathml);
    if (!e) throw new Error("Equação sem OMML correspondente: " + mathml.slice(0, 80));
    return new TextRun({ text: marcaEq(e.omml, forcarInline ? false : e.bloco), font: FONTE });
  };
  switch (b.tipo) {
    case "lista":
      return b.itens.map((t) => marcador(t.replace(/\n/g, " — ")));
    case "p": {
      const partes = b.t.split(/\{\{(\d+)\}\}/);
      const children = partes.flatMap((p, i) => (i % 2 ? [eqRun(b.eqs[Number(p)], true)] : trechos(p)));
      return [para(children)];
    }
    case "sub":
      return [rotuloSub(b.t)];
    case "obs":
      return [para(`**${b.rotulo ?? "Obs.:"}** ${b.t.replace(/\n/g, " ")}`, { cor: COR.g2 })];
    case "figura":
      return [
        ...(b.titulo ? [para(b.titulo, { manter: true, quebra: b.pagina })] : []),
        imagem(b.arquivo, b.pagina && !b.largura ? 15 : Number.parseFloat(b.largura ?? "15"), b.alt),
        ...(b.legenda ? [para(b.legenda, { alinhar: AlignmentType.CENTER, cor: COR.g2, tam: 17 })] : []),
      ];
    case "equacao":
      return [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, children: [eqRun(b.mathml)] })];
    case "onde":
      return [
        para("**Onde:**", { cor: COR.g2 }),
        new Table({
          width: { size: LARGURA, type: WidthType.DXA },
          columnWidths: [1500, LARGURA - 1500],
          layout: TableLayoutType.FIXED,
          rows: b.itens.map(
            ([m, t]) =>
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 1500, type: WidthType.DXA },
                    borders: { top: semBorda, bottom: semBorda, left: semBorda, right: semBorda },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [eqRun(m, true)] })],
                  }),
                  new TableCell({
                    width: { size: LARGURA - 1500, type: WidthType.DXA },
                    borders: { top: semBorda, bottom: semBorda, left: semBorda, right: semBorda },
                    children: [new Paragraph({ spacing: { before: 20, after: 20 }, children: trechos(t) })],
                  }),
                ],
              }),
          ),
        }),
        espaco(60),
      ];
    case "calculo":
      return [
        rotuloSub(b.titulo),
        ...b.eqs.map(
          (m, i) =>
            new Paragraph({
              spacing: { before: 20, after: 20 },
              indent: { left: 400 },
              children: [eqRun(m, true), ...(b.nota && i === b.notaApos ? trechos(`   (${b.nota})`, { cor: COR.g3, tam: 18 }) : [])],
            }),
        ),
        new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 80, after: 120 }, indent: { left: 400 }, children: [eqRun(b.resultado, true)] }),
      ];
    case "tabela": {
      const nCols = b.cabecalho.reduce((m, l) => Math.max(m, l.reduce((a, c) => a + (c?.cs ?? 1), 0)), 0);
      const larg = b.colunas ?? Array.from({ length: nCols }, () => Math.round(LARGURA / nCols));
      const cel = (c, i) => (c !== null && typeof c === "object" ? { ...c, c: `${c.c ?? ""} ${i > 0 || c.cs ? "c" : ""}` } : { t: c, c: i > 0 ? "c" : "" });
      return [
        ...(b.legenda ? [legendaTab(b.legenda)] : []),
        tabela({
          larguras: larg,
          cabecalho: b.cabecalho,
          linhas: b.linhas.map((l) => l.map((c, i) => (typeof c === "object" && c !== null ? c : cel(c, i)))),
        }),
        espaco(),
      ];
    }
    case "estaqueamento": {
      const L = [1150, 950, 950, 950, 800, 750, 850, 800, 1219, 1219];
      const corpo = b.grupos.flatMap((g) => [
        ...(g.rotulo ? [{ escuro: true, cells: [{ t: g.rotulo, cs: 10, c: "nome" }] }] : []),
        ...g.linhas.map((l) => [
          { t: l.pilar, c: "nome" },
          ...["nSem", "nCom", "perm", "vento"].map((k) => ({ t: l[k], c: "r" })),
          ...["quant", "diam", "comp"].map((k) => ({ t: l[k], c: "c" })),
          ...["cargaSem", "cargaCom"].map((k) => ({ t: l[k], c: "r tot" })),
        ]),
      ]);
      return [
        legendaTab(b.legenda),
        tabela({
          larguras: L,
          tam: 15,
          cabecalho: [
            [{ t: "Pilar", rs: 2 }, { t: "N+5% (tf)", cs: 2 }, { t: "Perm. + Acid. (tf)", rs: 2 }, { t: "Vento Fz (tf)", rs: 2 }, { t: "Quant.", rs: 2 }, { t: "Diâmetro (cm)", rs: 2 }, { t: "L escav. (m)", rs: 2 }, { t: "Carga por estaca (tf)", cs: 2 }],
            ["s/ vento Fz", "c/ vento Fz", "sem vento Fz", "com vento Fz"],
          ],
          linhas: corpo,
        }),
        espaco(),
      ];
    }
    default:
      throw new Error(`Word: bloco de memorial "${b.tipo}" desconhecido.`);
  }
}

// ─── Documento ──────────────────────────────────────────────────────────────────────────────
/**
 * @param {object} pacote  pacote de dados (src/pacote.mjs)
 * @returns {Promise<Buffer>}
 */
export async function montarWord(pacote) {
  const { proposta, carta, secoes, assinatura, memorial, anexo, revisao } = pacote;
  const corpo = [];

  // Capa do arquivo + como revisar
  corpo.push(
    new Paragraph({
      spacing: { before: 0, after: 40 },
      children: [new TextRun({ text: `PROPOSTA ${proposta.codigo}`, bold: true, color: COR.o, font: FONTE, size: 22 })],
    }),
    new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: pacote.capa.titulo, bold: true, color: COR.g, font: FONTE, size: 44 })],
    }),
    para(`${proposta.obra} — ${proposta.localObra}`, { cor: COR.g2 }),
    para("Texto para revisão: o mesmo conteúdo do PDF da proposta, em Word, para a equipe corrigir texto e números.", { cor: COR.g2 }),
    titulo2("", "Como revisar"),
    marcador("Edite o texto direto neste arquivo. Não troque os números das cláusulas nem a ordem dos itens: o PDF é refeito a partir deles."),
    marcador("Trechos com marca-texto amarela foram revisados em relação à versão anterior da proposta."),
    marcador(
      memorial.tipo === "fundacao"
        ? "As tabelas (módulos, preços, memorial) são tabelas do Word: corrija os valores direto nas células. As fórmulas do memorial são equações do Word."
        : "A tabela de contenções (1.3) é uma tabela do Word: corrija os valores direto nas células. O memorial de cálculo vem do programa de cálculo (CYPE) e fica só no PDF.",
    ),
    marcador("No fim do arquivo estão os “Pontos de atenção”: itens que pedem uma decisão antes de enviar a proposta. A coluna “Decisão” é para vocês preencherem."),
    marcador("Quando terminar, devolva o arquivo a quem gera o PDF. As alterações voltam para o PDF no mesmo modelo visual."),
  );

  // Carta
  corpo.push(
    titulo1("", "Carta de apresentação", { quebra: true }),
    para(`**${carta.codigo}**   ·   ${proposta.cidadeData}`),
    para(carta.destinatario.join("\n").split("\n").map((l, i) => (i === 1 ? `**${l}**` : l)).join("   ")),
    para(carta.atencao),
    para(`**Ref.:** ${carta.referencia}`),
    para(`**${carta.saudacao}**`, { antes: 160 }),
    para(carta.abertura),
  );

  // Cláusulas
  for (const s of secoes) {
    corpo.push(titulo1(s.n, s.titulo, { quebra: s.quebraAntes }));
    if (s.intro) corpo.push(para(s.intro, { rev: s.rev }));
    for (const b of s.itens) corpo.push(...blocoClausula(b));
  }

  // Assinaturas
  corpo.push(
    titulo2("", "Assinaturas"),
    para(assinatura.despedida),
    para(`**${assinatura.empresa}**`, { antes: 360 }),
    para(assinatura.nome, { antes: 0 }),
    para(assinatura.registro, { antes: 0 }),
    para(assinatura.deAcordo, { antes: 240 }),
    para(["Data", ...assinatura.campos].map((c) => `${c}: ______________________________`).join("\n"), { antes: 0 }),
  );

  // Memorial (fundação: texto, equações e tabelas; contenção: dados do CYPE, não vai neste arquivo)
  if (memorial.tipo === "fundacao") {
    const mapa = await carregarOmml();
    corpo.push(titulo1(memorial.n, memorial.titulo, { quebra: true }));
    for (const s of memorial.secoes) {
      corpo.push(titulo2(s.n, s.titulo, { quebra: s.quebra }));
      for (const b of s.blocos) corpo.push(...blocoMemorial(b, mapa));
    }
    corpo.push(para(memorial.fecho.local, { antes: 360 }), ...memorial.fecho.nomes.map((n) => para(n, { antes: 0, negrito: true })));
  } else {
    corpo.push(
      titulo1(memorial.n, memorial.titulo, { quebra: true }),
      para("O memorial de cálculo das contenções vem do programa de cálculo (CYPE) e não é editado neste arquivo: está no PDF da proposta."),
    );
  }

  // Anexo: obras
  corpo.push(titulo1(`Anexo ${anexo.letra}`, anexo.abertura.titulo, { quebra: true }), para(anexo.abertura.texto, { cor: COR.g2 }));
  if (anexo.tipo === "fundacao") {
    corpo.push(
      tabela({
        larguras: [600, 2300, 2400, 4338],
        cabecalho: [["Nº", "Obra", "Parceiro / cliente", "Legenda da foto"]],
        linhas: anexo.obras.map((o) => [o.numero, { t: o.nome, c: "nome" }, `${o.papel}: ${o.parceiro}`, o.foto.legenda]),
      }),
      para("Para acrescentar dados de uma obra (local, ano, quantidade de estacas…), escrevam abaixo da tabela, por obra. Eles entram numa régua abaixo da foto no PDF.", { cor: COR.g2 }),
    );
  } else {
    const ph = (v, t) => ({ t: v ?? `[${t}]`, c: v == null ? "dest" : "" });
    corpo.push(
      para("Campos entre colchetes e em destaque são os que faltam: preencham e o PDF é atualizado com eles.", { cor: COR.g2 }),
      tabela({
        larguras: [500, 1500, 1200, 1050, 1000, 1000, 1100, 1288, 1000],
        tam: 15,
        cabecalho: [["Nº", "Obra / construtora", "Bairro", "Ano", "Área (m²)", "Altura (m)", "Estacas", "Execução", "Destaque"]],
        linhas: anexo.obras.map((o) => [
          o.numero,
          { t: `**${o.nome}**\n${o.construtora}`, c: "" },
          ph(o.bairro, "bairro"),
          ph(o.ano, "ano"),
          ph(o.ficha.areaContencao, "— m²"),
          ph(o.ficha.alturaEscavacao, "— m"),
          ph(o.ficha.estacas, "nº × Ø cm"),
          ph(o.ficha.execucao, "mês/ano – mês/ano"),
          ph(o.destaque, "uma frase"),
        ]),
      }),
    );
  }

  // Pontos de atenção e correções
  corpo.push(
    titulo1("", "Pontos de atenção", { quebra: true }),
    para("Itens que merecem revisão da equipe antes do envio. O texto foi mantido como estava no original; nada disto foi alterado.", { cor: COR.g2 }),
    tabela({
      larguras: [500, 6338, 2800],
      cabecalho: [["#", "Ponto", "Decisão"]],
      linhas: revisao.pontos.map((p, i) => [String(i + 1), p, ""]),
    }),
    titulo1("", "Correções já aplicadas ao texto"),
    para("Digitação, pontuação, concordância e regência, sem mudar o sentido. Estão aplicadas no PDF e neste arquivo.", { cor: COR.g2 }),
    tabela({
      larguras: [1800, 3919, 3919],
      tam: 16,
      cabecalho: [["Onde", "Original", "Corrigido"]],
      linhas: revisao.correcoes.map((c) => [{ t: c.onde, c: "nome" }, c.original, c.corrigido]),
    }),
  );

  const doc = new Document({
    creator: "Geoforte",
    title: `Proposta ${proposta.codigo} — texto para revisão`,
    description: `Texto da proposta ${proposta.codigo} em Word editável, gerado dos mesmos dados do PDF (tools/proposta).`,
    styles: {
      default: { document: { run: { font: FONTE, size: 20 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONTE, size: 28, bold: true } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONTE, size: 24, bold: true } },
      ],
    },
    numbering: {
      config: [
        {
          reference: "marcadores",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1360, hanging: 260 } } } }],
        },
      ],
    },
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1200, left: 1134, right: 1134, header: 500, footer: 500 } } },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: LARGURA }],
                border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: COR.o, space: 4 } },
                children: [
                  new TextRun({ text: "GEOFORTE", bold: true, font: FONTE, size: 20, color: COR.g }),
                  new TextRun({ text: `\tPROPOSTA ${proposta.codigo} · TEXTO PARA REVISÃO`, font: FONTE, size: 16, color: COR.g2 }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ children: ["Pág. ", PageNumber.CURRENT, " de ", PageNumber.TOTAL_PAGES], font: FONTE, size: 16, color: COR.g2 })],
              }),
            ],
          }),
        },
        children: corpo,
      },
    ],
  });

  return injetarEquacoes(await Packer.toBuffer(doc));
}
