/**
 * Anexo de obras no Word (src/anexo.mjs no PDF): abertura em página grafite e uma página por obra.
 * Posições e tamanhos vêm das medidas do HTML; as fotos são as do PDF, já recortadas.
 */
import { AlignmentType, Paragraph, TextRun } from "docx";
import { COR, MONO, UTIL, borda, cel, espaco, imagem, linhasTxt, par, pt, tabela, txt } from "./base.mjs";
import { empilhar, linhaExata } from "./frente.mjs";
import { faixa } from "./moldura.mjs";

const papel = COR.papel;
const parVazio = () => new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: "exact" } });
const fotoPar = (f, nome) => new Paragraph({ children: [imagem(f.jpg, { larg: f.w, alt: f.h, nome })], spacing: { before: 0, after: 0 } });

/** Placeholder (campo sem dado): laranja-queimado sobre laranja-claro, como no PDF. */
const ph = (t, tam) =>
  new TextRun({ text: t, font: MONO, size: pt(tam), bold: true, color: COR.oi, shading: { type: "clear", color: "auto", fill: COR.ow }, underline: { type: "single", color: COR.oi } });

// ─── Abertura (x.1) ───────────────────────────────────────────────────────────────────────────
export function aberturaWord(pacote, m) {
  const { proposta, anexo } = pacote;
  const a = m.abertura;
  const fundo = new Paragraph({
    children: [imagem(a.fundo, { larg: 210, alt: 297, nome: "Fundo da abertura do anexo", flutuante: true })],
    spacing: { before: 0, after: 0, line: 20, lineRule: "exact" },
  });
  const logo = a.topo; // .capa-topo (logo + código)
  const topo = linhaExata(logo.h, [110, UTIL - 110], [
    cel([new Paragraph({ children: [imagem(m.logoInvertido, { larg: m.capa.logo.w, alt: m.capa.logo.h, nome: "Geoforte Fundações" })] })]),
    cel([
      par(txt(proposta.codigo, { fonte: "mono", negrito: true, tam: 10, espaco: 0.12, cor: papel }), { tam: 10, fator: 1.45, alinhar: AlignmentType.RIGHT }),
      par(txt(`Anexo ${anexo.letra}`, { fonte: "mono", tam: 10, espaco: 0.06, cor: COR.g4 }), { tam: 10, fator: 1.45, alinhar: AlignmentType.RIGHT }),
    ]),
  ]);
  const cab = linhaExata(a.cab.h, [UTIL], [
    cel([
      par([...txt(`${anexo.letra} `, { fonte: "mono", negrito: true, tam: 46, cor: COR.o, espaco: -0.035 }), ...txt(anexo.abertura.titulo, { fonte: "mono", negrito: true, tam: 46, cor: papel, espaco: -0.035 })], {
        tam: 46,
        fator: 0.98,
        exata: true,
      }),
      par(linhasTxt(a.linhasSub ?? [anexo.abertura.subtitulo], { fonte: "mono", tam: 15, cor: COR.cinzaClaro }), { tam: 15, fator: 1.25, antes: 4 }),
      espaco(8),
      faixa(0.7, [
        { mm: 24, cor: COR.o },
        { mm: UTIL - 24, cor: COR.fioCapa18 },
      ]),
      par(txt(anexo.abertura.texto, { tam: 10.6, cor: COR.cinzaCapa }), { tam: 10.6, fator: 1.6, antes: 6, recuo: { dir: UTIL - 152 } }),
    ]),
  ]);

  // grade 2 × 2: foto + legenda (número, nome, crédito, página)
  const [f0, f1, f2, f3] = a.fotos;
  const t0 = a.textos[0];
  const wCard = f0.w;
  const gapX = f1.x - (f0.x + f0.w);
  const gapY = f2.y - (t0.y + t0.h);
  const gapT = t0.y - (f0.y + f0.h); // respiro entre a foto e o fio da legenda
  const primeira = anexo.tipo === "fundacao" ? 2 : 3;
  const quem = (o) => (anexo.tipo === "fundacao" ? `${o.papel}: ${o.parceiro}` : o.construtora);
  const legenda = (o, i) =>
    cel(
      [
        tabela({
          larguras: [9, 2, wCard - 9 - 2 - 12, 12],
          linhas: [
            {
              celulas: [
                cel([par(txt(o.numero, { fonte: "mono", negrito: true, tam: 13.5, cor: COR.o }), { tam: 13.5, fator: 1.1 })]),
                cel([]),
                cel([
                  par(txt(o.nome, { fonte: "mono", negrito: true, tam: 13.5, espaco: -0.015, cor: papel }), { tam: 13.5, fator: 1.1 }),
                  par(txt(quem(o), { tam: 9.4, cor: COR.cinzaCapa }), { tam: 9.4, antes: 1 }),
                ]),
                cel([par(txt(`${anexo.letra}.${i + primeira}`, { fonte: "mono", negrito: true, tam: 9, espaco: 0.08, cor: COR.o }), { tam: 9, alinhar: AlignmentType.RIGHT, antes: 1.2 })]),
              ],
            },
          ],
        }),
        parVazio(),
      ],
      { bordas: { topo: borda(COR.fioCapa85, 0.5) }, margem: { t: 2.6 } },
    );
  const obras = anexo.obras;
  const gradeLinhas = [
    { altura: f0.h, exata: true, celulas: [cel([fotoPar(f0, obras[0].nome)]), cel([]), cel([fotoPar(f1, obras[1].nome)])] },
    { altura: gapT, exata: true, celulas: [cel([parVazio()]), cel([]), cel([parVazio()])] },
    { altura: t0.h, exata: true, celulas: [legenda(obras[0], 0), cel([]), legenda(obras[1], 1)] },
    { altura: Math.max(0.5, gapY), exata: true, celulas: [cel([]), cel([]), cel([])] },
    { altura: f2.h, exata: true, celulas: [cel([fotoPar(f2, obras[2].nome)]), cel([]), cel([fotoPar(f3, obras[3].nome)])] },
    { altura: gapT, exata: true, celulas: [cel([parVazio()]), cel([]), cel([parVazio()])] },
    { altura: t0.h, exata: true, celulas: [legenda(obras[2], 2), cel([]), legenda(obras[3], 3)] },
  ];
  const grade = tabela({ larguras: [wCard, gapX, wCard], linhas: gradeLinhas });
  const pe = linhaExata(a.pe.h, [UTIL - 20, 20], [
    cel([par(txt(proposta.cabecalho.join(" · "), { fonte: "mono", tam: 9, espaco: 0.08, cor: COR.cinzaCapa }), { tam: 9 })], { bordas: { topo: borda(COR.fioCapa22, 0.3) }, margem: { t: 4 } }),
    cel([par(txt(`${anexo.letra}.1`, { fonte: "mono", negrito: true, tam: 10, cor: papel }), { tam: 10, alinhar: AlignmentType.RIGHT })], { bordas: { topo: borda(COR.fioCapa22, 0.3) }, margem: { t: 4 } }),
  ]);
  return [
    fundo,
    ...empilhar([
      { y: logo.y, h: logo.h, conteudo: topo },
      { y: a.cab.y, h: a.cab.h, conteudo: cab },
      { y: f0.y, h: f2.y + f2.h + gapT + t0.h - f0.y, conteudo: grade },
      { y: a.pe.y, h: a.pe.h, conteudo: pe },
    ]),
  ];
}

