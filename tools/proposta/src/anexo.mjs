/**
 * Anexo B — Obras executadas.
 *   B.1: abertura em página inteira (grafite, como a capa, sem moldura);
 *   B.2: comparativo das obras com o Grand Palladium, etapas registradas e números da Geoforte;
 *   B.3–B.6: uma página por obra, na área útil da moldura (174 × 234 mm).
 */
import { proposta, numerosGeoforte } from "../dados/empresa.mjs";
import { abertura, obras, placeholders, etapas, grandPalladium } from "../dados/obras.mjs";
import { secoes } from "../dados/proposta.mjs";
import { asset, esc } from "./util.mjs";
import { estiloAnexo, estiloAnexoAbertura } from "./estilos.mjs";

/** Valor preenchido ou placeholder destacado (campo ainda sem dado). */
const val = (v, ph) => (v == null || v === "" ? `<span class="ph">${esc(ph)}</span>` : esc(v));

const doc = (titulo, css, corpo) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" /><title>${esc(titulo)} · ${esc(proposta.codigo)}</title>
<style>${css}</style></head>
<body>${corpo}</body></html>`;

export const htmlAnexoAbertura = () =>
  doc(
    "Anexo B",
    estiloAnexoAbertura(),
    `<section class="capa ab">
  <div class="capa-malha" aria-hidden="true"></div>
  <div class="capa-topo">
    <img class="capa-logo" src="${asset("logos/geoforte-logo-invertido.svg")}" alt="Geoforte Fundações" />
    <div class="capa-cod">${esc(proposta.codigo)}<span>Anexo B</span></div>
  </div>

  <div class="ab-cab">
    <h1 class="ab-titulo"><span class="ab-letra">B</span>${esc(abertura.titulo)}</h1>
    <p class="ab-sub">${esc(abertura.subtitulo)}</p>
    <div class="capa-fio" aria-hidden="true"></div>
    <p class="ab-intro">${esc(abertura.texto)}</p>
  </div>

  <div class="ab-grade">
    ${obras
      .map(
        (o, i) => `<article class="ab-card">
      <div class="ab-foto"><img src="${asset("fotos/" + o.fotos[0].arquivo)}" alt="${esc(o.nome)}"${o.fotos[0].foco ? ` style="object-position:${o.fotos[0].foco}"` : ""} /></div>
      <div class="ab-txt">
        <span class="ab-num">${esc(o.numero)}</span>
        <div><h2 class="ab-nome">${esc(o.nome)}</h2><p class="ab-constr">${esc(o.construtora)}</p></div>
        <span class="ab-pag">B.${i + 3}</span>
      </div>
    </article>`,
      )
      .join("")}
  </div>

  <footer class="ab-pe"><span>${esc(proposta.cabecalho.join(" · "))}</span><b>B.1</b></footer>
</section>`,
  );

/** Quatro caixas: cheia (laranja) quando a obra tem foto da etapa, vazia quando não tem. */
const etapasDe = (o) =>
  etapas
    .map((e) => {
      const n = o.fotos.filter((f) => f.etapa === e.id).length;
      return `<li class="${n ? "sim" : ""}"><i></i><span>${esc(e.nome)}</span><b>${n ? n + (n > 1 ? " fotos" : " foto") : "sem foto"}</b></li>`;
    })
    .join("");

const fato = (rotulo, html) => `<div><dt>${esc(rotulo)}</dt><dd>${html}</dd></div>`;

const paginaObra = (o) => {
  const f = o.ficha;
  const complemento = f.complemento.confirmar
    ? `<span class="ph">${esc(f.complemento.valor)} [confirmar]</span>`
    : esc(f.complemento.valor);
  return `
<section class="pag">
  <header class="ob-topo">
    <h1 class="ob-tit"><span class="ob-num">${esc(o.numero)}</span><span class="ob-nome">${esc(o.nome)}</span></h1>
    <p class="ob-linha">${val(o.bairro, placeholders.bairro)}, Salvador – BA · ${val(o.ano, placeholders.ano)} · <span class="ob-constr">${esc(o.construtora)}</span></p>
    ${o.fotosConfirmar ? `<p class="ob-linha"><span class="ph">${esc(placeholders.fotosConfirmar)}</span></p>` : ""}
  </header>

  <p class="ob-cenario">${esc(o.cenario)}</p>
  <div class="ob-mosaico n${o.pdf.length}">
    ${o.pdf
      .map((i, k) => {
        const ft = o.fotos[i];
        return `<figure class="ob-foto m${k}"><img src="${asset("fotos/" + ft.arquivo)}" alt="${esc(ft.legenda)}"${ft.foco ? ` style="object-position:${ft.foco}"` : ""} /><span class="ob-marca">${k + 1}</span></figure>`;
      })
      .join("")}
  </div>
  <ol class="ob-legenda">${o.pdf.map((i, k) => `<li><b>${k + 1}</b>${esc(o.fotos[i].legenda)}</li>`).join("")}</ol>

  <ol class="ob-etapas" aria-label="Etapas registradas em foto">${etapasDe(o)}</ol>

  <dl class="ob-fatos">
    ${fato("Área de contenção", val(f.areaContencao, placeholders.areaContencao))}
    ${fato("Altura de escavação", val(f.alturaEscavacao, placeholders.alturaEscavacao))}
    ${fato("Estacas", val(f.estacas, placeholders.estacas))}
    ${fato("Execução", val(f.execucao, placeholders.execucao))}
  </dl>

  <div class="ob-base">
    <div class="ob-sol">
      <p class="ob-campo">Solução</p>
      <p class="ob-sol-t">${esc(f.solucao)}</p>
      <p class="ob-sol-c"><small>Complemento</small>${complemento}</p>
    </div>
    <aside class="ob-dest">
      <p class="ob-campo">Destaque da obra</p>
      <p>${o.destaque ? esc(o.destaque) : `<span class="ph">${esc(placeholders.destaque)}</span>`}</p>
    </aside>
  </div>
