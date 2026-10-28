/**
 * Memorial de cálculo (11) da proposta de fundações: texto, equações (MathML, desenhadas pelo
 * próprio Chrome), figuras e as tabelas do estaqueamento, na identidade do restante do documento.
 * Os dados vêm de dados/fundacao/memorial.mjs; cada bloco tem um `tipo`.
 */
import { asset, esc, md, marca } from "./util.mjs";

/** Texto com **negrito**, quebras de linha e equações no meio da frase ({{n}} → eqs[n]). */
const txt = (s, eqs = []) =>
  md(s)
    .replace(/\n/g, "<br />")
    .replace(/\{\{(\d+)\}\}/g, (_, i) => `<span class="mf-ieq">${eqs[i]}</span>`);

/** “Tabela 3 – …” → rótulo em negrito mono + texto. */
const legenda = (leg) => {
  const i = leg.indexOf(" – ");
  return i < 0 ? esc(leg) : `<b>${esc(leg.slice(0, i))}</b> – ${esc(leg.slice(i + 3))}`;
};

/** Valor de tabela: “-” vira traço apagado. */
const valor = (v) => (v === "-" || v === "–" ? `<span class="nd">–</span>` : esc(v ?? ""));

/** Célula de tabela: texto, ou { t, cs, rs, c } (colspan, rowspan, classe). */
const celula = (c, tag = "td") => {
  const o = c !== null && typeof c === "object" ? c : { t: c };
  const at = `${o.cs ? ` colspan="${o.cs}"` : ""}${o.rs ? ` rowspan="${o.rs}"` : ""}${o.c ? ` class="${o.c}"` : ""}`;
  return `<${tag}${at}>${valor(o.t)}</${tag}>`;
};

const tabela = (b) => `
<figure class="mf-tab${b.classe ? ` ${b.classe}` : ""}">
  ${b.legenda ? `<figcaption>${legenda(b.legenda)}</figcaption>` : ""}
  <table class="t t-mf">
    <thead>${b.cabecalho.map((l) => `<tr>${l.map((c) => celula(c, "th")).join("")}</tr>`).join("")}</thead>
    <tbody>${b.linhas.map((l) => `<tr>${l.map((c) => celula(c)).join("")}</tr>`).join("")}</tbody>
  </table>
</figure>`;

/** Estaqueamento por módulo: uma linha por pilar, faixa por bloco, cabeçalho que se repete em cada página. */
const COLS = ["pilar", "nSem", "nCom", "perm", "vento", "quant", "diam", "comp", "cargaSem", "cargaCom"];
const estaqueamento = (b) => `
<figure class="mf-tab mf-est">
  <figcaption>${legenda(b.legenda)}</figcaption>
  <table class="t t-est2">
    <colgroup><col style="width:19mm" /><col style="width:17mm" /><col style="width:17mm" /><col style="width:17mm" /><col style="width:13mm" /><col style="width:13mm" /><col style="width:15mm" /><col style="width:14mm" /><col style="width:20mm" /><col style="width:20mm" /></colgroup>
    <thead>
      <tr><th rowspan="2" class="pil">Pilar</th><th colspan="2">N+5% (tf)</th><th rowspan="2">Perm. + Acid. (tf)</th><th rowspan="2">Vento Fz (tf)</th><th rowspan="2">Quant.</th><th rowspan="2">Diâmetro (cm)</th><th rowspan="2">L escav. (m)</th><th colspan="2">Carga por estaca (tf)</th></tr>
      <tr><th>s/ vento Fz</th><th>c/ vento Fz</th><th>sem vento Fz</th><th>com vento Fz</th></tr>
    </thead>
    <tbody>${b.grupos
      .map(
        (g) =>
          `${g.rotulo ? `<tr class="grp"><td colspan="10">${esc(g.rotulo)}</td></tr>` : ""}${g.linhas
            .map(
              (l) =>
                `<tr>${COLS.map((c, i) => `<td class="${i === 0 ? "pil" : i >= 8 ? "cg" : i >= 5 && i <= 7 ? "ct" : ""}">${valor(l[c])}</td>`).join("")}</tr>`,
            )
            .join("")}`,
      )
      .join("")}</tbody>
  </table>
</figure>`;

const figura = (b) => `
<figure class="mf-fig${b.pagina ? " mf-fig-pag" : ""}"${b.largura ? ` style="--w:${b.largura}"` : ""}>
  ${b.titulo ? `<p class="mf-fig-t">${txt(b.titulo)}</p>` : ""}
  <img src="${asset(b.arquivo)}" alt="${esc(b.alt ?? b.legenda ?? "")}" />
  ${b.legenda ? `<figcaption>${legenda(b.legenda)}</figcaption>` : ""}
</figure>`;

/** “Onde:” — símbolo (equação) à esquerda, definição à direita. */
const onde = (b) => `
<dl class="mf-onde"><dt class="mf-onde-t">Onde:</dt>${b.itens.map(([m, t]) => `<div><dt>${m}</dt><dd>${esc(t)}</dd></div>`).join("")}</dl>`;

/** Conta com os valores da estaca: parâmetros em grade e o resultado em destaque (faixa grafite). */
const calculo = (b) => `
<div class="mf-calc">
  <p class="mf-calc-t">${esc(b.titulo)}</p>
  <div class="mf-calc-eqs">${b.eqs
    .map((m, i) => `<span>${m}${b.nota && i === b.notaApos ? `<small>(${esc(b.nota)})</small>` : ""}</span>`)
    .join("")}</div>
  <div class="mf-calc-res">${b.resultado}</div>
</div>`;

const bloco = (b) => {
  switch (b.tipo) {
    case "lista":
      return `<ul class="lista mf-lista">${b.itens.map((t) => `<li>${txt(t)}</li>`).join("")}</ul>`;
    case "p":
      return `<p class="mf-p">${txt(b.t, b.eqs)}</p>`;
    case "sub":
      return `<h4 class="m-h${b.quebra ? " mf-quebra" : ""}">${txt(b.t)}</h4>`;
    case "obs":
      return `<p class="mf-obs"><b>${esc(b.rotulo ?? "Obs.:")}</b> ${txt(b.t)}</p>`;
    case "figura":
      return figura(b);
    case "equacao":
      return `<div class="mf-eq">${b.mathml}</div>`;
    case "onde":
      return onde(b);
    case "calculo":
      return calculo(b);
    case "tabela":
      return tabela(b);
    case "estaqueamento":
      return estaqueamento(b);
    default:
      throw new Error(`Memorial: bloco "${b.tipo}" desconhecido.`);
  }
};

const secao = (s, marcas) => `
<section class="mf${s.quebra ? " mf-quebra" : ""}">
  <h3 class="mf-h">${marca(`s${s.n}`, marcas)}<span>${esc(s.n)}</span>${esc(s.titulo)}</h3>
  ${s.blocos.map(bloco).join("\n")}
</section>`;

export const htmlMemorial = (memorial, marcas) => `
<section class="sec memorial">
  <h2 class="sec-h">${marca(`s${memorial.n}`, marcas)}<span class="sec-n">${esc(memorial.n)}</span>${esc(memorial.titulo)}</h2>
  ${memorial.secoes.map((s) => secao(s, marcas)).join("")}
  <div class="mf-fecho">
    <p>${esc(memorial.fecho.local)}</p>
    <ul>${memorial.fecho.nomes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
  </div>
</section>`;

/** Entradas do sumário (nível 2): uma por seção do memorial. */
export const entradasMemorial = (memorial) =>
  memorial.secoes.map((s) => ({ id: `s${s.n}`, n: s.n, titulo: s.titulo, nivel: 2 }));
