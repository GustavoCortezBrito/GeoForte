/**
 * Corpo da proposta: carta, cláusulas 1 a 10, assinaturas e memorial (11).
 * Flui em páginas A4 com o cabeçalho e o rodapé da moldura. O memorial de cada proposta tem o
 * seu módulo (memorial-contencao.mjs, memorial-fundacao.mjs).
 */
import { proposta, config, carta, secoes, assinatura, memorial } from "./pacote.mjs";
import { esc, md, marca } from "./util.mjs";
import { estiloCorpo } from "./estilos.mjs";

const { htmlMemorial } = await import(`./memorial-${memorial.tipo}.mjs`);

const rev = (item) => (config.marcarRevisoes && item.rev ? " rev" : "");

// ─── Cláusulas ──────────────────────────────────────────────────────────────
const clausula = (c, compacto) => {
  const sub = c.sub
    ? `<dl class="sub">${c.sub.map((s) => `<dt>${esc(s.n)}</dt><dd>${md(s.t)}</dd>`).join("")}</dl>`
    : "";
  const insumos = c.insumos
    ? `<table class="insumos"><tbody>${c.insumos.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody></table>`
    : "";
  const lista = c.lista
    ? `${c.complemento ? `<p class="complemento">${md(c.complemento)}</p>` : ""}<ul class="lista">${c.lista.map((l) => `<li>${md(l)}</li>`).join("")}</ul>`
    : "";
  return `<div class="cl${compacto ? " cl-c" : ""}${rev(c)}"><span class="cl-n">${esc(c.n)}</span><div class="cl-t"><p>${md(c.t)}</p>${sub}${insumos}${lista}</div></div>`;
};

/** Valor da planilha: "-" vira traço apagado; vazio fica vazio. */
const nd = (v) => (v == null || v === "" ? "" : v === "-" ? `<span class="nd">–</span>` : esc(v));

/** Planilha de preços (Tabelas 01 a 03 da fundação): títulos, subtotais por grupo, itens e total. */
const planilha = (b) => {
  const linha = (l) => {
    if (l.tipo === "titulo") return `<tr class="p-n0"><td class="p-n">${esc(l.item)}</td><td colspan="5">${esc(l.desc)}</td></tr>`;
    if (l.tipo === "total") return `<tr class="p-total"><td colspan="5">${esc(l.desc)}</td><td class="r">${nd(l.total)}</td></tr>`;
    // quantidade escrita por extenso (ex.: "15 und/mês") ocupa também a coluna da unidade
    const porExtenso = l.un == null && l.qtd != null && /[a-zà-ú]/i.test(l.qtd);
    const qtdUn = porExtenso ? `<td colspan="2" class="r">${esc(l.qtd)}</td>` : `<td class="r">${nd(l.qtd)}</td><td>${nd(l.un)}</td>`;
    // “2 ADMINISTRAÇÃO” (nível 0) pesa mais que “1.1 Execução…” (nível 1); os itens vêm sem fundo
    const nivel = l.tipo === "item" ? "p-item" : l.item.includes(".") ? "p-n1" : "p-n0";
    return `<tr class="${nivel}"><td class="p-n">${esc(l.item)}</td><td>${esc(l.desc)}</td>${qtdUn}<td class="r">${nd(l.unit)}</td><td class="r p-v">${nd(l.total)}</td></tr>`;
  };
  return `<figure class="planilha">
  <figcaption>${esc(b.legenda)}</figcaption>
  <table class="t t-plan">
    <colgroup><col style="width:12mm" /><col /><col style="width:17mm" /><col style="width:10mm" /><col style="width:25mm" /><col style="width:27mm" /></colgroup>
    <thead><tr><th>Item</th><th>Descrição</th><th class="r">Quant.</th><th>Un.</th><th class="r">Preço unit. (R$)</th><th class="r">Total (R$)</th></tr></thead>
    <tbody>${b.linhas.map(linha).join("")}</tbody>
  </table>
</figure>`;
};

