/**
 * Carta, cláusulas 1–10 e assinaturas no Word, com o desenho de src/corpo.mjs: título de seção com
 * número laranja e fio laranja/cinza, cláusula com o número numa coluna de 11,5 mm, tabelas com
 * cabeçalho grafite, caixa de total, cartões, observações e o bloco de assinaturas.
 */
import { AlignmentType, LevelFormat, Paragraph } from "docx";
import { COR, UTIL, borda, cel, espaco, fio, marcador, par, tabela, txt } from "./base.mjs";

export const COL = 11.5; // coluna do número das cláusulas
const LT = UTIL - COL; // largura do texto da cláusula

/** Numeração (marcador quadrado laranja) das listas: registrar em Document.numbering. */
export const numeracaoListas = [
  {
    reference: "lista-cl",
    levels: [
      {
        level: 0,
        format: LevelFormat.BULLET,
        text: "■",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: Math.round((COL + 4.6) * 56.6929), hanging: Math.round(4.6 * 56.6929) } }, run: { color: COR.o, size: 14 } },
      },
    ],
  },
  {
    reference: "lista-mf",
    levels: [
      {
        level: 0,
        format: LevelFormat.BULLET,
        text: "■",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: Math.round(4.6 * 56.6929), hanging: Math.round(4.6 * 56.6929) } }, run: { color: COR.o, size: 14 } },
      },
    ],
  },
];

/** Item de lista com marcador quadrado laranja. */
export const item = (texto, { ref = "lista-cl", tam = 9.6, antes = 1.2, realce } = {}) =>
  new Paragraph({
    children: txt(texto, { tam, realce }),
    numbering: { reference: ref, level: 0 },
    spacing: { before: Math.round(antes * 56.6929), after: 0, line: Math.round(tam * 1.52 * 20), lineRule: "atLeast" },
  });

/** Quebra de página antes do próximo bloco (parágrafo vazio de 1 pt). */
export const quebra = () => new Paragraph({ children: [], pageBreakBefore: true, spacing: { before: 0, after: 0, line: 20, lineRule: "exact" } });

/**
 * Título de seção: número laranja (coluna de 12,5 mm) + título; fio laranja sob o número e cinza no
 * resto. `id` vira marcador para o número de página do sumário.
 */
export function tituloSecao(n, titulo, { id, tam = 14, antes = 10 } = {}) {
  // parágrafos (não tabela): assim o título fica preso ao texto seguinte em qualquer programa
  return [
    par(
      [
        ...(id ? [marcador(id)] : []),
        ...txt(n, { fonte: "mono", negrito: true, tam, cor: COR.o }),
        ...txt("\t", { tam }),
        ...txt(titulo, { fonte: "mono", negrito: true, tam, espaco: -0.015 }),
      ],
      { tam, fator: 1.15, antes, depois: 2.6, manter: true, junto: true, tabs: [{ tipo: "left", mm: 12.5 }], recuo: { esq: 12.5, pend: 12.5 } },
    ),
    fio(
      [
        { mm: 14, cor: COR.o },
        { mm: UTIL - 14, cor: COR.fio },
      ],
      0.55,
    ),
  ];
}

/** Cláusula: número cinza na coluna de 11,5 mm, texto ao lado (recuo pendente). */
export const clausula = (n, texto, { antes = 3, realce, manter = false } = {}) =>
  par([...txt(n, { fonte: "mono", negrito: true, tam: 9.4, cor: COR.g3 }), ...txt("\t"), ...txt(texto, { realce })], {
    antes,
    junto: true,
    manter,
    recuo: { esq: COL, pend: COL },
    tabs: [{ tipo: "left", mm: COL }],
  });