// ─── Páginas do anexo ─────────────────────────────────────────────────────────────────────────
/** Cabeçalho de obra: número + nome (24 pt), linha de crédito, fio laranja/cinza embaixo. */
function topoObra(numero, nome, linhas, h) {
  return tabela({
    larguras: [14, UTIL - 14],
    linhas: [
      {
        altura: h - 0.55,
        exata: true,
        celulas: [
          cel(
            [
              par([...txt(`${numero}  `, { fonte: "mono", negrito: true, tam: 24, cor: COR.o, espaco: -0.025 }), ...txt(nome, { fonte: "mono", negrito: true, tam: 24, espaco: -0.025 })], {
                tam: 24,
                fator: 1.05,
                exata: true,
              }),
              ...linhas.map((l) => par(l, { tam: 10, antes: 2 })),
            ],
            { cs: 2 },
          ),
        ],
      },
      { altura: 0.55, exata: true, celulas: [cel([parVazio()], { fundo: COR.o }), cel([parVazio()], { fundo: COR.fio })] },
    ],
  });
}

/** Mosaico de fotos: monta a grade a partir dos retângulos medidos no PDF. */
function mosaico(fotos, nomes) {
  const xs = [...new Set(fotos.flatMap((f) => [f.x, f.x + f.w]).map((v) => Math.round(v * 100) / 100))].sort((a, b) => a - b);
  const ys = [...new Set(fotos.flatMap((f) => [f.y, f.y + f.h]).map((v) => Math.round(v * 100) / 100))].sort((a, b) => a - b);
  const xi = (v) => xs.findIndex((x) => Math.abs(x - v) < 0.2);
  const yi = (v) => ys.findIndex((y) => Math.abs(y - v) < 0.2);
  const larguras = xs.slice(1).map((x, i) => x - xs[i]);
  const alturas = ys.slice(1).map((y, i) => y - ys[i]);
  const ocup = alturas.map(() => larguras.map(() => null));
  fotos.forEach((f, k) => {
    const c0 = xi(f.x), c1 = xi(f.x + f.w), r0 = yi(f.y), r1 = yi(f.y + f.h);
    for (let r = r0; r < r1; r++) for (let c = c0; c < c1; c++) ocup[r][c] = { k, r0, c0, cs: c1 - c0, rs: r1 - r0 };
  });
  const linhas = alturas.map((h, r) => {
    const celulas = [];
    for (let c = 0; c < larguras.length; c++) {
      const o = ocup[r][c];
      if (o && (o.r0 !== r || o.c0 !== c)) {
        if (o.c0 === c && o.r0 !== r) continue; // coberta por rowspan de cima
        continue;
      }
      if (o) {
        celulas.push(cel([fotoPar(fotos[o.k], nomes[o.k])], { cs: o.cs, rs: o.rs }));
        c += o.cs - 1;
      } else celulas.push(cel([parVazio()]));
    }
    return { altura: h, exata: true, celulas };
  });
  return tabela({ larguras, linhas });
}

