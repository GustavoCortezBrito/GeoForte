/**
 * Capa (página grafite) e sumário no Word. A capa usa o fundo rasterizado do PDF (grafite, malha e
 * símbolo) atrás do texto, e cada bloco fica na mesma altura da capa do PDF: a posição de cada um
 * vem das medidas do HTML (medidas.mjs) e entra como espaçador + linha de tabela de altura exata.
 */
import { AlignmentType, Paragraph, TabStopType } from "docx";
import { COR, UTIL, borda, cel, espaco, imagem, linhasTxt, paginaDe, par, tabela, txt } from "./base.mjs";
import { faixa } from "./moldura.mjs";

/**
 * Empilha blocos em posições absolutas (mm a partir do topo da área de texto). Entre dois blocos vai
 * sempre um parágrafo espaçador (o Word junta tabelas encostadas), com a altura descontada da
 * distância medida no PDF. inicio = altura já ocupada no topo (ex.: o parágrafo da quebra de página).
 */
const MIN = 0.36; // menor parágrafo possível: 1 pt
export function empilhar(blocos, { inicio = 0 } = {}) {
  const out = [];
  let y = inicio;
  for (const b of blocos) {
    const gap = b.y - y;
    if (out.length || gap > 0.05) {
      out.push(espaco(Math.max(gap, MIN)));
      y += Math.max(gap, MIN);
    }
    out.push(b.conteudo);
    y += b.h;
  }
  return out;
}

/** Bloco de uma linha só, altura exata (o texto não empurra o que vem depois). */
export const linhaExata = (h, larguras, celulas) => tabela({ larguras, linhas: [{ altura: h, exata: true, celulas }] });

export function capaWord(pacote, m) {
  const { proposta, capa } = pacote;
  const c = m.capa;
  const papel = COR.papel;
  const t = (texto, o) => txt(texto, { cor: papel, ...o });

  const fundo = new Paragraph({
    children: [imagem(c.fundo, { larg: 210, alt: 297, nome: "Fundo da capa", flutuante: true })],
    spacing: { before: 0, after: 0, line: 20, lineRule: "exact" },
  });

  const topo = linhaExata(Math.max(c.logo.h, c.cod.h), [110, UTIL - 110], [
    cel([new Paragraph({ children: [imagem(m.logoInvertido, { larg: c.logo.w, alt: c.logo.h, nome: "Geoforte Fundações" })] })]),
    cel([
      par(t(proposta.codigo, { fonte: "mono", negrito: true, tam: 10, espaco: 0.12 }), { tam: 10, fator: 1.45, alinhar: AlignmentType.RIGHT }),
      par(txt(capa.data, { fonte: "mono", tam: 10, espaco: 0.06, cor: COR.g4 }), { tam: 10, fator: 1.45, alinhar: AlignmentType.RIGHT }),
    ]),
  ]);

  const fatoCel = (f, i) =>
    cel(
      [
        par(t(f.valor, { fonte: "mono", negrito: true, tam: 21, espaco: -0.02 }), { tam: 21, fator: 1, exata: true }),
        par(txt(f.rotulo, { tam: 8.6, cor: COR.cinzaCapa }), { tam: 8.6, fator: 1.35, antes: 2.2 }),
      ],
      {
        bordas: { topo: borda(COR.fioCapa22, 0.3), esq: i ? borda(COR.fioCapa16, 0.3) : undefined },
        margem: { t: 5, e: i ? 4.5 : 0, d: 4 },
      },
    );

  const pe = [
    ["Para", [`**${proposta.cliente}**`, `At.: ${proposta.atencao}`]],
    ["Emissão", [`**${proposta.cidadeData.replace(/\.$/, "")}**`]],
    ["Validade", [`**${proposta.validade}**`]],
  ];
  const peCel = ([rot, linhas], i) =>
    cel(
      [
        par(txt(rot, { fonte: "mono", negrito: true, tam: 8, espaco: 0.14, caixaAlta: true, cor: COR.o }), { tam: 8, fator: 1.45, depois: 1.2 }),
        ...linhas.map((l) => par(txt(l, { tam: 9, cor: COR.cinzaCapa, corForte: papel }), { tam: 9, fator: 1.45 })),
      ],
      { bordas: { topo: borda(COR.fioCapa22, 0.3) }, margem: { t: 5, d: i < 2 ? 6 : 0 } },
    );
  const peCelulas = pe.map(peCel);

  const blocos = [
    { y: c.cod.y, h: Math.max(c.logo.h, c.cod.h), conteudo: topo },
    {
      y: c.tipo.y,
      h: c.tipo.h,
      conteudo: linhaExata(c.tipo.h, [UTIL], [cel([par(txt("Proposta técnica e comercial", { fonte: "mono", negrito: true, tam: 10.5, espaco: 0.16, caixaAlta: true, cor: COR.o }), { tam: 10.5, fator: 1.52 })])]),
    },
    {
      y: c.titulo.y,
      h: c.titulo.h,
      conteudo: linhaExata(c.titulo.h, [UTIL], [cel([par(linhasTxt(c.linhasTitulo ?? [capa.titulo], { fonte: "mono", negrito: true, tam: 44, espaco: -0.035, cor: papel }), { tam: 44, fator: 0.98, exata: true })])]),
    },
    {
      y: c.sub.y,
      h: c.sub.h,
      conteudo: linhaExata(c.sub.h, [UTIL], [cel([par(linhasTxt(c.linhasSub ?? [capa.subtitulo], { fonte: "medio", tam: 16, cor: COR.cinzaClaro }), { tam: 16, fator: 1.25 })])]),
    },
    {
      y: c.fio.y,
      h: c.fio.h,
      conteudo: faixa(c.fio.h, [
        { mm: 24, cor: COR.o },
        { mm: UTIL - 24, cor: COR.fioCapa18 },
      ]),
    },
    {
      y: c.obra.y,
      h: c.obra.h,
      conteudo: linhaExata(c.obra.h, [UTIL], [
        cel([
          par(t(proposta.obra, { fonte: "mono", negrito: true, tam: 15, espaco: -0.01 }), { tam: 15, fator: 1.52 }),
          par(txt(proposta.localObra, { tam: 10.5, cor: COR.cinzaCapa }), { tam: 10.5, fator: 1.52, antes: 1.5 }),
        ]),
      ]),
    },
    {
      y: c.fatos.y,
      h: c.fatos.h,
      conteudo: linhaExata(c.fatos.h, Array(4).fill(UTIL / 4), capa.fatos.map(fatoCel)),
    },
    {
      y: c.pe.y,
      h: c.pe.h,
      conteudo: linhaExata(c.pe.h, [72.39, 59.11, 42.5], peCelulas),
    },
  ];
  return [fundo, ...empilhar(blocos)];
}

