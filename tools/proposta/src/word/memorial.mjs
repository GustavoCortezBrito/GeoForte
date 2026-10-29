/**
 * Memorial de cálculo (11) no Word, nos dois formatos do PDF:
 *   contenção — uma seção por contenção, com os dados do CYPE (src/memorial-contencao.mjs);
 *   fundação  — texto, equações, figuras e tabelas de estaqueamento (src/memorial-fundacao.mjs).
 */
import { AlignmentType, Paragraph, TextRun } from "docx";
import { COR, UTIL, borda, cel, equacao, espaco, imagem, marcador, par, parImagem, pt, tabela, txt } from "./base.mjs";
import { item, quebra, tabelaT, tituloSecao } from "./corpo.mjs";

// ─── Peças comuns ─────────────────────────────────────────────────────────────────────────────
/** Subtítulo .m-h: quadradinho laranja + título mono 10,6 pt. */
export const mh = (texto, { antes = 7, quebrar = false } = {}) =>
  par([new TextRun({ text: "■", font: "Arial", size: pt(7), color: COR.o }), ...txt("  "), ...txt(texto, { fonte: "mono", negrito: true, tam: 10.6, espaco: -0.005 })], {
    tam: 10.6,
    antes,
    manter: true,
    quebra: quebrar,
  });
/** Subtítulo menor .m-sub (mono 9,4 pt cinza). */
const msub = (texto, antes = 3.4) => par(txt(texto, { fonte: "mono", negrito: true, tam: 9.4, cor: COR.g2 }), { tam: 9.4, antes, manter: true });
/** Linha "Referência: …" (8,4 pt). */
const refLinha = (texto, antes = 2.6) =>
  par([...txt("Referência: ", { fonte: "mono", negrito: true, tam: 8.4 }), ...txt(texto, { tam: 8.4, cor: COR.g2 })], { tam: 8.4, antes, depois: 2, manter: true });

const ok = (tam = 8.5) => [new TextRun({ text: "✓ ", font: "Segoe UI Symbol", size: pt(tam), color: COR.o, bold: true }), ...txt("Passa", { fonte: "mono", negrito: true, tam })];

/** Lista de definição .spec: rótulo à esquerda, valor mono à direita, fios entre as linhas. */
function spec(pares, largura) {
  const wv = Math.min(largura * 0.5, 60);
  return tabela({
    larguras: [largura - wv, wv],
    linhas: pares.map(([k, v], i) => {
      const topo = i === 0 ? borda(COR.g, 0.5) : undefined;
      const base = borda(COR.fio, 0.25);
      if (v == null)
        return { celulas: [cel([par(txt(k, { tam: 8.9 }), { tam: 8.9 })], { cs: 2, bordas: { topo, base }, margem: { t: 1.25, b: 1.25 } })] };
      return {
        celulas: [
          cel([par(txt(k, { tam: 8.9, cor: COR.g2 }), { tam: 8.9 })], { bordas: { topo, base }, margem: { t: 1.25, b: 1.25 } }),
          cel([par(txt(v, { fonte: "mono", negrito: true, tam: 8.9 }), { tam: 8.9, alinhar: AlignmentType.RIGHT })], { bordas: { topo, base }, margem: { t: 1.25, b: 1.25 } }),
        ],
      };
    }),
  });
}

/** Tabela do memorial (.memorial .t: 8,5 pt, cabeçalho 7,8 pt). */
const tabM = (o) => tabelaT({ tam: 8.5, tamCab: 7.8, pad: [1.35, 2.2], ...o });

/** Tamanho (mm) de uma imagem do corpo, medido no HTML (pelo arquivo, na ordem). */
function tamanhoMedido(m, arquivo, cont) {
  const lista = m.corpo.imagens.filter((i) => decodeURIComponent(i.src).replace(/\\/g, "/").endsWith(arquivo));
  const i = (cont[`img:${arquivo}`] = (cont[`img:${arquivo}`] ?? -1) + 1);
  return lista[i] ?? lista[0];
}

// ─── Contenção ────────────────────────────────────────────────────────────────────────────────
const COLS_RES = [
  ["Cota", "(m)"],
  ["Deslocamentos", "(mm)"],
  ["Diagrama de esforços axiais", "(kN/m)"],
  ["Diagrama de esforços cortantes", "(kN/m)"],
  ["Diagrama de momentos fletores", "(kN·m/m)"],
  ["Diagrama de empuxos", "(kN/m²)"],
  ["Pressão hidrostática", "(kN/m²)"],
];