function paginaFundacao(o, med) {
  const f = med.fotos[0];
  const topo = topoObra(o.numero, o.nome, [[...txt(`${o.papel}: `, { tam: 10, cor: COR.g2 }), ...txt(o.parceiro, { tam: 10, negrito: true, cor: COR.oi })]], med.topo.h);
  const leg = linhaExata(med.legenda.h, [UTIL], [cel([par(txt(o.foto.legenda, { tam: 9, cor: COR.g2 }), { tam: 9, fator: 1.35 })], { bordas: { topo: borda(COR.g, 0.5) }, margem: { t: 2.2 } })]);
  const blocos = [
    { y: med.topo.y, h: med.topo.h, conteudo: topo },
    { y: f.y, h: f.h, conteudo: linhaExata(f.h, [UTIL], [cel([fotoPar(f, o.foto.legenda)])]) },
    { y: med.legenda.y, h: med.legenda.h, conteudo: leg },
  ];
  if (o.ficha && med.fatos) {
    const w = UTIL / o.ficha.length;
    blocos.push({
      y: med.fatos.y,
      h: med.fatos.h,
      conteudo: linhaExata(
        med.fatos.h,
        o.ficha.map(() => w),
        o.ficha.map(([k, v], i) =>
          cel(
            [par(txt(k, { tam: 9, cor: COR.g2 }), { tam: 9, fator: 1.25 }), par(txt(v, { fonte: "mono", negrito: true, tam: 12.5 }), { tam: 12.5, fator: 1.2, antes: 1.6 })],
            { bordas: { topo: borda(i === 0 ? COR.o : COR.g, 0.7), base: borda(COR.fio, 0.25), esq: i ? borda(COR.fio, 0.25) : undefined }, margem: { t: 3.6, b: 3.4, e: i ? 3.6 : 0, d: 2.5 } },
          ),
        ),
      ),
    });
  }
  return empilhar(blocos);
}

