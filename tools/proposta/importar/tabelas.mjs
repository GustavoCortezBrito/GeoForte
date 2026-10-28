/**
 * Refaz as tabelas do memorial da proposta de fundação (GEO 2993A/26) a partir das imagens EMF do
 * Word original. Lê o texto de cada EMF, agrupa em linhas e colunas e grava
 * dados/fundacao/tabelas.json — tudo o que o PDF mostra vem daí.
 *
 *   node importar/tabelas.mjs "<proposta>.docx"
 *
 * Conferências feitas no fim (somas e quantidades) são impressas: se algo não fecha, o aviso aparece
 * aqui e a diferença é um ponto de atenção da proposta, não um erro da leitura.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import { lerEmf, linhas, preenchimentoEm, hex } from "./emf.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const docx = process.argv[2];
if (!docx) throw new Error('Uso: node importar/tabelas.mjs "<proposta>.docx"');

const zip = await JSZip.loadAsync(readFileSync(docx));
const emf = async (n) => lerEmf(await zip.file(`word/media/image${n}.emf`).async("nodebuffer"));

const limpa = (s) => s.replace(/\s+/g, " ").trim();
/** "1.234,56" → 1234.56 */
const n = (s) => (s == null || s === "" || s === "-" ? null : Number(String(s).replace(/\./g, "").replace(",", ".")));

// ─── Tabelas de preço (Tabela 01, 02 e 03 da cláusula 5) ───────────────────────────────────────
const COL_PRECO = [
  ["item", 0, 60],
  ["desc", 60, 600],
  ["qtd", 600, 735],
  ["un", 735, 800],
  ["unit", 800, 935],
  ["total", 935, 2000],
];
const LARGOS = new Set(["#d9d9d9"]);

async function precos(numero) {
  const { textos, fills } = await emf(numero);
  const rows = [];
  for (const l of linhas(textos)) {
    if (l.y < 40) continue; // cabeçalho (ITEM / DESCRIÇÃO / ...)
    const cel = Object.fromEntries(COL_PRECO.map(([k]) => [k, []]));
    for (const t of l.t) {
      const col = COL_PRECO.find(([, a, b]) => t.x >= a && t.x < b);
      if (col) cel[col[0]].push(t.s);
    }
    const txt = (k) => limpa(cel[k].join(" "));
    const valor = (k) => {
      const m = txt(k).replace(/R\$/g, "").trim();
      return m || null;
    };
    const f = preenchimentoEm(fills, 70, l.y + 6);
    const cor = f ? hex(f.cor) : null;
    const r = { item: txt("item") || null, desc: txt("desc"), qtd: valor("qtd"), un: txt("un") || null, unit: valor("unit"), total: valor("total"), cor };
    if (!r.item && !r.desc) continue;
    rows.push(r);
  }
  // tipo da linha: título (sem valores), grupo (cinza, com subtotal), item, total final (colorido)
  return rows.map((r) => {
    let tipo = "item";
    if (!r.item) tipo = "total";
    else if (r.cor && LARGOS.has(r.cor)) tipo = "grupo";
    else if (!r.qtd && !r.unit && !r.total) tipo = "titulo";
    const { cor, ...resto } = r;
    return { tipo, ...resto, cor: tipo === "total" ? cor : undefined };
  });
}

// ─── Estaqueamento por módulo (Tabelas 6 a 9) ──────────────────────────────────────────────────
const COL_PILAR = [
  ["pilar", 0, 120],
  ["nSem", 120, 218],
  ["nCom", 218, 312],
  ["perm", 312, 405],
  ["vento", 405, 500],
  ["quant", 500, 600],
  ["diam", 600, 700],
  ["comp", 700, 790],
  ["cargaSem", 790, 905],
  ["cargaCom", 905, 2000],
];