function contencaoWord(c, m, cont, primeira) {
  const prox = (classe) => {
    const i = (cont[classe] = (cont[classe] ?? -1) + 1);
    return m.corpo.tabelas[classe]?.[i]?.cols;
  };
  const meia = (UTIL - 9) / 2;
  const out = [];
  if (!primeira) out.push(quebra());
  out.push(
    espaco(primeira ? 9 : 0),
    par([marcador(`s${c.n}`), ...txt(`${c.n}   `, { fonte: "mono", negrito: true, tam: 17, cor: COR.o }), ...txt(c.titulo, { fonte: "mono", negrito: true, tam: 17, espaco: -0.02 })], {
      tam: 17,
      fator: 1.2,
      manter: true,
    }),
    // Normas e materiais | Ações + Dados gerais
    tabela({
      larguras: [meia, 9, meia],
      linhas: [
        {
          celulas: [
            cel([mh("Normas e materiais"), espaco(2.6, { manter: true }), spec(c.normas, meia), new Paragraph({ children: [] })]),
            cel([]),
            cel([mh("Ações"), espaco(2.6, { manter: true }), spec(c.acoes, meia), mh("Dados gerais"), espaco(2.6, { manter: true }), spec(c.dadosGerais, meia), new Paragraph({ children: [] })]),
          ],
        },
      ],
    }),
    mh("Descrição do terreno"),
    espaco(2.6, { manter: true }),
    spec(c.terreno, UTIL),
    mh("Estratos"),
    espaco(2.6, { manter: true }),
    tabM({
      larguras: prox("t-estr") ?? [34, 26, 64, 50],
      cabecalho: ["Referências", "Cota superior", "Descrição", "Coeficientes de empuxo"],
      linhas: c.estratos.map((e) => [
        { t: e.ref, mono: true, negrito: true },
        e.cota,
        { filhos: e.descricao.map((d) => par(txt(d, { tam: 8.5 }), { tam: 8.5, fator: 1.6 })) },
        { filhos: e.coeficientes.map((d) => par(txt(d, { tam: 8.5 }), { tam: 8.5, fator: 1.6 })) },
      ]),
    }),
  );
  // Seção vertical | Geometria
  const sec = tamanhoMedido(m, c.secao, cont);
  out.push(
    espaco(2),
    tabela({
      larguras: [64, 10, UTIL - 74],
      linhas: [
        {
          celulas: [
            cel([mh("Seção vertical do terreno"), espaco(2.6, { manter: true }), parImagem(imagem(c.secao, { larg: sec?.w ?? 44, nome: `Seção vertical do terreno, ${c.titulo}` }))]),
            cel([]),
            cel([mh("Geometria"), espaco(2.6, { manter: true }), spec(c.geometria, UTIL - 74), new Paragraph({ children: [] })]),
          ],
        },
      ],
    }),
    mh("Esquema de fases"),
  );
  for (const f of c.fases) {
    const t = tamanhoMedido(m, f.img, cont);
    out.push(
      espaco(4),
      tabela({
        larguras: [102, 7, UTIL - 109],
        linhas: [
          {
            celulas: [
              cel([parImagem(imagem(f.img, { larg: t?.w ?? 102, nome: f.nome }))]),
              cel([]),
              cel([
                par([...txt(`${f.ref} `, { fonte: "mono", negrito: true }), ...txt(`· ${f.nome.replace(/^Fase \d - /, "")}`, { fonte: "mono", cor: COR.g3 })], {
                  depois: 1.6,
                  borda: { base: { cor: COR.g, mm: 0.5, espaco: 1.6 } },
                }),
                ...f.descricao.map((d) => par(txt(d, { tam: 8.6 }), { tam: 8.6, fator: 1.4, antes: 1.05, depois: 1.05, borda: { base: { cor: COR.fio, mm: 0.25, espaco: 1 } } })),
              ]),
            ],
          },
        ],
      }),
    );
  }
  if (c.cargas)
    out.push(
      mh("Cargas"),
      msub(c.cargas.titulo),
      espaco(2.6, { manter: true }),
      tabM({ larguras: prox("t") ?? [25, 30, 40, 40, 39], cabecalho: ["Tipo", "Cota", "Dados", "Fase inicial", "Fase final"], linhas: c.cargas.linhas }),
    );
  if (c.escoras)
    out.push(
      mh("Elementos de apoio"),
      msub("Escoras"),
      espaco(2.6, { manter: true }),
      tabM({
        larguras: prox("t") ?? [74, 50, 50],
        cabecalho: ["Descrição", "Fase inicial", "Fase final"],
        linhas: c.escoras.map((e) => [{ filhos: e.descricao.map((d) => par(txt(d, { tam: 8.5 }), { tam: 8.5 })) }, e.inicial, e.final]),
      }),
    );
  out.push(mh("Resultados das fases"));
  for (const r of c.resultados) out.push(...resultadosWord(r, prox("t-res")));
  if (c.apoio)
    out.push(
      mh("Resultados para os elementos de apoio"),
      msub(c.apoio.titulo),
      espaco(2.6, { manter: true }),
      tabela({
        larguras: prox("t") ?? [87, 87],
        linhas: [
          { cabecalho: true, celulas: [cel([par(txt(c.apoio.cota, { fonte: "mono", negrito: true, tam: 7.8, cor: COR.branco }), { tam: 7.8 })], { cs: 2, fundo: COR.g, margem: { t: 1.5, b: 1.5, e: 2.2, d: 2.2 } })] },
          {
            cabecalho: true,
            celulas: ["Fase", "Resultado"].map((h) => cel([par(txt(h, { fonte: "mono", negrito: true, tam: 7.8, cor: COR.branco }), { tam: 7.8 })], { fundo: COR.g, margem: { t: 1.5, b: 1.5, e: 2.2, d: 2.2 } })),
          },
          ...c.apoio.linhas.map(([f, rr]) => ({
            celulas: [
              cel([par(txt(f, { tam: 8.5 }), { tam: 8.5 })], { bordas: { base: borda() }, margem: { t: 1.35, b: 1.35, e: 2.2, d: 2.2 } }),
              cel(rr.map((x) => par(txt(x, { tam: 8.5 }), { tam: 8.5 })), { bordas: { base: borda() }, margem: { t: 1.35, b: 1.35, e: 2.2, d: 2.2 } }),
            ],
          })),
        ],
      }),
    );
  const arm = prox("t-arm");
  out.push(
    mh("Descrição da armadura"),
    espaco(2.6, { manter: true }),
    tabM({ junto: true, larguras: arm ?? [55, 55], cabecalho: ["Armadura vertical", "Armadura horizontal"], linhas: [[{ t: c.armadura.vertical, mono: true, negrito: true }, { t: c.armadura.horizontal, mono: true, negrito: true }]] }),
    mh("Verificações geométricas e de resistência"),
    refLinha(c.referencia),
    tabM({
      junto: true,
      larguras: prox("t-ver") ?? [100, 54, 20],
      cabecalho: ["Verificação", "Valores", "Estado"],
      linhas: c.verificacoes.map((v) => [
        { filhos: [par(txt(v.v, { tam: 8.5, negrito: true }), { tam: 8.5 }), par(txt(v.norma, { tam: 7.8, cor: COR.g3 }), { tam: 7.8, antes: 0.5 })] },
        { filhos: v.valores.map((x) => par(txt(x, { fonte: "mono", tam: 8.5 }), { tam: 8.5 })) },
        { filhos: [par(ok(), { tam: 8.5 })] },
      ]),
    }),
    msub("Informação adicional"),
    ...c.informacao.map((i) => par([new TextRun({ text: "■  ", font: "Arial", size: pt(6), color: COR.g4 }), ...txt(i, { tam: 8.4, cor: COR.g2 })], { tam: 8.4, antes: 1, recuo: { esq: 4, pend: 4 } })),
    mh("Verificações de estabilidade"),
    ...estabilidadeWord(c.referencia, c.estabilidade.coeficientes, "Coeficientes de segurança", prox("t-ver.t-est")),
    ...estabilidadeWord(c.referencia, c.estabilidade.circulo, "Círculo de deslizamento desfavorável", prox("t-ver.t-est")),
    mh("Quantitativos"),
    refLinha(c.quantitativos.referencia),
    quantitativosWord(c.quantitativos, prox("t-quant")),
    mh("Resumo de medição (incluídas perdas de aço)"),
    espaco(2.6, { manter: true }),
    resumoWord(c.resumo, prox("t-resumo")),
  );
  return out;
}