// contenção: comparativo e obras
function etapasCelulas(o, etapas) {
  const w = (UTIL - 6) / 4;
  return tabela({
    larguras: [w, 2, w, 2, w, 2, w],
    linhas: [
      {
        celulas: etapas.flatMap((e, i) => {
          const n = o.fotos.filter((f) => f.etapa === e.id).length;
          const c = cel(
            [
              par([new TextRun({ text: n ? "■" : "□", font: "Arial", size: pt(11), color: n ? COR.o : COR.g4 }), ...txt("  "), ...txt(e.nome, { tam: 8.6, cor: n ? COR.g : COR.g3 })], { tam: 8.6, fator: 1.25 }),
              par(txt(n ? `${n} ${n > 1 ? "fotos" : "foto"}` : "sem foto", { tam: 8, negrito: Boolean(n), cor: n ? COR.oi : COR.g3 }), { tam: 8, fator: 1.25, recuo: { esq: 5.4 } }),
            ],
            { bordas: { topo: borda(n ? COR.g : COR.fio2, 0.3) }, margem: { t: 1.6, b: 1.6 } },
          );
          return i ? [cel([]), c] : [c];
        }),
      },
    ],
  });
}

function paginaContencao(o, med, pacote) {
  const { placeholders, etapas } = pacote.anexo;
  const v = (val, p) => (val == null || val === "" ? [ph(p, 9.6)] : txt(val, { fonte: "mono", negrito: true, tam: 12.5 }));
  const linha = [
    ...(o.bairro ? txt(o.bairro, { tam: 10, cor: COR.g2 }) : [ph(placeholders.bairro, 10)]),
    ...txt(", Salvador – BA · ", { tam: 10, cor: COR.g2 }),
    ...(o.ano ? txt(o.ano, { tam: 10, cor: COR.g2 }) : [ph(placeholders.ano, 10)]),
    ...txt(" · ", { tam: 10, cor: COR.g2 }),
    ...txt(o.construtora, { tam: 10, negrito: true, cor: COR.oi }),
  ];
  const linhas = [linha, ...(o.fotosConfirmar ? [[ph(placeholders.fotosConfirmar, 10)]] : [])];
  const topoY = med.topo.y + med.topo.h;
  const fotos = med.fotos;
  const yMos = Math.min(...fotos.map((f) => f.y));
  const fim = Math.max(...fotos.map((f) => f.y + f.h));
  const rel = fotos.map((f) => ({ ...f, y: f.y - yMos }));
  const legendaItens = o.pdf.flatMap((i, k) => [...txt(`${k + 1}`, { fonte: "mono", negrito: true, tam: 9, cor: COR.oi }), ...txt(` ${o.fotos[i].legenda}`, { tam: 9, cor: COR.g2 }), ...txt(k < o.pdf.length - 1 ? "      " : "", { tam: 9 })]);
  const f = o.ficha;
  const fato = (rot, filhos, i) =>
    cel([par(txt(rot, { tam: 9, cor: COR.g2 }), { tam: 9, fator: 1.25 }), par(filhos, { tam: 12.5, fator: 1.2, antes: 1.6 })], {
      bordas: { base: borda(COR.fio, 0.25), esq: i ? borda(COR.fio, 0.25) : undefined },
      margem: { t: 3.6, b: 3.4, e: i ? 3.6 : 0, d: 2.5 },
    });
  const wf = [1, 1, 1.2, 1.35].map((x) => (x * UTIL) / 4.55);
  const complemento = f.complemento.confirmar ? [ph(`${f.complemento.valor} [confirmar]`, 10)] : txt(f.complemento.valor, { fonte: "mono", negrito: true, tam: 10 });
  const wb = (UTIL - 6) / 2;
  const blocos = [
    { y: med.topo.y, h: med.topo.h, conteudo: topoObra(o.numero, o.nome, linhas, med.topo.h) },
    { y: topoY + 3, h: Math.max(4, yMos - topoY - 3 - 0.5), conteudo: linhaExata(Math.max(4, yMos - topoY - 3 - 0.5), [UTIL], [cel([par(txt(o.cenario, { tam: 10, cor: COR.g2 }), { tam: 10 })])]) },
    { y: yMos, h: fim - yMos, conteudo: mosaico(rel, o.pdf.map((i) => o.fotos[i].legenda)) },
    { y: med.legenda.y, h: med.legenda.h, conteudo: linhaExata(med.legenda.h, [UTIL], [cel([par(legendaItens, { tam: 9, fator: 1.35 })], { bordas: { topo: borda(COR.g, 0.5) }, margem: { t: 2.2 } })]) },
    { y: med.etapas.y, h: med.etapas.h, conteudo: etapasCelulas(o, etapas) },
    { y: med.fatos.y, h: 0.7, conteudo: faixa(0.7, [{ mm: 24, cor: COR.o }, { mm: UTIL - 24, cor: COR.g }]) },
    {
      y: med.fatos.y + 0.7,
      h: med.fatos.h - 0.7,
      conteudo: linhaExata(med.fatos.h - 0.7, wf, [
        fato("Área de contenção", v(f.areaContencao, placeholders.areaContencao), 0),
        fato("Altura de escavação", v(f.alturaEscavacao, placeholders.alturaEscavacao), 1),
        fato("Estacas", v(f.estacas, placeholders.estacas), 2),
        fato("Execução", v(f.execucao, placeholders.execucao), 3),
      ]),
    },
    {
      y: med.base.y,
      h: med.base.h,
      conteudo: linhaExata(med.base.h, [wb, 6, wb], [
        cel([
          par(txt("Solução", { tam: 9, cor: COR.g2 }), { tam: 9, fator: 1.3 }),
          par(txt(f.solucao, { fonte: "mono", negrito: true, tam: 15, espaco: -0.015 }), { tam: 15, fator: 1.15, antes: 1.8 }),
          par(txt("Complemento", { tam: 9, cor: COR.g2 }), { tam: 9, fator: 1.3, antes: 2.6, borda: { topo: { cor: COR.fio, mm: 0.25, espaco: 2.2 } } }),
          par(complemento, { tam: 10, fator: 1.35, antes: 0.6 }),
        ]),
        cel([]),
        cel(
          [
            par(txt("Destaque da obra", { tam: 9, cor: COR.g2 }), { tam: 9, fator: 1.3 }),
            par(o.destaque ? txt(o.destaque, { tam: 10.6 }) : [ph(placeholders.destaque, 10.6)], { tam: 10.6, fator: 1.5, antes: 2 }),
          ],
          { fundo: COR.painel, margem: { t: 4.4, b: 4.8, e: 5, d: 5 } },
        ),
      ]),
    },
  ];
  return empilhar(blocos);
}