async function estaqueamento(numeros) {
  const linhasOut = [];
  const avisos = [];
  for (const num of numeros) {
    const antes = linhasOut.length;
    const { textos, fills } = await emf(num);
    // rótulos de bloco (texto girado) e a faixa vertical que cada um ocupa (célula mesclada à esquerda)
    const rotulos = textos.filter((t) => t.x < 12 && /[A-Za-z]{4,}/.test(t.s));
    const faixas = fills.filter((f) => f.x <= 1 && f.w > 100 && f.h > 20).map((f) => ({ y0: f.y, y1: f.y + f.h, cor: hex(f.cor) }));
    const grupoEm = (y) => {
      const f = faixas.find((f) => y >= f.y0 && y < f.y1);
      if (!f) return { rotulo: null, cor: null };
      const r = rotulos.find((t) => t.y >= f.y0 && t.y <= f.y1);
      return { rotulo: r ? limpa(r.s) : null, cor: f.cor };
    };
    for (const l of linhas(textos.filter((t) => t.x >= 12))) {
      if (l.y < 70) continue; // cabeçalho de 4 linhas
      const cel = {};
      for (const t of l.t) {
        const col = COL_PILAR.find(([, a, b]) => t.x >= a && t.x < b);
        if (col) (cel[col[0]] ??= []).push(t);
      }
      if (!cel.pilar) continue;
      const g = (k) => limpa((cel[k] ?? []).map((t) => t.s).join(" ")) || null;
      linhasOut.push({
        ...grupoEm(l.y + 6),
        pilar: g("pilar"),
        nSem: g("nSem"),
        nCom: g("nCom"),
        perm: g("perm"),
        vento: g("vento"),
        quant: g("quant"),
        diam: g("diam"),
        comp: g("comp"),
        cargaSem: g("cargaSem"),
        cargaCom: g("cargaCom"),
        origem: num,
      });
    }
    // O Word às vezes cola duas imagens que se sobrepõem: as primeiras linhas desta repetem o fim da anterior.
    const nova = linhasOut.slice(antes);
    const anterior = linhasOut.slice(0, antes);
    const mesma = (a, b) => ["pilar", "nSem", "nCom", "perm", "vento", "quant", "diam", "comp", "cargaSem", "cargaCom"].every((k) => a[k] === b[k]);
    // maior k tal que as k primeiras de `nova` = as k últimas de `anterior`
    let melhor = 0;
    for (let c = Math.min(anterior.length, nova.length); c > 0; c--) {
      if (anterior.slice(-c).every((r, i) => mesma(r, nova[i]))) { melhor = c; break; }
    }
    if (melhor) {
      linhasOut.splice(antes, melhor);
      avisos.push(`imagem${num}: ${melhor} linhas repetidas do fim da imagem anterior (${nova[0].pilar} a ${nova[melhor - 1].pilar}) foram ignoradas`);
    }
  }
  if (avisos.length) console.log("  AVISO:", avisos.join("\n  AVISO: "));
  // grupos consecutivos (mesmo rótulo/cor) → { rotulo, linhas }
  const grupos = [];
  for (const r of linhasOut) {
    const { rotulo, cor, ...dados } = r;
    delete dados.origem;
    const chave = `${rotulo}|${cor}`;
    const ult = grupos[grupos.length - 1];
    if (ult && ult.chave === chave) ult.linhas.push(dados);
    else grupos.push({ chave, rotulo, cor, linhas: [dados] });
  }
  return grupos.map(({ rotulo, cor, linhas }) => ({ rotulo, cor, linhas }));
}

// ─── Quantitativos por módulo (Tabela 10) ─────────────────────────────────────────────────────
async function quantitativos(numero) {
  const { textos } = await emf(numero);
  const L = linhas(textos).filter((l) => l.y > 40);
  const modulos = [];
  const rotulos = textos.filter((t) => t.x < 140 && /^[A-ZÇÃ]/.test(t.s) && !/^\d/.test(t.s) && t.y > 40);
  const agregados = textos.filter((t) => t.x >= 500 && /(kg|m³)\s*$/.test(t.s));
  for (const l of L) {
    const v = l.t.filter((t) => t.x >= 140 && t.x < 500);
    if (v.length < 4) continue;
    modulos.push({ y: l.y, quant: limpa(v[0].s), diam: limpa(v[1].s), cor: hex(v[1].cor), compUnit: limpa(v[2].s), compTotal: limpa(v[3].s) });
  }
  return { linhas: modulos, rotulos: rotulos.map((t) => ({ y: t.y, s: limpa(t.s) })), agregados: agregados.map((t) => ({ x: t.x, y: t.y, s: limpa(t.s) })) };
}

// ─── Tabelas pequenas (1, 4 e 5): linhas simples ──────────────────────────────────────────────
async function simples(numero) {
  const { textos } = await emf(numero);
  return linhas(textos).map((l) => ({ y: l.y, t: l.t.map((t) => ({ x: t.x, s: t.s, cor: hex(t.cor) })) }));
}

// ─── Estruturas finais ────────────────────────────────────────────────────────────────────────
const phi = (t) => t.replace(/^φ\s*/, "Ø").replace(/(\d)cm/, "$1 cm");
const cel = (l, a, b) => limpa(l.t.filter((t) => t.x >= a && t.x < b).map((t) => t.s).join(" "));

const bruto = { sondagens: await simples(12), cargaAdmissivel: await simples(13), cargasTrabalho: await simples(14) };