/** Tabela no estilo .t: cabeçalho grafite (texto branco) e linhas com fio cinza embaixo. */
export function tabelaT({ larguras, cabecalho, linhas, recuo = 0, tam = 9.2, tamCab = 8.4, pad = [1.9, 2.6], alinhar = [], zebra = false, junto = false }) {
  const [pv, ph] = pad;
  const alinh = (i) => ({ r: AlignmentType.RIGHT, c: AlignmentType.CENTER }[alinhar[i]] ?? AlignmentType.LEFT);
  return tabela({
    larguras,
    recuo,
    junto,
    linhas: [
      ...(cabecalho
        ? [
            {
              cabecalho: true,
              celulas: cabecalho.map((h, i) =>
                cel([par(txt(h, { fonte: "mono", negrito: true, tam: tamCab, espaco: 0.03, cor: COR.branco }), { tam: tamCab, fator: 1.25, alinhar: alinh(i) })], {
                  fundo: COR.g,
                  margem: { t: pv, b: pv, e: ph, d: ph },
                  vAlign: "base",
                }),
              ),
            },
          ]
        : []),
      ...linhas.map((l, r) => ({
        celulas: l.map((c, i) => {
          const o = typeof c === "object" && c !== null && !Array.isArray(c) ? c : { t: c };
          const filhos = o.filhos ?? [par(txt(o.t ?? "", { tam: o.tam ?? tam, fonte: o.mono ? "mono" : undefined, negrito: o.negrito, cor: o.cor }), { tam: o.tam ?? tam, alinhar: o.alinhar ?? alinh(i) })];
          return cel(filhos, {
            bordas: { base: borda(COR.fio, 0.25), topo: o.topo },
            margem: { t: pv, b: pv, e: ph, d: ph },
            fundo: o.fundo ?? (zebra && r % 2 ? COR.zebra : undefined),
            cs: o.cs,
            rs: o.rs,
          });
        }),
      })),
    ],
  });
}

// ─── Carta ────────────────────────────────────────────────────────────────────────────────────
export function cartaWord(proposta, carta) {
  return [
    tabela({
      larguras: [100, UTIL - 100],
      linhas: [
        {
          celulas: [
            cel([par([marcador("carta"), ...txt(carta.codigo, { fonte: "mono", negrito: true, tam: 11, espaco: 0.04 })], { tam: 11 })], {
              bordas: { base: borda(COR.fio, 0.25) },
              margem: { b: 3 },
              vAlign: "base",
            }),
            cel([par(txt(proposta.cidadeData, { tam: 10, cor: COR.g2 }), { tam: 10, alinhar: AlignmentType.RIGHT })], {
              bordas: { base: borda(COR.fio, 0.25) },
              margem: { b: 3 },
              vAlign: "base",
            }),
          ],
        },
      ],
    }),
    espaco(8),
    tabela({
      larguras: [82, 10, 82],
      linhas: [
        {
          celulas: [
            cel([
              par(txt(carta.destinatario[0], { tam: 10 }), { tam: 10, fator: 1.45 }),
              par(txt(carta.destinatario[1], { fonte: "mono", negrito: true, tam: 13, espaco: -0.01 }), { tam: 13, fator: 1.45, antes: 0.6, depois: 0.6 }),
              par(txt(carta.destinatario[2], { tam: 10 }), { tam: 10, fator: 1.45 }),
            ]),
            cel([]),
            cel([par(txt(carta.atencao, { tam: 10, negrito: true }), { tam: 10, fator: 1.45 })], { vAlign: "base" }),
          ],
        },
      ],
    }),
    espaco(7),
    tabela({
      larguras: [18, UTIL - 18],
      linhas: [
        {
          celulas: [
            cel([par(txt("Ref.:", { fonte: "mono", negrito: true, tam: 9, espaco: 0.08, caixaAlta: true, cor: COR.oi }), { tam: 9, antes: 0.5 })], {
              fundo: COR.painel,
              margem: { t: 4.5, b: 4.5, e: 5 },
            }),
            cel([par(txt(carta.referencia, { tam: 10, negrito: true }), { tam: 10, fator: 1.5 })], { fundo: COR.painel, margem: { t: 4.5, b: 4.5, d: 5 } }),
          ],
        },
      ],
    }),
    par(txt(carta.saudacao, { negrito: true }), { antes: 8 }),
    par(txt(carta.abertura, { tam: 10 }), { tam: 10, fator: 1.6, antes: 2.5 }),
  ];
}