const bloco = (b, secao) => {
  switch (b.tipo) {
    case "contencoes":
      return `<div class="bloco-tab"><p class="t-cap">${esc(b.titulo)}</p><table class="t t-cont">
  <thead><tr><th>Item</th><th>Contenção</th><th>Solução</th><th class="r">Área (m²)</th></tr></thead>
  <tbody>${b.linhas.map((l) => `<tr><td>${esc(l.n)}</td><td class="nome">${esc(l.nome)}</td><td>${esc(l.solucao)}</td><td class="area">${esc(l.area)}</td></tr>`).join("")}</tbody>
</table></div>`;
    case "modulos": {
      // matriz módulo × tipo de estaca (fundação): "–" onde o módulo não tem aquele tipo
      const cel = (v) => (v == null ? `<td class="area nd">–</td>` : `<td class="area">${esc(v)}</td>`);
      return `<div class="bloco-tab"><p class="t-cap">${esc(b.titulo)}</p><table class="t t-cont t-mod">
  <thead><tr><th>Item</th><th>Módulo</th>${b.colunas.map((c) => `<th class="r">${esc(c)}</th>`).join("")}</tr></thead>
  <tbody>${b.linhas.map((l) => `<tr><td>${esc(l.n)}</td><td class="nome">${esc(l.nome)}</td>${l.valores.map(cel).join("")}</tr>`).join("")}</tbody>
</table></div>`;
    }
    case "total":
      return `<div class="cl${rev(b)}"><span class="cl-n">${esc(b.n)}</span><div class="cl-t"><div class="total">
  <div class="total-v">${esc(b.valor)}</div>
  <p><strong>${esc(b.rotulo)}</strong> ${md(b.t)}</p>
</div></div></div>`;
    case "tabela-precos":
      return `<figure class="precos">
  <figcaption>${esc(b.legenda)}</figcaption>
  ${
    b.linhas
      ? `<table class="t"><tbody>${b.linhas.map(([a, v]) => `<tr><td>${md(a)}</td><td class="r">${md(v)}</td></tr>`).join("")}</tbody></table>`
      : `<div class="precos-ph"><b>[Tabela de preços globais: inserir]</b><span>A tabela não consta no arquivo original da proposta. Preencher antes do envio.</span></div>`
  }
</figure>`;
    case "planilha":
      return planilha(b);
    case "faturamento":
    case "cartoes":
      return `<div class="cl"><span class="cl-n">${esc(b.n)}</span><div class="cl-t"><p><strong>${esc(b.rotulo)}</strong></p>
<div class="fat">${b.partes.map((p) => `<div class="fat-card"><b>${esc(p.pct)}</b><p>${md(p.t)}</p></div>`).join("")}</div></div></div>`;
    case "obs":
      return `<div class="obs">${b.itens.map((t, i) => `<p><b>Obs.: ${i + 1}.</b><span>${md(t)}</span></p>`).join("")}</div>`;
    case "paragrafo":
      return `<p class="par">${md(b.t)}</p>`;
    default:
      return clausula(b, secao.compacto);
  }
};

const secaoHtml = (s, marcas) => `
<section class="sec${config.marcarRevisoes && s.rev ? " sec-rev" : ""}${s.quebraAntes ? " sec-quebra" : ""}">
  <h2 class="sec-h">${marca(`s${s.n}`, marcas)}<span class="sec-n">${esc(s.n)}</span>${esc(s.titulo)}</h2>
  ${s.intro ? `<p class="sec-intro">${md(s.intro)}</p>` : ""}
  ${s.itens.map((b) => bloco(b, s)).join("\n")}
</section>`;

const cartaHtml = (marcas) => `
<section class="carta">
  <div class="carta-topo">${marca("carta", marcas)}
    <div class="carta-cod">${esc(carta.codigo)}</div>
    <div class="carta-data">${esc(proposta.cidadeData)}</div>
  </div>
  <div class="carta-dest">
    <div class="carta-para"><p>${esc(carta.destinatario[0])}</p><p class="nome">${esc(carta.destinatario[1])}</p><p>${esc(carta.destinatario[2])}</p></div>
    <p class="carta-at">${esc(carta.atencao)}</p>
  </div>
  <div class="carta-ref"><span class="rot">Ref.:</span><p>${md(carta.referencia)}</p></div>
  <p class="carta-saud">${esc(carta.saudacao)}</p>
  <p class="carta-abert">${md(carta.abertura)}</p>
</section>`;

const assinaturaHtml = (marcas) => `
<section class="assin">${marca("assinaturas", marcas)}
  <div>
    <p class="assin-desp">${esc(assinatura.despedida)}</p>
    <div class="assin-linha">
      <p class="emp">${esc(assinatura.empresa)}</p>
      <p>${esc(assinatura.nome)}</p>
      <p>${esc(assinatura.registro)}</p>
    </div>
  </div>
  <div>
    <p class="assin-desp">${esc(assinatura.deAcordo)}</p>
    <div class="campos">
      <div class="campo"><span>Data</span><i></i></div>
      ${assinatura.campos.map((c) => `<div class="campo"><span>${esc(c)}</span><i></i></div>`).join("")}
      <div class="campo"><span>Assinatura</span><i></i></div>
    </div>
  </div>
</section>`;

/** @param {{ marcas?: boolean }} op  marcas: insere as marcas do sumário (1ª passada) */
export const htmlCorpo = ({ marcas = false } = {}) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" /><title>Proposta ${esc(proposta.codigo)}</title>
<style>${estiloCorpo()}</style></head>
<body${marcas ? ' class="com-marcas"' : ""}>
${cartaHtml(marcas)}
${secoes.map((s) => secaoHtml(s, marcas)).join("\n")}
${assinaturaHtml(marcas)}
${htmlMemorial(memorial, marcas)}
</body></html>`;