// ─── Sumário ──────────────────────────────────────────────────────────────────────────────────
/**
 * @param entradas  [{ id, n, titulo, nivel, grupo, pagina }]
 * @param paginas   id → Pág. n (do PDF); vira campo PAGEREF com esse valor guardado
 */
export function sumarioWord(pacote, entradas, paginas) {
  const denso = entradas.length > 22;
  const L = [11, 4, 11, 4, UTIL - 42, 12];
  const linhaSum = (e, i) => {
    const n2 = e.nivel === 2;
    const tamT = n2 ? (denso ? 9.4 : 10) : denso ? 10.4 : 11;
    const tamN = denso ? 9.6 : 10;
    const pad = n2 ? (denso ? 0.5 : 1.25) : denso ? 1.05 : 2.05;
    const numero = par(txt(e.n, { fonte: "mono", negrito: !n2, tam: tamN, cor: n2 ? COR.g3 : COR.o }), { tam: tamN, fator: 1.52 });
    // o título leva um tab com pontilhado até a coluna da página
    const tituloComGuia = par([...txt(e.titulo, { fonte: "medio", tam: tamT, cor: n2 ? COR.g2 : COR.g }), ...txt("\t", { tam: tamT, cor: COR.fio2 })], {
      tam: tamT,
      fator: 1.52,
      tabs: [{ tipo: TabStopType.RIGHT, mm: (n2 ? L[4] : L[2] + L[3] + L[4]) - 2, guia: "dot" }],
    });
    const pagina = e.pagina
      ? par(txt(e.pagina, { fonte: "mono", negrito: !n2, tam: tamN, cor: n2 ? COR.g2 : COR.g }), { tam: tamN, alinhar: AlignmentType.RIGHT })
      : par([paginaDe(e.id, paginas[e.id] ?? "—", { tam: tamN, negrito: !n2, cor: n2 ? COR.g2 : COR.g })], { tam: tamN, alinhar: AlignmentType.RIGHT });
    const base = borda(COR.fio, 0.25);
    const topo = e.grupo ? borda(COR.g, 0.6) : i === 0 ? borda(COR.g, 0.6) : undefined;
    const m = { t: pad, b: pad };
    const celulas = n2
      ? [
          cel([], { cs: 2, bordas: { base, topo }, margem: m }),
          cel([numero], { cs: 2, bordas: { base, topo }, margem: m }),
          cel([tituloComGuia], { bordas: { base, topo }, margem: m }),
          cel([pagina], { bordas: { base, topo }, margem: m }),
        ]
      : [
          cel([numero], { cs: 2, bordas: { base, topo }, margem: m }),
          cel([tituloComGuia], { cs: 3, bordas: { base, topo }, margem: m }),
          cel([pagina], { bordas: { base, topo }, margem: m }),
        ];
    return [
      ...(e.grupo ? [{ altura: denso ? 2.6 : 4, exata: true, celulas: [cel([], { cs: 6 })] }] : []),
      { celulas },
    ];
  };
  return [
    par(txt("Sumário", { fonte: "mono", negrito: true, tam: 30, espaco: -0.03 }), { tam: 30, fator: 1 }),
    par(txt(pacote.sumario.lead, { tam: 10.5, cor: COR.g2 }), { tam: 10.5, fator: 1.52, antes: denso ? 3 : 4, recuo: { dir: UTIL - (denso ? 158 : 130) } }),
    espaco(denso ? 5 : 9),
    tabela({ larguras: L, linhas: entradas.flatMap(linhaSum) }),
  ];
}