function resultadosWord(r, cols) {
  const L = cols ?? Array(7).fill(UTIL / 7);
  const cabCel = ([a, b], i) =>
    cel(
      [
        par(txt(a, { fonte: "mono", negrito: true, tam: 7, cor: COR.branco }), { tam: 7, fator: 1.18, alinhar: i ? AlignmentType.RIGHT : AlignmentType.LEFT }),
        par(txt(b, { fonte: "mono", tam: 6.8, cor: COR.cinzaClaro }), { tam: 6.8, fator: 1.18, antes: 0.4, alinhar: i ? AlignmentType.RIGHT : AlignmentType.LEFT }),
      ],
      { fundo: COR.g, margem: { t: 1.2, b: 1.2, e: 1.6, d: 1.6 }, vAlign: "base" },
    );
  const v = (t, i, o = {}) =>
    cel([par(txt(t, { tam: 7.9, fonte: i === 0 ? "mono" : undefined, negrito: i === 0 }), { tam: 7.9, fator: 1.3, alinhar: i ? AlignmentType.RIGHT : AlignmentType.LEFT })], {
      margem: { t: 0.75, b: 0.75, e: 1.6, d: 1.6 },
      bordas: { base: borda(COR.fio, 0.25) },
      ...o,
    });
  const ext = (rot, pares) => ({
    celulas: [
      cel([par(txt(rot, { fonte: "mono", negrito: true, tam: 7.9 }), { tam: 7.9 })], { fundo: COR.painel, margem: { t: 1, b: 1, e: 1.6, d: 1.6 }, bordas: { base: borda(COR.fio2, 0.25) } }),
      ...pares.map(([val, cota]) =>
        cel(
          [
            par(txt(val, { fonte: "mono", negrito: true, tam: 8.2 }), { tam: 8.2, fator: 1.25, alinhar: AlignmentType.RIGHT }),
            par(txt(`Cota: ${cota}`, { tam: 6.9, cor: COR.g3 }), { tam: 6.9, fator: 1.25, alinhar: AlignmentType.RIGHT }),
          ],
          { fundo: COR.painel, margem: { t: 1, b: 1, e: 1.6, d: 1.6 }, bordas: { base: borda(COR.fio2, 0.25) } },
        ),
      ),
    ],
  });
  return [
    par([...txt(`${r.fase} `, { fonte: "mono", negrito: true }), ...txt("· Básica", { fonte: "mono", cor: COR.g3 })], { antes: 6, depois: 1.8, manter: true }),
    tabela({
      junto: true,
      larguras: L,
      linhas: [
        { cabecalho: true, celulas: COLS_RES.map(cabCel) },
        ...r.linhas.map((l, k) => ({ celulas: l.map((x, i) => v(x, i, { fundo: k % 2 ? COR.zebra : undefined })) })),
        ext("Máximos", r.maximos),
        ext("Mínimos", r.minimos),
      ],
    }),
  ];
}

