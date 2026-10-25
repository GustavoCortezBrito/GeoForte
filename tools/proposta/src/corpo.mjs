/**
 * Corpo da proposta: carta, cláusulas 1 a 10, assinaturas e memorial (11).
 * Flui em páginas A4 com o cabeçalho e o rodapé da moldura.
 */
import { proposta, config } from "../dados/empresa.mjs";
import { carta, secoes, assinatura } from "../dados/proposta.mjs";
import { memorial } from "../dados/memorial.mjs";
import { asset, esc, md, marca, iconeOk } from "./util.mjs";
import { estiloCorpo } from "./estilos.mjs";

const rev = (item) => (config.marcarRevisoes && item.rev ? " rev" : "");
const ok = (txt = "Passa") => `<span class="ok">${iconeOk}${esc(txt)}</span>`;

// ─── Cláusulas ──────────────────────────────────────────────────────────────
const clausula = (c, compacto) => {
  const sub = c.sub
    ? `<dl class="sub">${c.sub.map((s) => `<dt>${esc(s.n)}</dt><dd>${md(s.t)}</dd>`).join("")}</dl>`
    : "";
  const insumos = c.insumos
    ? `<table class="insumos"><tbody>${c.insumos.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody></table>`
    : "";
  const lista = c.lista
    ? `<p class="complemento">${md(c.complemento)}</p><ul class="lista">${c.lista.map((l) => `<li>${md(l)}</li>`).join("")}</ul>`
    : "";
  return `<div class="cl${compacto ? " cl-c" : ""}${rev(c)}"><span class="cl-n">${esc(c.n)}</span><div class="cl-t"><p>${md(c.t)}</p>${sub}${insumos}${lista}</div></div>`;
};