</section>`;
};

/* Página B.2 — as obras ao lado do Grand Palladium. Só entra o que é registro: cenário e
   complemento vêm do briefing e das fotos; a linha do Grand Palladium vem das cláusulas. */
const totalGP = secoes.flatMap((x) => x.itens).find((b) => b.tipo === "total");
const contGP = secoes.flatMap((x) => x.itens).find((b) => b.tipo === "contencoes");
const paginaComparativo = () => {
  const linha = (o) => `<tr>
      <td><span class="cmp-n">${esc(o.numero)}</span><b>${esc(o.nome)}</b><small>${esc(o.construtora)}</small></td>
      <td>${esc(o.cenario)}</td>
      <td>${esc(o.ficha.solucao)}</td>
      <td>${esc(o.ficha.complemento.valor)}${o.ficha.complemento.confirmar ? ' <span class="ph">[confirmar]</span>' : ""}</td>
      <td><span class="cmp-et">${etapas.map((e) => `<i class="${o.fotos.some((f) => f.etapa === e.id) ? "sim" : ""}" title="${esc(e.nome)}"></i>`).join("")}</span><small>${o.fotos.length} fotos</small></td>
    </tr>`;
  const mana = obras[0];
  const porEtapa = etapas.map((e) => ({ e, ft: mana.fotos.find((f) => f.etapa === e.id) })).filter((x) => x.ft);
  return `
<section class="pag">
  <header class="ob-topo">
    <h1 class="ob-tit"><span class="ob-num">B</span><span class="ob-nome">As obras e o Grand Palladium</span></h1>
    <p class="ob-linha">O que cada obra tem em comum com a expansão do resort, e o que as fotos registram.</p>
  </header>

  <table class="cmp">
    <thead><tr><th>Obra</th><th>Cenário</th><th>Solução</th><th>Complemento</th><th>Etapas com foto</th></tr></thead>
    <tbody>
      ${obras.map(linha).join("")}
      <tr class="gp">
        <td><b>${esc(grandPalladium.nome)}</b><small>${contGP.linhas.length} contenções · ${esc(totalGP.valor)}</small></td>
        <td>${esc(grandPalladium.cenario)}</td>
        <td>${esc(grandPalladium.solucao)}</td>
        <td>${esc(grandPalladium.complemento)}</td>
        <td><small>proposta GEO 2701A/25</small></td>
      </tr>
    </tbody>
  </table>
  <p class="cmp-leg"><span class="cmp-et"><i class="sim"></i><i class="sim"></i><i></i><i></i></span> Etapas, da esquerda para a direita: ${etapas.map((e) => esc(e.nome.toLowerCase())).join(" · ")}. Caixa cheia = há foto da etapa.</p>

  <h2 class="cmp-h">Do furo à cortina pronta, em uma obra: ${esc(mana.nome)}</h2>
  <ol class="cmp-fotos">
    ${porEtapa
      .map(
        ({ e, ft }, i) => `<li><figure class="ob-foto"><img src="${asset("fotos/" + ft.arquivo)}" alt="${esc(ft.legenda)}"${ft.foco ? ` style="object-position:${ft.foco}"` : ""} /><span class="ob-marca">${i + 1}</span></figure><p><b>${esc(e.nome)}</b>${esc(ft.legenda)}</p></li>`,
      )
      .join("")}
  </ol>

  <p class="cmp-frase">A Geoforte executa fundações desde <b>${esc(numerosGeoforte[0].valor)}</b>: ${esc(numerosGeoforte[1].valor)} obras executadas, ${esc(numerosGeoforte[2].valor)} de metros de estacas e ${esc(numerosGeoforte[3].valor)} equipamentos próprios.</p>
</section>`;
};

export const htmlAnexo = () => doc("Anexo B", estiloAnexo(), paginaComparativo() + obras.map(paginaObra).join(""));