function estabilidadeWord(ref, b, titulo, cols) {
  const L = cols ?? [100, 54, 20];
  const m = { t: 1.35, b: 1.35, e: 2.2, d: 2.2 };
  const c = (t, o = {}) => cel([par(txt(t, { tam: 8.5, ...o.txt }), { tam: 8.5, alinhar: o.alinhar })], { bordas: { base: borda() }, margem: { ...m, ...(o.margem ?? {}) }, fundo: o.fundo, cs: o.cs });
  const linhas = [
    { cabecalho: true, celulas: ["Verificação", "Valores", "Estado"].map((h) => cel([par(txt(h, { fonte: "mono", negrito: true, tam: 7.8, cor: COR.branco }), { tam: 7.8 })], { fundo: COR.g, margem: { t: 1.5, b: 1.5, e: 2.2, d: 2.2 } })) },
  ];
  for (const cr of b.criterios) {
    linhas.push({ celulas: [c(cr.titulo, { cs: 3, fundo: COR.painel, txt: { negrito: true }, margem: { t: 1.8 } })] });
    linhas.push({ celulas: [c("Valor introduzido pelo usuário."), c(cr.minimo, { txt: { fonte: "mono" } }), c("")] });
    linhas.push({ celulas: [c(cr.grupo, { cs: 3, txt: { fonte: "mono", negrito: true, cor: COR.g2 } })] });
    for (const [f, v] of cr.fases)
      linhas.push({
        celulas: [
          c(`- ${f}`, { margem: { e: 5 } }),
          c(`Calculado: ${v}`, { txt: { fonte: "mono" } }),
          cel([par(ok(), { tam: 8.5 })], { bordas: { base: borda() }, margem: m }),
        ],
      });
  }
  linhas.push({
    celulas: [
      cel([par(txt("Todas as verificações foram cumpridas", { fonte: "mono", negrito: true, tam: 8.5 }), { tam: 8.5, alinhar: AlignmentType.CENTER })], {
        cs: 3,
        bordas: { topo: borda(COR.g, 0.5) },
        margem: m,
      }),
    ],
  });
  return [msub(`${b.letra}. ${titulo}`), refLinha(`Verificações de estabilidade (${titulo}): ${ref}`, 1), tabela({ larguras: L, linhas, junto: true })];
}

function quantitativosWord(q, cols) {
  const L = cols ?? [40, 34, 33, 33, 34];
  const h = (t, o = {}) =>
    cel([par(txt(t, { fonte: "mono", negrito: true, tam: 7.8, cor: COR.branco }), { tam: 7.8, alinhar: o.esq ? AlignmentType.LEFT : AlignmentType.CENTER })], {
      fundo: o.fundo ?? COR.g,
      cs: o.cs,
      rs: o.rs,
      margem: { t: 1.5, b: 1.5, e: 2.2, d: 2.2 },
      vAlign: "meio",
    });
  const v = (t, o = {}) =>
    cel([par(txt(t, { tam: 8.5, negrito: o.negrito, fonte: o.mono ? "mono" : undefined, cor: o.cor }), { tam: 8.5, alinhar: o.esq ? AlignmentType.LEFT : AlignmentType.CENTER })], {
      rs: o.rs,
      margem: { t: 1.35, b: 1.35, e: 2.2, d: 2.2 },
      bordas: { base: o.base },
      vAlign: "meio",
    });
  const fino = borda(COR.fio2, 0.25);
  return tabela({
    junto: true,
    larguras: L,
    linhas: [
      { cabecalho: true, celulas: [h("Nome da armadura", { cs: 2, rs: 2, esq: true }), h("CA-50", { cs: 2 }), h("Total", { rs: 2 })] },
      { cabecalho: true, celulas: [h("Ø6.3", { fundo: COR.cab2 }), h("Ø16", { fundo: COR.cab2 })] },
      ...q.linhas.flatMap((l) => [
        { celulas: [v(l.nome, { rs: 2, esq: true, negrito: true, base: fino }), v("Comprimento (m)", { esq: true, cor: COR.g2 }), ...l.comprimento.map((x, i) => v(x, { mono: i === 2, negrito: i === 2 }))] },
        { celulas: [v("Peso (kg)", { esq: true, cor: COR.g2, base: fino }), ...l.peso.map((x, i) => v(x, { mono: i === 2, negrito: i === 2, base: fino }))] },
      ]),
    ],
  });
}

