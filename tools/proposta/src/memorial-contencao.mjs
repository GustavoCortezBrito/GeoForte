/**
 * Memorial de cálculo (11) da proposta de contenções: uma seção por contenção, com os dados do
 * CYPE (normas, terreno, fases, resultados, verificações e quantitativos).
 */
import { asset, esc, marca, iconeOk } from "./util.mjs";

const ok = (txt = "Passa") => `<span class="ok">${iconeOk}${esc(txt)}</span>`;
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

export const htmlMemorial = (memorial, marcas) => `
<section class="sec memorial">
  <h2 class="sec-h">${marca(`s${memorial.n}`, marcas)}<span class="sec-n">${esc(memorial.n)}</span>${esc(memorial.titulo)}</h2>
  ${memorial.contencoes.map((c) => contencao(c, marcas)).join("")}
</section>`;


/** Entradas do sumário (nível 2): uma por contenção. */
export const entradasMemorial = (memorial) =>
  memorial.contencoes.map((c) => ({ id: `s${c.n}`, n: c.n, titulo: c.titulo, nivel: 2 }));