// ─── Blocos das cláusulas ─────────────────────────────────────────────────────────────────────
/** Planilha de preços (fundação, Tabelas 01 a 03) no desenho de .t-plan. */
function planilhaWord(b, cols) {
  const L = cols ?? [12, UTIL - 91, 17, 10, 25, 27];
  const nd = (v) => (v == null || v === "" ? "" : v === "-" ? "–" : v);
  const tam = 8.2;
  const c = (t, o = {}) => ({ t, tam, ...o });
  const linhas = b.linhas.map((l) => {
    if (l.tipo === "titulo")
      return { n0: true, cells: [c(l.item, { mono: true, negrito: true, cor: COR.oi }), c(l.desc, { cs: 5, mono: true, negrito: true })] };
    if (l.tipo === "total") return { total: true, cells: [c(l.desc, { cs: 5, mono: true, negrito: true, cor: COR.branco }), c(nd(l.total), { mono: true, negrito: true, cor: COR.branco, tam: 11, alinhar: AlignmentType.RIGHT })] };
    const porExtenso = l.un == null && l.qtd != null && /[a-zà-ú]/i.test(l.qtd);
    const nivel = l.tipo === "item" ? "item" : l.item.includes(".") ? "n1" : "n0";
    const forte = nivel !== "item";
    const qtdUn = porExtenso ? [c(l.qtd, { cs: 2, alinhar: AlignmentType.RIGHT, negrito: forte })] : [c(nd(l.qtd), { alinhar: AlignmentType.RIGHT, negrito: forte }), c(nd(l.un), { negrito: forte })];
    return {
      n0: nivel === "n0",
      n1: nivel === "n1",
      cells: [
        c(l.item, { mono: true, negrito: true, cor: nivel === "n0" ? COR.oi : COR.g3 }),
        c(l.desc, { negrito: forte, mono: nivel === "n0", recuo: nivel === "item" }),
        ...qtdUn,
        c(nd(l.unit), { alinhar: AlignmentType.RIGHT, negrito: forte }),
        c(nd(l.total), { alinhar: AlignmentType.RIGHT, negrito: true }),
      ],
    };
  });
  const cab = ["Item", "Descrição", "Quant.", "Un.", "Preço unit. (R$)", "Total (R$)"];
  const alinhCab = [0, 0, 1, 0, 1, 1];
  return [
    par(txt(b.legenda, { fonte: "mono", negrito: true }), { antes: 5, depois: 2, manter: true }),
    tabela({
      larguras: L,
      juntoFim: 2,
      linhas: [
        {
          cabecalho: true,
          celulas: cab.map((h, i) =>
            cel([par(txt(h, { fonte: "mono", negrito: true, tam: 7.6, espaco: 0.03, cor: COR.branco }), { tam: 7.6, fator: 1.25, alinhar: alinhCab[i] ? AlignmentType.RIGHT : AlignmentType.LEFT })], {
              fundo: COR.g,
              margem: { t: 1.4, b: 1.4, e: 2, d: 2 },
              vAlign: "base",
            }),
          ),
        },
        ...linhas.map((x) => ({
          celulas: x.cells.map((o) =>
            cel(
              [
                par(txt(o.t ?? "", { tam: o.tam, fonte: o.mono ? "mono" : undefined, negrito: o.negrito, cor: o.cor ?? (o.t === "–" ? COR.g4 : undefined) }), {
                  tam: o.tam,
                  fator: 1.25,
                  alinhar: o.alinhar,
                  recuo: o.recuo ? { esq: 3 } : undefined,
                }),
              ],
              {
                cs: o.cs,
                fundo: x.total ? COR.g : x.n0 ? COR.painel : x.n1 ? COR.zebra : undefined,
                bordas: { base: x.total ? undefined : borda(COR.fio, 0.2), topo: x.n0 ? borda(COR.g, 0.45) : undefined },
                margem: x.total ? { t: 2, b: 2, e: 2, d: 2 } : x.n0 ? { t: 1.2, b: 1.2, e: 2, d: 2 } : { t: 0.85, b: 0.85, e: 2, d: 2 },
                vAlign: "meio",
              },
            ),
          ),
        })),
      ],
    }),
  ];
}