function resumoWord(r, cols) {
  const L = cols ?? [62, 28, 28, 28, 28];
  const h = (t, o = {}) =>
    cel([par(txt(t, { fonte: "mono", negrito: true, tam: 7.8, cor: COR.branco }), { tam: 7.8, alinhar: o.esq ? AlignmentType.LEFT : AlignmentType.CENTER })], {
      fundo: o.fundo ?? COR.g,
      cs: o.cs,
      rs: o.rs,
      margem: { t: 1.5, b: 1.5, e: 2.2, d: 2.2 },
      vAlign: "meio",
    });
  const ult = r.linhas.length - 1;
  return tabela({
    junto: true,
    larguras: L,
    linhas: [
      { cabecalho: true, celulas: [h("Elemento", { rs: 2, esq: true }), h("CA-50 (kg)", { cs: 3 }), h("Concreto (m³)")] },
      { cabecalho: true, celulas: [...r.colunas.map((x) => h(x, { fundo: COR.cab2 })), h(r.concreto, { fundo: COR.cab2 })] },
      ...r.linhas.map((l, k) => ({
        celulas: l.map((x, i) =>
          cel([par(txt(x, { tam: 8.5, fonte: k === ult || i === 3 ? "mono" : undefined, negrito: k === ult || i === 3 }), { tam: 8.5, alinhar: i ? AlignmentType.CENTER : AlignmentType.LEFT })], {
            margem: { t: 1.35, b: 1.35, e: 2.2, d: 2.2 },
            bordas: { base: borda(), topo: k === ult ? borda(COR.g, 0.5) : undefined },
          }),
        ),
      })),
    ],
  });
}

// ─── Fundação ─────────────────────────────────────────────────────────────────────────────────
/** OMML de cada equação, com o mesmo texto do PDF (dados/fundacao/dados.mjs). */
async function mapaOmml() {
  const { equacoes, eq } = await import("../../dados/fundacao/dados.mjs");
  const mapa = new Map();
  // unidade escrita "KN" no Word original → "kN" (no OMML ela vem no meio do texto: "0,944 KN/cm²")
  const kN = (omml) => omml.replace(/(<m:t(?: [^>]*)?>)([^<]*)(<\/m:t>)/g, (_, a, t, b) => a + t.replace(/\bKN\b/g, "kN") + b);
  equacoes.forEach((e, n) => mapa.set(eq(n), kN(e.omml)));
  mapa.set(
    "<math><msub><mrow><mi>A</mi></mrow><mrow><mi>s</mi></mrow></msub></math>",
    '<m:oMath><m:sSub><m:e><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/><w:color w:val="22252A"/></w:rPr><m:t>A</m:t></m:r></m:e><m:sub><m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/><w:color w:val="22252A"/></w:rPr><m:t>s</m:t></m:r></m:sub></m:sSub></m:oMath>',
  );
  return mapa;
}

/**
 * "Qadm, est (400mm) = 86,5 tf" em texto: base em itálico, índice subscrito, branco sobre o grafite.
 * Lê o MathML da equação (msub + resto), então o valor continua vindo do Word original.
 */
function resultadoTexto(mathml) {
  const texto = (x) =>
    x
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s*([,=()])\s*/g, (_, c) => (c === "," ? ", " : c === "=" ? " = " : c === "(" ? " (" : ")"))
      .replace(/(\d), (\d)/g, "$1,$2") // vírgula decimal sem espaço
      .replace(/(\d) (mm|tf)/g, "$1 $2")
      .trim();
  const m = /^<math[^>]*><msub><mrow>([\s\S]*?)<\/mrow><mrow>([\s\S]*?)<\/mrow><\/msub>([\s\S]*)<\/math>$/.exec(mathml);
  if (!m) throw new Error("Resultado sem o formato esperado: " + mathml.slice(0, 80));
  const run = (t, o = {}) => new TextRun({ text: t, font: "Cambria Math", size: pt(15), color: COR.branco, ...o });
  return [run(texto(m[1]), { italics: true }), run(texto(m[2]).replace(/\s*\(\s*/, " (").replace(/(\d)\s*mm/, "$1 mm"), { subScript: true }), run(" " + texto(m[3]))];
}