const bloco = (b, secao) => {
  switch (b.tipo) {
    case "contencoes":
      return `<div class="bloco-tab"><p class="t-cap">${esc(b.titulo)}</p><table class="t t-cont">
  <thead><tr><th>Item</th><th>Contenção</th><th>Solução</th><th class="r">Área (m²)</th></tr></thead>
  <tbody>${b.linhas.map((l) => `<tr><td>${esc(l.n)}</td><td class="nome">${esc(l.nome)}</td><td>${esc(l.solucao)}</td><td class="area">${esc(l.area)}</td></tr>`).join("")}</tbody>
</table></div>`;
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
    case "faturamento":
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

// ─── Memorial ───────────────────────────────────────────────────────────────
const spec = (pares) =>
  `<dl class="spec">${pares.map(([k, v]) => `<div>${v == null ? `<dt class="so">${esc(k)}</dt>` : `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`}</div>`).join("")}</dl>`;

const COLS_RES = [
  ["Cota", "(m)"],
  ["Deslocamentos", "(mm)"],
  ["Diagrama de esforços axiais", "(kN/m)"],
  ["Diagrama de esforços cortantes", "(kN/m)"],
  ["Diagrama de momentos fletores", "(kN·m/m)"],
  ["Diagrama de empuxos", "(kN/m²)"],
  ["Pressão hidrostática", "(kN/m²)"],
];

const tabelaResultados = (r) => `
<table class="t t-res">
  <caption>${esc(r.fase)} <span>· Básica</span></caption>
  <thead><tr>${COLS_RES.map(([a, b]) => `<th>${esc(a)}<small>${esc(b)}</small></th>`).join("")}</tr></thead>
  <tbody>
    ${r.linhas.map((l) => `<tr>${l.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("\n    ")}
    <tr class="ext"><td>Máximos</td>${r.maximos.map(([v, c]) => `<td><b>${esc(v)}</b><i>Cota: ${esc(c)}</i></td>`).join("")}</tr>
    <tr class="ext"><td>Mínimos</td>${r.minimos.map(([v, c]) => `<td><b>${esc(v)}</b><i>Cota: ${esc(c)}</i></td>`).join("")}</tr>
  </tbody>
</table>`;

const tabelaEstabilidade = (ref, bloco, titulo) => `
<p class="m-sub">${esc(bloco.letra)}. ${esc(titulo)}</p>
<p class="ref-linha"><b>Referência:</b> Verificações de estabilidade (${esc(titulo)}): ${esc(ref)}</p>
<table class="t t-ver t-est">
  <thead><tr><th>Verificação</th><th>Valores</th><th>Estado</th></tr></thead>
  ${bloco.criterios
    .map(
      (c) => `<tbody>
    <tr class="crit"><td colspan="3">${esc(c.titulo)}</td></tr>
    <tr><td>Valor introduzido pelo usuário.</td><td class="val">${esc(c.minimo)}</td><td></td></tr>
    <tr class="grp"><td colspan="3">${esc(c.grupo)}</td></tr>
    ${c.fases.map(([f, v]) => `<tr><td class="ind">- ${esc(f)}</td><td class="val">Calculado: ${esc(v)}</td><td class="est">${ok()}</td></tr>`).join("")}
  </tbody>`,
    )
    .join("")}
  <tbody><tr class="fim"><td colspan="3">Todas as verificações foram cumpridas</td></tr></tbody>
</table>`;

const contencao = (c, marcas) => `
<section class="cont">
  <h3 class="cont-h">${marca(`s${c.n}`, marcas)}<span>${esc(c.n)}</span>${esc(c.titulo)}</h3>

  <div class="grade2">
    <div><h4 class="m-h">Normas e materiais</h4>${spec(c.normas)}</div>
    <div><h4 class="m-h">Ações</h4>${spec(c.acoes)}<h4 class="m-h">Dados gerais</h4>${spec(c.dadosGerais)}</div>
  </div>

  <h4 class="m-h">Descrição do terreno</h4>${spec(c.terreno)}

  <h4 class="m-h">Estratos</h4>
  <table class="t t-estr">
    <thead><tr><th>Referências</th><th>Cota superior</th><th>Descrição</th><th>Coeficientes de empuxo</th></tr></thead>
    <tbody>${c.estratos
      .map(
        (e) => `<tr><td class="ref">${esc(e.ref)}</td><td class="tnum">${esc(e.cota)}</td>
      <td><ul>${e.descricao.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></td>
      <td><ul>${e.coeficientes.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></td></tr>`,
      )
      .join("")}</tbody>
  </table>

  <div class="secao">
    <div><h4 class="m-h">Seção vertical do terreno</h4><figure><img src="${asset(c.secao)}" alt="Seção vertical do terreno, ${esc(c.titulo)}" /></figure></div>
    <div><h4 class="m-h">Geometria</h4>${spec(c.geometria)}</div>
  </div>

  <h4 class="m-h">Esquema de fases</h4>
  ${c.fases
    .map(
      (f) => `<div class="fase">
    <figure><img src="${asset(f.img)}" alt="${esc(f.nome)}" /></figure>
    <div><p class="fase-n">${esc(f.ref)} <span>· ${esc(f.nome.replace(/^Fase \d - /, ""))}</span></p>
      <ul>${f.descricao.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
  </div>`,
    )
    .join("")}

  ${
    c.cargas
      ? `<h4 class="m-h">Cargas</h4><p class="m-sub">${esc(c.cargas.titulo)}</p>
  <table class="t"><thead><tr><th>Tipo</th><th>Cota</th><th>Dados</th><th>Fase inicial</th><th>Fase final</th></tr></thead>
  <tbody>${c.cargas.linhas.map((l) => `<tr>${l.map((v) => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
      : ""
  }
  ${
    c.escoras
      ? `<h4 class="m-h">Elementos de apoio</h4><p class="m-sub">Escoras</p>
  <table class="t"><thead><tr><th>Descrição</th><th>Fase inicial</th><th>Fase final</th></tr></thead>
  <tbody>${c.escoras.map((e) => `<tr><td>${e.descricao.map(esc).join("<br />")}</td><td>${esc(e.inicial)}</td><td>${esc(e.final)}</td></tr>`).join("")}</tbody></table>`
      : ""
  }

  <h4 class="m-h">Resultados das fases</h4>
  ${c.resultados.map(tabelaResultados).join("")}

  ${
    c.apoio
      ? `<h4 class="m-h">Resultados para os elementos de apoio</h4><p class="m-sub">${esc(c.apoio.titulo)}</p>
  <table class="t"><thead><tr><th colspan="2">${esc(c.apoio.cota)}</th></tr><tr><th>Fase</th><th>Resultado</th></tr></thead>
  <tbody>${c.apoio.linhas.map(([f, r]) => `<tr><td>${esc(f)}</td><td>${r.map(esc).join("<br />")}</td></tr>`).join("")}</tbody></table>`
      : ""
  }

  <h4 class="m-h">Descrição da armadura</h4>
  <table class="t t-arm"><thead><tr><th>Armadura vertical</th><th>Armadura horizontal</th></tr></thead>
  <tbody><tr><td>${esc(c.armadura.vertical)}</td><td>${esc(c.armadura.horizontal)}</td></tr></tbody></table>

  <h4 class="m-h">Verificações geométricas e de resistência</h4>
  <p class="ref-linha"><b>Referência:</b> ${esc(c.referencia)}</p>
  <table class="t t-ver">
    <thead><tr><th>Verificação</th><th>Valores</th><th>Estado</th></tr></thead>
    <tbody>${c.verificacoes
      .map((v) => `<tr><td><b>${esc(v.v)}</b><span>${esc(v.norma)}</span></td><td class="val">${v.valores.map(esc).join("<br />")}</td><td class="est">${ok()}</td></tr>`)
      .join("")}</tbody>
  </table>
  <p class="m-sub">Informação adicional</p>
  <ul class="info">${c.informacao.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>

  <h4 class="m-h">Verificações de estabilidade</h4>
  ${tabelaEstabilidade(c.referencia, c.estabilidade.coeficientes, "Coeficientes de segurança")}
  ${tabelaEstabilidade(c.referencia, c.estabilidade.circulo, "Círculo de deslizamento desfavorável")}

  <h4 class="m-h">Quantitativos</h4>
  <p class="ref-linha"><b>Referência:</b> ${esc(c.quantitativos.referencia)}</p>
  <table class="t t-quant">
    <thead>
      <tr><th colspan="2" rowspan="2" style="text-align:left">Nome da armadura</th><th colspan="2">CA-50</th><th rowspan="2">Total</th></tr>
      <tr><th>Ø6.3</th><th>Ø16</th></tr>
    </thead>
    <tbody>${c.quantitativos.linhas
      .map(
        (l) => `<tr><td class="nome" rowspan="2">${esc(l.nome)}</td><td class="unid">Comprimento (m)</td>${l.comprimento.map((v, i) => `<td${i === 2 ? ' class="tot"' : ""}>${esc(v)}</td>`).join("")}</tr>
      <tr class="par2"><td class="unid">Peso (kg)</td>${l.peso.map((v, i) => `<td${i === 2 ? ' class="tot"' : ""}>${esc(v)}</td>`).join("")}</tr>`,
      )
      .join("")}</tbody>
  </table>

  <h4 class="m-h">Resumo de medição (incluídas perdas de aço)</h4>
  <table class="t t-resumo">
    <thead>
      <tr><th rowspan="2" style="text-align:left">Elemento</th><th colspan="3">CA-50 (kg)</th><th>Concreto (m³)</th></tr>
      <tr>${c.resumo.colunas.map((x) => `<th>${esc(x)}</th>`).join("")}<th>${esc(c.resumo.concreto)}</th></tr>
    </thead>
    <tbody>${c.resumo.linhas.map((l) => `<tr>${l.map((v, i) => `<td${i === 3 ? ' class="tot"' : ""}>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>
</section>`;

const memorialHtml = (marcas) => `
<section class="sec memorial">
  <h2 class="sec-h">${marca(`s${memorial.n}`, marcas)}<span class="sec-n">${esc(memorial.n)}</span>${esc(memorial.titulo)}</h2>
  ${memorial.contencoes.map((c) => contencao(c, marcas)).join("")}
</section>`;

/** @param {{ marcas?: boolean }} op  marcas: insere as marcas do sumário (1ª passada) */
export const htmlCorpo = ({ marcas = false } = {}) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" /><title>Proposta ${esc(proposta.codigo)}</title>
<style>${estiloCorpo()}</style></head>
<body${marcas ? ' class="com-marcas"' : ""}>
${cartaHtml(marcas)}
${secoes.map((s) => secaoHtml(s, marcas)).join("\n")}
${assinaturaHtml(marcas)}
${memorialHtml(marcas)}
</body></html>`;