const sondagens = {
  titulo: "Relatório TransGeo – Data: 26/05/26",
  colunas: ["Furo", "Prof. (m)", "Cota B.F.", "Impenetrável?", "Prof. N.A. (m)", "Cota Terrap.", "Corte (−) / Aterro (+)", "Comp. Útil (m)"],
  linhas: bruto.sondagens
    .filter((l) => l.y >= 70)
    .map((l) => [cel(l, 0, 90), cel(l, 90, 180), cel(l, 180, 270), cel(l, 270, 400), cel(l, 400, 540), cel(l, 540, 620), cel(l, 620, 710), cel(l, 710, 900)].map((v) => v.replace(/^-(?=\d)/, "−"))),
};

const COL_ADM = [150, 230, 330, 430, 530, 620, 720];
const cargaAdmissivel = {
  titulo: "Carga admissível das estacas hélice contínua (tf), método Décourt",
  comprimentos: ["L = 6,0 m", "L = 8,0 m", "L = 10,0 m"],
  diametros: ["Ø40 cm", "Ø30 cm"],
  linhas: bruto.cargaAdmissivel
    .filter((l) => l.y >= 70)
    .map((l) => {
      const v = COL_ADM.slice(0, 6).map((a, i) => cel(l, a, COL_ADM[i + 1]));
      const unico = cel(l, 200, 330).match(/L\s*=\s*(\d+)\s*m/);
      return { furo: cel(l, 0, 150), unico: unico ? `L = ${unico[1]} m` : null, valores: v };
    }),
};

const cargasTrabalho = {
  titulo: "Resumo das cargas de trabalho adotadas",
  linhas: bruto.cargasTrabalho
    .filter((l) => l.y >= 20)
    .map((l) => {
      const diam = phi(l.t.filter((t) => t.x < 140).map((t) => t.s).join(""));
      const pares = [];
      for (const k of [147, 301, 460]) pares.push({ comprimento: cel(l, k, k + 70).replace(/\s*->.*/, "").replace(/(\d)m/, "$1 m"), carga: cel(l, k + 70, k + 150) });
      return { diam, pares };
    }),
};

// Tabela 10: linhas por módulo (pelo centro vertical do rótulo) e os totais de aço, concreto e escavação
const q10 = await quantitativos(26);
const ordemMod = q10.rotulos.map((r) => ({ nome: { PISCINAS: "Piscinas", "RECEPÇÃO": "Recepção" }[r.s] ?? r.s, y: r.y })).sort((a, b) => a.y - b.y);
// As linhas de cada módulo são contíguas e o rótulo fica no centro da célula mesclada: escolhe-se o corte
// em grupos contíguos cujo centro (média de y) mais se aproxima do y de cada rótulo.
const particao = (() => {
  const linhasQ = [...q10.linhas].sort((a, b) => a.y - b.y);
  const alvos = ordemMod.map((m) => m.y); // já em ordem vertical
  const k = alvos.length;
  let melhor = null;
  const rec = (ini, g, cortes) => {
    if (g === k - 1) {
      const todos = [...cortes, linhasQ.length];
      let custo = 0;
      let a = 0;
      todos.forEach((b, i) => {
        const grupo = linhasQ.slice(a, b);
        if (!grupo.length) custo += 1e9;
        else custo += Math.abs(grupo.reduce((x, l) => x + l.y, 0) / grupo.length - alvos[i]);
        a = b;
      });
      if (!melhor || custo < melhor.custo) melhor = { custo, cortes: todos };
      return;
    }
    for (let c = ini + 1; c < linhasQ.length; c++) rec(c, g + 1, [...cortes, c]);
  };
  rec(0, 0, []);
  let a = 0;
  return melhor.cortes.map((b) => {
    const g = linhasQ.slice(a, b);
    a = b;
    return g;
  });
})();

const quantitativosFinal = {
  titulo: "Quantitativos das estacas por módulo",
  modulos: ordemMod.map((m, i) => {
    const ag = (x0, x1) => q10.agregados.find((a) => Math.abs(a.y - m.y) < 10 && a.x >= x0 && a.x < x1)?.s ?? null;
    return {
      nome: m.nome,
      linhas: particao[i].map(({ quant, diam, compUnit, compTotal }) => ({ quant, diam, compUnit, compTotal })),
      aco: ag(500, 640),
      concreto: ag(640, 800),
      escavacao: ag(800, 1000),
    };
  }),
};