function fundacaoBloco(b, omml, m, cont) {
  const eqx = (mathml, { bloco = false, tam = 11.5, cor } = {}) => {
    const o = omml.get(mathml);
    if (!o) throw new Error("Equação sem OMML: " + mathml.slice(0, 80));
    return equacao(o, { bloco, cor, tam });
  };
  const legenda = (leg, alinhar = AlignmentType.CENTER, manter = false) => {
    const i = leg.indexOf(" – ");
    const filhos = i < 0 ? txt(leg, { tam: 8.4, cor: COR.g2 }) : [...txt(leg.slice(0, i), { fonte: "mono", negrito: true, tam: 8.4 }), ...txt(` – ${leg.slice(i + 3)}`, { tam: 8.4, cor: COR.g2 })];
    return par(filhos, { tam: 8.4, fator: 1.35, alinhar, manter, depois: manter ? 2 : 0 });
  };
  switch (b.tipo) {
    case "lista":
      return b.itens.map((t, i) => item(t.replace(/\n/g, "\n"), { ref: "lista-mf", tam: 9.4, antes: i === 0 ? 3.2 : 1.2 }));
    case "p": {
      const partes = b.t.split(/\{\{(\d+)\}\}/);
      const filhos = partes.flatMap((p, i) => (i % 2 ? [eqx(b.eqs[Number(p)], { tam: 11.5 })] : txt(p, { tam: 9.4 })));
      return [par(filhos, { tam: 9.4, fator: 1.58, antes: 3.2 })];
    }
    case "sub":
      return [...(b.quebra ? [quebra()] : []), mh(b.t, { antes: b.quebra ? 0 : 6 })];
    case "obs":
      return [par([...txt(`${b.rotulo ?? "Obs.:"} `, { fonte: "mono", negrito: true, tam: 8.6 }), ...txt(b.t.replace(/\n/g, " · "), { tam: 8.6, cor: COR.g2 })], { tam: 8.6, fator: 1.5, antes: 3 })];
    case "figura": {
      const medida = tamanhoMedido(m, b.arquivo, cont);
      const larg = medida?.w ?? Number.parseFloat(b.largura ?? "150");
      return [
        ...(b.pagina ? [quebra()] : []),
        ...(b.titulo ? [par(txt(b.titulo), { antes: b.pagina ? 0 : 4, depois: 3, manter: true })] : []),
        parImagem(imagem(b.arquivo, { larg, nome: b.alt ?? b.legenda ?? b.arquivo }), { alinhar: AlignmentType.CENTER, antes: b.titulo || b.pagina ? 0 : 4, manter: Boolean(b.legenda) }),
        ...(b.legenda ? [legenda(b.legenda)] : []),
      ];
    }
    case "equacao":
      return [
        tabela({
          larguras: [UTIL],
          linhas: [{ celulas: [cel([new Paragraph({ alignment: AlignmentType.CENTER, children: [eqx(b.mathml, { tam: 14 })] })], { fundo: COR.painel, margem: { t: 3.4, b: 3.4, e: 4, d: 4 } })] }],
        }),
      ];
    case "onde":
      return [
        par(txt("Onde:", { fonte: "mono", negrito: true, tam: 9, cor: COR.g3 }), { tam: 9, antes: 3.4, depois: 1, manter: true }),
        tabela({
          larguras: [24, UTIL - 24],
          junto: true,
          linhas: b.itens.map(([mm_, t]) => ({
            celulas: [
              cel([new Paragraph({ alignment: AlignmentType.RIGHT, children: [eqx(mm_, { tam: 11 })] })], { bordas: { base: borda(COR.fio, 0.2) }, margem: { t: 0.7, b: 0.7, d: 2.4 }, vAlign: "meio" }),
              cel([par(txt(t, { tam: 9.4 }), { tam: 9.4 })], { bordas: { base: borda(COR.fio, 0.2) }, margem: { t: 0.7, b: 0.7 }, vAlign: "meio" }),
            ],
          })),
        }),
      ];
    case "calculo": {
      const meia = (UTIL - 8 - 6) / 2;
      const eqCel = (i) =>
        b.eqs[i] == null
          ? cel([])
          : cel([par([eqx(b.eqs[i], { tam: 11 }), ...(b.nota && i === b.notaApos ? txt(`   (${b.nota})`, { tam: 8.4, cor: COR.g3 }) : [])], { tam: 11 })], { margem: { t: 0.6, b: 0.6 } });
      const linhasEq = [];
      for (let i = 0; i < b.eqs.length; i += 2) linhasEq.push({ celulas: [cel([], {}), eqCel(i), cel([]), eqCel(i + 1), cel([])] });
      const fio = borda(COR.fio2, 0.25);
      return [
        espaco(4),
        tabela({
          larguras: [4, meia, 6, meia, 4],
          junto: true,
          linhas: [
            { celulas: [cel([par(txt(b.titulo, { fonte: "mono", negrito: true }), {})], { cs: 5, fundo: COR.painel, margem: { t: 2, b: 2, e: 4 }, bordas: { topo: fio, base: fio, esq: fio, dir: fio } })] },
            ...linhasEq.map((l, k) => ({
              celulas: l.celulas.map((cc, j) => ({
                ...cc,
                bordas: { esq: j === 0 ? fio : undefined, dir: j === 4 ? fio : undefined },
                margem: { ...(cc.margem ?? {}), t: k === 0 ? 3 : 0.6, b: k === linhasEq.length - 1 ? 3 : 0.6 },
              })),
            })),
            {
              celulas: [cel([par(resultadoTexto(b.resultado), { tam: 15 })], { cs: 5, fundo: COR.g, margem: { t: 2.8, b: 2.8, e: 4, d: 4 }, bordas: { esq: fio, dir: fio, base: fio } })],
            },
          ],
        }),
      ];
    }
    case "tabela":
      return [legenda(b.legenda ?? "", AlignmentType.LEFT, true), tabelaMf(b, m, cont)];
    case "estaqueamento":
      return [legenda(b.legenda, AlignmentType.LEFT, true), estaqueamentoWord(b)];
    default:
      throw new Error(`Word: bloco de memorial "${b.tipo}" desconhecido.`);
  }
}