/**
 * Um bloco de seção (cláusula, tabela, total, cartões, observações…).
 * @param m medidas do HTML (colunas das tabelas, largura do valor do total)
 * @param cont contadores por classe de tabela (para pegar as colunas certas do HTML)
 */
export function blocoWord(b, secao, m, cont, primeiro = false) {
  const prox = (classe) => {
    const i = (cont[classe] = (cont[classe] ?? -1) + 1);
    return m.corpo.tabelas[classe]?.[i]?.cols;
  };
  const realce = undefined; // revisões: o PDF sai limpo (config.marcarRevisoes = false)
  switch (b.tipo) {
    case "contencoes":
    case "modulos": {
      const cols = prox(b.tipo === "contencoes" ? "t-cont" : "t-cont.t-mod") ?? (b.tipo === "contencoes" ? [15, 60, 55, 32.5] : [15, 59.5, 44, 44]);
      const cab = b.tipo === "contencoes" ? ["Item", "Contenção", "Solução", "Área (m²)"] : ["Item", "Módulo", ...b.colunas];
      const linhas =
        b.tipo === "contencoes"
          ? b.linhas.map((l) => [
              { t: l.n, mono: true, negrito: true, cor: COR.g3 },
              { t: l.nome, negrito: true },
              l.solucao,
              { t: l.area, mono: true, negrito: true, tam: 10, alinhar: AlignmentType.RIGHT },
            ])
          : b.linhas.map((l) => [
              { t: l.n, mono: true, negrito: true, cor: COR.g3 },
              { t: l.nome, negrito: true },
              ...l.valores.map((v) => (v == null ? { t: "–", cor: COR.g4, alinhar: AlignmentType.RIGHT, mono: true, tam: 10 } : { t: v, mono: true, negrito: true, tam: 10, alinhar: AlignmentType.RIGHT })),
            ]);
      return [
        par(txt(b.titulo, { fonte: "mono", negrito: true }), { antes: 4, depois: 2, recuo: { esq: COL }, manter: true }),
        tabelaT({ larguras: cols, cabecalho: cab, linhas, recuo: COL, junto: true, alinhar: b.tipo === "contencoes" ? [0, 0, 0, "r"] : [0, 0, "r", "r"] }),
      ];
    }
    case "total": {
      const wv = Math.min(80, (m.corpo.totais[cont.total = (cont.total ?? -1) + 1]?.w ?? 50) + 1);
      return [
        espaco(3),
        tabela({
          larguras: [COL, 5 + wv + 6, LT - (5 + wv + 6)],
          linhas: [
            {
              celulas: [
                cel([par(txt(b.n, { fonte: "mono", negrito: true, tam: 9.4, cor: COR.g3 }), { tam: 9.4 })], { margem: { t: 1 } }),
                cel([par(txt(b.valor, { fonte: "mono", negrito: true, tam: 21, espaco: -0.02, cor: COR.branco }), { tam: 21, fator: 1.1 })], {
                  fundo: COR.g,
                  margem: { t: 4, b: 4, e: 5, d: 6 },
                  vAlign: "meio",
                }),
                cel([par(txt(`**${b.rotulo}** ${b.t}`, { cor: "E8E9EC", corForte: COR.branco }), { fator: 1.5 })], {
                  fundo: COR.g,
                  margem: { t: 4, b: 4, d: 5 },
                  vAlign: "meio",
                }),
              ],
            },
          ],
        }),
      ];
    }
    case "tabela-precos":
      return [
        par(txt(b.legenda, { fonte: "mono", negrito: true }), { antes: 4, depois: 2, manter: true }),
        b.linhas
          ? tabelaT({ larguras: [UTIL - 50, 50], linhas: b.linhas.map(([a, v]) => [a, { t: v, alinhar: AlignmentType.RIGHT }]) })
          : tabela({
              larguras: [UTIL],
              linhas: [
                {
                  celulas: [
                    cel(
                      [
                        par(txt("[Tabela de preços globais: inserir]", { fonte: "mono", negrito: true, tam: 12, cor: COR.oi }), { tam: 12, alinhar: AlignmentType.CENTER }),
                        par(txt("A tabela não consta no arquivo original da proposta. Preencher antes do envio.", { tam: 9, cor: COR.g2 }), { tam: 9, alinhar: AlignmentType.CENTER, antes: 1.5 }),
                      ],
                      {
                        fundo: COR.ow,
                        margem: { t: 7, b: 7, e: 6, d: 6 },
                        bordas: { topo: tracejada(), base: tracejada(), esq: tracejada(), dir: tracejada() },
                      },
                    ),
                  ],
                },
              ],
            }),
        espaco(1),
      ];
    case "planilha":
      return planilhaWord(b, prox("t-plan"));
    case "faturamento":
    case "cartoes": {
      const w = (LT - 4) / 2;
      return [
        clausula(b.n, `**${b.rotulo}**`, { antes: secao.compacto ? 1.5 : 3 }),
        espaco(2.5),
        tabela({
          larguras: [w, 4, w],
          recuo: COL,
          linhas: [
            {
              celulas: [0, null, 1].map((k) =>
                k == null
                  ? cel([])
                  : cel(
                      [
                        par(txt(b.partes[k].pct, { fonte: "mono", negrito: true, tam: 20, espaco: -0.02, cor: COR.o }), { tam: 20, fator: 1 }),
                        par(txt(b.partes[k].t, { tam: 9 }), { tam: 9, fator: 1.5, antes: 2.4 }),
                      ],
                      { fundo: COR.painel, margem: { t: 4, b: 4, e: 4.5, d: 4.5 } },
                    ),
              ),
            },
          ],
        }),
      ];
    }
    case "obs":
      return [
        espaco(4),
        tabela({
          larguras: [15, LT - 15],
          recuo: COL,
          junto: true,
          linhas: b.itens.map((t, i) => ({
            celulas: [
              cel([par(txt(`Obs.: ${i + 1}.`, { fonte: "mono", negrito: true, tam: 9.2 }), { tam: 9.2, fator: 1.5 })], {
                bordas: { topo: i === 0 ? borda(COR.fio, 0.25) : undefined },
                margem: { t: i === 0 ? 3 : 2 },
              }),
              cel([par(txt(t, { tam: 9.2, cor: COR.g2 }), { tam: 9.2, fator: 1.5 })], {
                bordas: { topo: i === 0 ? borda(COR.fio, 0.25) : undefined },
                margem: { t: i === 0 ? 3 : 2 },
              }),
            ],
          })),
        }),
      ];
    case "paragrafo":
      return [par(txt(b.t, { tam: 9.8 }), { tam: 9.8, fator: 1.6, antes: 3.4 })];
    default: {
      const compacto = secao.compacto;
      const temMais = Boolean(b.sub?.length || b.insumos || b.lista);
      const out = [clausula(b.n, b.t, { antes: primeiro ? 3.6 : compacto ? 1.5 : 3, realce, manter: temMais })];
      for (const s of b.sub ?? [])
        out.push(
          par([...txt(s.n, { fonte: "mono", negrito: true, cor: COR.oi }), ...txt("\t"), ...txt(s.t)], {
            antes: s === b.sub[0] ? 2.2 : 1.6,
            junto: true,
            manter: s !== b.sub[b.sub.length - 1] || Boolean(b.insumos || b.lista),
            recuo: { esq: COL + 6, pend: 6 },
            tabs: [{ tipo: "left", mm: COL + 6 }],
          }),
        );
      if (b.insumos) {
        out.push(espaco(2.5));
        out.push(
          tabela({
            larguras: [LT - 70, 70],
            recuo: COL,
            junto: true,
            linhas: b.insumos.map(([a, v], i) => ({
              celulas: [
                cel([par(txt(a), {})], { bordas: { base: borda(COR.fio, 0.25), topo: i === 0 ? borda(COR.g, 0.5) : undefined }, margem: { t: 1.8, b: 1.8, e: 2.6, d: 2.6 } }),
                cel([par(txt(v, { fonte: "mono", negrito: true }), { alinhar: AlignmentType.RIGHT })], {
                  bordas: { base: borda(COR.fio, 0.25), topo: i === 0 ? borda(COR.g, 0.5) : undefined },
                  margem: { t: 1.8, b: 1.8, e: 2.6, d: 2.6 },
                }),
              ],
            })),
          }),
        );
      }
      if (b.lista) {
        if (b.complemento) out.push(par(txt(b.complemento), { antes: 2, recuo: { esq: COL } }));
        b.lista.forEach((l, i) => out.push(item(l, { antes: i === 0 ? 2 : 1.2 })));
      }
      return out;
    }
  }
}