function paginaComparativo(pacote, med, m) {
  const { anexo, secoes, numerosGeoforte, proposta } = pacote;
  const { obras, etapas, grandPalladium } = anexo;
  const totalGP = secoes.flatMap((x) => x.itens).find((b) => b.tipo === "total");
  const contGP = secoes.flatMap((x) => x.itens).find((b) => b.tipo === "contencoes");
  const cols = m.cmpCols?.length === 5 ? m.cmpCols : [44, 34, 34, 34, 28];
  const caixas = (o) => etapas.map((e) => new TextRun({ text: o.fotos.some((f) => f.etapa === e.id) ? "■" : "□", font: "Arial", size: pt(10), color: o.fotos.some((f) => f.etapa === e.id) ? COR.o : COR.g4 }));
  const c = (filhos, o = {}) => cel(filhos, { bordas: { base: o.base ?? borda(COR.fio, 0.25), topo: o.topo }, margem: { t: 2.2, b: 2.2, e: 2.4, d: 2.4 }, fundo: o.fundo });
  const t = (x, o = {}) => par(txt(x, { tam: 8.8, ...o }), { tam: 8.8, fator: 1.35 });
  const linhaObra = (o) => ({
    celulas: [
      c([
        par([...txt(`${o.numero} `, { fonte: "mono", negrito: true, tam: 14, cor: COR.o }), ...txt(o.nome, { fonte: "mono", negrito: true, tam: 10, espaco: -0.01 })], { tam: 10, fator: 1.35 }),
        par(txt(o.construtora, { tam: 8, cor: COR.g3 }), { tam: 8, antes: 0.6 }),
      ]),
      c([t(o.cenario)]),
      c([t(o.ficha.solucao)]),
      c([par([...txt(o.ficha.complemento.valor, { tam: 8.8 }), ...(o.ficha.complemento.confirmar ? [new TextRun({ text: " " }), ph("[confirmar]", 8.8)] : [])], { tam: 8.8, fator: 1.35 })]),
      c([par(caixas(o), {}), par(txt(`${o.fotos.length} fotos`, { tam: 8, cor: COR.g3 }), { tam: 8, antes: 0.6 })]),
    ],
  });
  const gp = borda(COR.g, 0.5);
  const tabelaCmp = tabela({
    larguras: cols,
    linhas: [
      {
        cabecalho: true,
        celulas: ["Obra", "Cenário", "Solução", "Complemento", "Etapas com foto"].map((h) =>
          cel([par(txt(h, { fonte: "mono", negrito: true, tam: 8, cor: COR.branco }), { tam: 8 })], { fundo: COR.g, margem: { t: 1.8, b: 1.8, e: 2.4, d: 2.4 } }),
        ),
      },
      ...obras.map(linhaObra),
      {
        celulas: [
          c([par(txt(grandPalladium.nome, { fonte: "mono", negrito: true, tam: 10 }), { tam: 10 }), par(txt(`${contGP.linhas.length} contenções · ${totalGP.valor}`, { tam: 8, cor: COR.g3 }), { tam: 8, antes: 0.6 })], { fundo: COR.painel, topo: gp, base: null }),
          c([t(grandPalladium.cenario)], { fundo: COR.painel, topo: gp, base: null }),
          c([t(grandPalladium.solucao)], { fundo: COR.painel, topo: gp, base: null }),
          c([t(grandPalladium.complemento)], { fundo: COR.painel, topo: gp, base: null }),
          c([par(txt(`proposta ${proposta.codigo}`, { tam: 8, cor: COR.g3 }), { tam: 8 })], { fundo: COR.painel, topo: gp, base: null }),
        ],
      },
    ],
  });
  const mana = obras[0];
  const porEtapa = etapas.map((e) => ({ e, ft: mana.fotos.find((f) => f.etapa === e.id) })).filter((x) => x.ft);
  const fotos = med.fotos; // as 4 fotos de etapa
  const wF = fotos[0]?.w ?? (UTIL - 9) / 4;
  const gapF = fotos[1] ? fotos[1].x - (fotos[0].x + fotos[0].w) : 3;
  const fotosTab = tabela({
    larguras: porEtapa.flatMap((_, i) => (i ? [gapF, wF] : [wF])),
    linhas: [
      { altura: fotos[0]?.h ?? 40, exata: true, celulas: porEtapa.flatMap(({ ft }, i) => [...(i ? [cel([])] : []), cel([fotoPar(fotos[i], ft.legenda)])]) },
      {
        celulas: porEtapa.flatMap(({ e, ft }, i) => [
          ...(i ? [cel([])] : []),
          cel([par(txt(e.nome, { fonte: "mono", negrito: true, tam: 9 }), { tam: 9, fator: 1.3 }), par(txt(ft.legenda, { tam: 8.4, cor: COR.g2 }), { tam: 8.4, fator: 1.3 })], { bordas: { topo: borda(COR.g, 0.5) }, margem: { t: 1.6 } }),
        ]),
      },
    ],
  });
  const n = numerosGeoforte;
  const blocos = [
    {
      y: med.topo.y,
      h: med.topo.h,
      conteudo: topoObra(anexo.letra, "As obras e o Grand Palladium", [txt("O que cada obra tem em comum com a expansão do resort, e o que as fotos registram.", { tam: 10, cor: COR.g2 })], med.topo.h),
    },
    { y: med.tabela.y, h: med.tabela.h, conteudo: tabelaCmp },
    {
      y: med.tabela.y + med.tabela.h + 2,
      h: 5,
      conteudo: linhaExata(5, [UTIL], [
        cel([par([...caixas({ fotos: [{ etapa: etapas[0].id }, { etapa: etapas[1].id }] }), ...txt(`  Etapas, da esquerda para a direita: ${etapas.map((e) => e.nome.toLowerCase()).join(" · ")}. Caixa cheia = há foto da etapa.`, { tam: 8, cor: COR.g3 })], { tam: 8 })]),
      ]),
    },
    {
      y: med.cmpFotos.y - 9,
      h: 7,
      conteudo: linhaExata(7, [UTIL], [cel([par(txt(`Do furo à cortina pronta, em uma obra: ${mana.nome}`, { fonte: "mono", negrito: true, tam: 11.5, espaco: -0.01 }), { tam: 11.5 })])]),
    },
    { y: med.cmpFotos.y, h: med.cmpFotos.h, conteudo: fotosTab },
    {
      y: med.frase.y,
      h: med.frase.h,
      conteudo: linhaExata(med.frase.h, [UTIL], [
        cel(
          [
            par(
              txt(
                `A Geoforte executa fundações desde **${n[0].valor}**: ${n[1].valor} obras executadas, ${n[2].valor} de metros de estacas e ${n[3].valor} equipamentos próprios.`,
                { tam: 10, cor: COR.g2 },
              ),
              { tam: 10, fator: 1.5 },
            ),
          ],
          { bordas: { topo: borda(COR.fio2, 0.3) }, margem: { t: 3 } },
        ),
      ]),
    },
  ];
  return empilhar(blocos);
}

/** Páginas x.2 em diante: cada página começa numa página nova do Word. */
export function paginasAnexoWord(pacote, m) {
  const { anexo } = pacote;
  const out = [];
  const pags = m.anexo;
  let i = 0;
  const novaPagina = (conteudo, primeira) => {
    if (!primeira) out.push(new Paragraph({ children: [], pageBreakBefore: true, spacing: { before: 0, after: 0, line: 20, lineRule: "exact" } }));
    out.push(...conteudo);
  };
  if (anexo.tipo !== "fundacao") {
    novaPagina(paginaComparativo(pacote, pags[0], m), true);
    i = 1;
  }
  anexo.obras.forEach((o, k) => {
    const med = pags[i + k];
    const conteudo = anexo.tipo === "fundacao" ? paginaFundacao(o, med) : paginaContencao(o, med, pacote);
    novaPagina(conteudo, i + k === 0);
  });
  return out;
}