/** Tabela .t-mf (cabeçalho com células mescladas, corpo centralizado). */
function tabelaMf(b, m, cont) {
  const chave = b.classe ? `t-mf` : "t-mf";
  const i = (cont[`mf:${chave}`] = (cont[`mf:${chave}`] ?? -1) + 1);
  const medidas = m.corpo.tabelas["t-mf"]?.[i];
  const nCols = b.cabecalho.reduce((mx, l) => Math.max(mx, l.reduce((a, c) => a + (c?.cs ?? 1), 0)), 0);
  const larguraTotal = b.classe === "mf-estreita" ? 84 : UTIL;
  const L = medidas?.cols?.length === nCols ? medidas.cols : Array(nCols).fill(larguraTotal / nCols);
  const celula = (c, cab, linhaIdx) => {
    const o = c !== null && typeof c === "object" ? c : { t: c };
    const cls = String(o.c ?? "");
    const t = o.t === "-" ? "–" : String(o.t ?? "");
    const alinhar = cls.includes("nome") ? AlignmentType.LEFT : AlignmentType.CENTER;
    if (cab)
      return cel([par(txt(t, { fonte: "mono", negrito: true, tam: 7.6, cor: COR.branco }), { tam: 7.6, fator: 1.2, alinhar: AlignmentType.CENTER })], {
        cs: o.cs,
        rs: o.rs,
        fundo: cls.includes("dest") ? COR.oi : linhaIdx > 0 ? COR.cab2 : COR.g,
        margem: { t: 1.5, b: 1.5, e: 1.5, d: 1.5 },
        vAlign: "meio",
      });
    return cel(
      [
        par(
          txt(t, {
            tam: 8.5,
            negrito: cls.includes("nome") || cls.includes("dest") || cls.includes("tot") || cls.includes("nota"),
            fonte: cls.includes("tot") || cls.includes("nota") ? "mono" : undefined,
            italico: cls.includes("simb"),
            cor: t === "–" ? COR.g4 : cls.includes("nota") ? COR.g2 : undefined,
          }),
          { tam: 8.5, fator: 1.3, alinhar },
        ),
      ],
      {
        cs: o.cs,
        rs: o.rs,
        fundo: cls.includes("dest") || cls.includes("nota") ? COR.painel : undefined,
        bordas: { base: borda(b.classe === "mf-quant" ? COR.fio2 : COR.fio, 0.2) },
        margem: b.classe === "mf-quant" ? { t: 0.55, b: 0.55, e: 1.2, d: 1.2 } : { t: 1.4, b: 1.4, e: 2.2, d: 2.2 },
        vAlign: "meio",
      },
    );
  };
  return tabela({
    larguras: L,
    junto: true,
    linhas: [
      ...b.cabecalho.map((l, k) => ({ cabecalho: true, celulas: l.map((c) => celula(c, true, k)) })),
      ...b.linhas.map((l) => ({ celulas: l.map((c) => celula(c, false)) })),
    ],
  });
}