const nomeMod = { piscinas: "Piscinas", recepcao: "Recepção", h01: "H01", h02: "H02", h03: "H03" };
const estaq = {
  piscinas: await estaqueamento([15]),
  recepcao: await estaqueamento([16, 17]),
  h01: await estaqueamento([18, 19, 20]),
  h02: await estaqueamento([21, 22, 23, 24]),
  h03: await estaqueamento([25]),
};
const saida = {
  precos: { tabela01: await precos(1), tabela02: await precos(2), tabela03: await precos(3) },
  sondagens,
  cargaAdmissivel,
  cargasTrabalho,
  estaqueamento: estaq,
  quantitativos: quantitativosFinal,
};
mkdirSync(join(raiz, "dados", "fundacao"), { recursive: true });
writeFileSync(join(raiz, "dados", "fundacao", "tabelas.json"), JSON.stringify(saida, null, 1));

// ─── Conferências (o que não fecha vira ponto de atenção da proposta) ──────────────────────────
const aviso = [];
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
for (const [chave, grupos] of Object.entries(estaq)) {
  const rows = grupos.flatMap((g) => g.linhas);
  const hcm = sum(rows.filter((r) => !/TP/.test(r.diam)).map((r) => n(r.quant)));
  const met = sum(rows.filter((r) => /TP/.test(r.diam)).map((r) => n(r.quant)));
  console.log(`estaqueamento ${nomeMod[chave].padEnd(8)} linhas ${String(rows.length).padStart(3)}  hélice ${hcm}  metálicas ${met}`);
  // por diâmetro e comprimento, contra a Tabela 10
  const q = quantitativosFinal.modulos.find((m) => m.nome === nomeMod[chave]);
  const chaves = (rs, f) => rs.reduce((a, r) => ((a[f(r)] = (a[f(r)] ?? 0) + n(r.quant)), a), {});
  const daTab = chaves(rows.filter((r) => !/TP/.test(r.diam)), (r) => `Ø${r.diam} ${r.comp}`);
  const da10 = chaves(q.linhas, (r) => `Ø${r.diam} ${r.compUnit}`);
  for (const k of new Set([...Object.keys(daTab), ...Object.keys(da10)]))
    if ((daTab[k] ?? 0) !== (da10[k] ?? 0)) aviso.push(`${nomeMod[chave]} ${k}: tabela do módulo ${daTab[k] ?? 0} × Tabela 10 ${da10[k] ?? 0}`);
}
// totais da Tabela 10 × texto 11.8 (746 de Ø300, 139 de Ø400, 885 no total)
const todas = quantitativosFinal.modulos.flatMap((m) => m.linhas);
console.log("Tabela 10: Ø30 =", sum(todas.filter((r) => r.diam === "30").map((r) => n(r.quant))), " Ø40 =", sum(todas.filter((r) => r.diam === "40").map((r) => n(r.quant))));
// somas das tabelas de preço
for (const [nome, rows] of Object.entries(saida.precos)) {
  for (const r of rows) {
    if (r.tipo === "item" && n(r.qtd) != null && n(r.unit) != null && n(r.total) != null) {
      const calc = n(r.qtd) * n(r.unit);
      if (Math.abs(calc - n(r.total)) > Math.max(1, n(r.total) * 0.001)) aviso.push(`${nome} ${r.item}: ${r.qtd} × ${r.unit} = ${calc.toFixed(2)} ≠ ${r.total}`);
    }
  }
}
// total final de cada tabela de preço × soma das linhas com valor próprio (itens e grupos sem filhos)
for (const [nome, rows] of Object.entries(saida.precos)) {
  const folhas = rows.filter((r) => (r.tipo === "item" || r.tipo === "grupo") && r.qtd && n(r.total) != null);
  const grupos = rows.filter((r) => r.tipo === "grupo" && !r.qtd);
  const final = rows.filter((r) => r.tipo === "total").pop();
  const soma = sum(folhas.map((r) => n(r.total)));
  console.log(`${nome}: soma das linhas ${soma.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} × total ${final.total} (${final.desc})`);
  if (Math.abs(soma - n(final.total)) > 1) aviso.push(`${nome}: soma das linhas ${soma.toFixed(2)} ≠ total ${final.total}`);
  // subtotal de cada grupo × soma dos seus itens
  for (const g of grupos) {
    const filhos = rows.filter((r) => r.tipo === "item" && r.item && r.item.startsWith(g.item + "."));
    if (!filhos.length) continue;
    const t = sum(filhos.filter((r) => n(r.total) != null).map((r) => n(r.total)));
    if (Math.abs(t - n(g.total)) > 1) aviso.push(`${nome} ${g.item} ${g.desc}: itens somam ${t.toFixed(2)} ≠ ${g.total}`);
  }
}
console.log(aviso.length ? "\nNÃO FECHAM:\n  " + aviso.join("\n  ") : "\nTudo fecha.");
console.log("preços:", Object.entries(saida.precos).map(([k, v]) => `${k}:${v.length} linhas`).join("  "));