const tracejada = () => ({ style: "dashed", size: 8, color: COR.oi });

/** Uma seção inteira (título + introdução + blocos). */
export function secaoWord(s, m, cont) {
  const out = [];
  if (s.quebraAntes) out.push(quebra());
  out.push(...tituloSecao(s.n, s.titulo, { id: `s${s.n}`, antes: s.quebraAntes ? 0 : 10 }));
  // a introdução não se separa do título nem do que vem depois (como no PDF)
  if (s.intro) out.push(par(txt(s.intro, { tam: 9.8 }), { tam: 9.8, fator: 1.58, antes: 3.5, junto: true }));
  s.itens.forEach((b, i) => out.push(...blocoWord(b, s, m, cont, i === 0)));
  return out;
}

// ─── Assinaturas ──────────────────────────────────────────────────────────────────────────────
export function assinaturaWord(assinatura) {
  const campo = (rotulo) => ({
    altura: 9.2,
    celulas: [
      cel([par(txt(rotulo, { tam: 9, cor: COR.g2 }), { tam: 9 })], { vAlign: "base" }),
      cel([], {}),
      cel([par([], { tam: 4, fator: 1 })], { bordas: { base: borda(COR.g2, 0.3) }, vAlign: "base" }),
    ],
  });
  return [
    espaco(9),
    tabela({
      larguras: [81, 12, 81],
      linhas: [
        {
          celulas: [
            cel([
              par([marcador("assinaturas"), ...txt(assinatura.despedida, { negrito: true })]),
              par(txt(assinatura.empresa, { fonte: "mono", negrito: true, tam: 10, espaco: 0.01 }), {
                tam: 10,
                fator: 1.5,
                antes: 15,
                borda: { topo: { cor: COR.g, mm: 0.3, espaco: 2.4 } },
              }),
              par(txt(assinatura.nome), { fator: 1.5 }),
              par(txt(assinatura.registro), { fator: 1.5 }),
            ]),
            cel([]),
            cel([
              par(txt(assinatura.deAcordo, { negrito: true })),
              tabela({ larguras: [20, 2, 59], linhas: ["Data", ...assinatura.campos, "Assinatura"].map(campo) }),
              new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: "exact" } }),
            ]),
          ],
        },
      ],
    }),
  ];
}