/** Estaqueamento por pilar (.t-est2): faixa grafite por bloco, zebra, cargas em destaque. */
function estaqueamentoWord(b) {
  const L = [19, 17, 17, 17, 13, 13, 15, 14, 20, 20].map((w) => (w * UTIL) / 165);
  const COLS = ["pilar", "nSem", "nCom", "perm", "vento", "quant", "diam", "comp", "cargaSem", "cargaCom"];
  const h = (t, o = {}) =>
    cel([par(txt(t, { fonte: "mono", negrito: true, tam: 6.8, cor: COR.branco }), { tam: 6.8, fator: 1.15, alinhar: o.esq ? AlignmentType.LEFT : AlignmentType.CENTER })], {
      fundo: o.fundo ?? COR.g,
      cs: o.cs,
      rs: o.rs,
      margem: { t: 1.1, b: 1.1, e: o.esq ? 2 : 0.8, d: 0.8 },
      vAlign: "meio",
    });
  const linhas = [
    {
      cabecalho: true,
      celulas: [
        h("Pilar", { rs: 2, esq: true }),
        h("N+5% (tf)", { cs: 2 }),
        h("Perm. + Acid. (tf)", { rs: 2 }),
        h("Vento Fz (tf)", { rs: 2 }),
        h("Quant.", { rs: 2 }),
        h("Diâmetro (cm)", { rs: 2 }),
        h("L escav. (m)", { rs: 2 }),
        h("Carga por estaca (tf)", { cs: 2 }),
      ],
    },
    { cabecalho: true, celulas: ["s/ vento Fz", "c/ vento Fz", "sem vento Fz", "com vento Fz"].map((t) => h(t, { fundo: COR.cab2 })) },
  ];
  let k = 0;
  for (const g of b.grupos) {
    if (g.rotulo) {
      linhas.push({ celulas: [cel([par(txt(g.rotulo, { fonte: "mono", negrito: true, tam: 7.4, espaco: 0.14, cor: COR.branco }), { tam: 7.4 })], { cs: 10, fundo: COR.g, margem: { t: 0.9, b: 0.9, e: 2 } })] });
      k++;
    }
    for (const l of g.linhas) {
      const zebra = k % 2 === 1;
      linhas.push({
        celulas: COLS.map((c, i) => {
          const v = l[c] === "-" ? "–" : String(l[c] ?? "");
          return cel(
            [
              par(txt(v, { tam: 7.9, fonte: i === 0 ? "mono" : undefined, negrito: i === 0 || i >= 8, cor: v === "–" ? COR.g4 : undefined }), {
                tam: 7.9,
                fator: 1.2,
                alinhar: i === 0 ? AlignmentType.LEFT : i >= 5 && i <= 7 ? AlignmentType.CENTER : AlignmentType.RIGHT,
              }),
            ],
            {
              fundo: i >= 8 ? COR.painel : zebra ? COR.zebra : undefined,
              bordas: { base: borda(COR.fio, 0.2) },
              margem: { t: 0.42, b: 0.42, e: i === 0 ? 2 : 1.6, d: 1.6 },
            },
          );
        }),
      });
      k++;
    }
  }
  return tabela({ larguras: L, linhas });
}

function fechoWord(f) {
  const w = (UTIL - 12) / 3;
  return [
    espaco(12),
    par(txt(f.local, { cor: COR.g2 }), { borda: { topo: { cor: COR.fio2, mm: 0.3, espaco: 5 } } }),
    espaco(5),
    tabela({
      larguras: [w, 6, w, 6, w],
      linhas: [
        {
          celulas: f.nomes.flatMap((n, i) => [
            ...(i ? [cel([])] : []),
            cel([par(txt(n, { fonte: "mono", negrito: true, tam: 9.4 }), { tam: 9.4, fator: 1.35 })], { bordas: { topo: borda(COR.g, 0.3) }, margem: { t: 2 } }),
          ]),
        },
      ],
    }),
  ];
}

// ─── Memorial completo ────────────────────────────────────────────────────────────────────────
export async function memorialWord(memorial, m, cont) {
  const out = [quebra(), ...tituloSecao(memorial.n, memorial.titulo, { id: `s${memorial.n}`, antes: 0 })];
  if (memorial.tipo === "contencao") {
    memorial.contencoes.forEach((c, i) => out.push(...contencaoWord(c, m, cont, i === 0)));
    return out;
  }
  const omml = await mapaOmml();
  // figura de página inteira (perfis de sondagem, armações): no PDF ela tem quebra antes e depois
  let depoisDaFigura = false;
  const comecaPagina = (b) => (b.tipo === "figura" && b.pagina) || (b.tipo === "sub" && b.quebra);
  memorial.secoes.forEach((s, i) => {
    const quebrou = s.quebra || depoisDaFigura;
    if (quebrou) out.push(quebra());
    depoisDaFigura = false;
    out.push(
      espaco(quebrou ? 0 : i === 0 ? 6 : 8),
      par([marcador(`s${s.n}`), ...txt(`${s.n}`, { fonte: "mono", negrito: true, tam: 13, cor: COR.o }), ...txt("\t"), ...txt(s.titulo, { fonte: "mono", negrito: true, tam: 13, espaco: -0.015 })], {
        tam: 13,
        fator: 1.2,
        manter: true,
        tabs: [{ tipo: "left", mm: 14 }],
        borda: { base: { cor: COR.fio, mm: 0.3, espaco: 2 } },
        depois: 0,
      }),
    );
    for (const b of s.blocos) {
      if (depoisDaFigura && !comecaPagina(b)) out.push(quebra());
      out.push(...fundacaoBloco(b, omml, m, cont));
      depoisDaFigura = b.tipo === "figura" && Boolean(b.pagina);
    }
  });
  out.push(...fechoWord(memorial.fecho));
  return out;
}

