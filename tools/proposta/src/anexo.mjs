/**
 * Anexo B — Obras executadas.
 *   B.1: abertura em página inteira (grafite, como a capa, sem moldura);
 *   B.2–B.5: uma página por obra, na área útil da moldura (174 × 234 mm).
 */
import { proposta } from "../dados/empresa.mjs";
import { abertura, obras, placeholders } from "../dados/obras.mjs";
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
    <p class="capa-tipo">${esc(abertura.sobretitulo)}</p>
    <h1 class="ab-titulo">${esc(abertura.titulo)}</h1>
    <p class="ab-sub">${esc(abertura.subtitulo)}</p>
    <div class="capa-fio" aria-hidden="true"></div>
    <p class="ab-intro">${esc(abertura.texto)}</p>
  </div>

  <div class="ab-grade">
    ${obras
      .map(
        (o, i) => `<article class="ab-card">
      <div class="ab-foto"><img src="${asset("fotos/" + o.fotoPrincipal.arquivo)}" alt="${esc(o.nome)}" /></div>
      <div class="ab-txt">
        <span class="ab-num">${esc(o.numero)}</span>
        <div><h2 class="ab-nome">${esc(o.nome)}</h2><p class="ab-constr">${esc(o.construtora)}</p></div>
        <span class="ab-pag">B.${i + 2}</span>
      </div>
    </article>`,
      )
      .join("")}
  </div>

  <footer class="ab-pe"><span>${esc(proposta.cabecalho.join(" · "))}</span><b>B.1</b></footer>
</section>`,
  );

const fato = (rotulo, html) => `<div><dt>${esc(rotulo)}</dt><dd>${html}</dd></div>`;

const paginaObra = (o) => {
  const f = o.ficha;
  const complemento = f.complemento.confirmar
    ? `<span class="ph">${esc(f.complemento.valor)} [confirmar]</span>`
    : esc(f.complemento.valor);
  return `
<section class="pag">
  <header class="ob-topo">
    <span class="ob-num">${esc(o.numero)}</span>
    <div>
      <h1 class="ob-nome">${esc(o.nome)}</h1>
      <p class="ob-linha">${esc(o.construtora)} · ${val(o.bairro, placeholders.bairro)}, Salvador – BA · ${val(o.ano, placeholders.ano)}</p>
    </div>
  </header>

  <figure class="ob-foto ob-principal">
    <img src="${asset("fotos/" + o.fotoPrincipal.arquivo)}" alt="${esc(o.fotoPrincipal.legenda)}" />
    <figcaption>${esc(o.fotoPrincipal.legenda)}</figcaption>
  </figure>

  <dl class="ob-fatos">
    ${fato("Área de contenção", val(f.areaContencao, placeholders.areaContencao))}
    ${fato("Altura de escavação", val(f.alturaEscavacao, placeholders.alturaEscavacao))}
    ${fato("Estacas", val(f.estacas, placeholders.estacas))}
    ${fato("Execução", val(f.execucao, placeholders.execucao))}
  </dl>

  <div class="ob-base">
    <figure class="ob-foto">
      <img src="${asset("fotos/" + o.fotoDetalhe.arquivo)}" alt="${esc(o.fotoDetalhe.legenda)}" />
      <figcaption>${esc(o.fotoDetalhe.legenda)}</figcaption>
    </figure>
    <div class="ob-sol">
      <p class="ob-rot">Solução</p>
      <p class="ob-sol-t">${esc(f.solucao)}</p>
      <p class="ob-sol-c"><small>Complemento</small>${complemento}</p>
      <aside class="ob-dest">
        <p class="ob-rot">Destaque da obra</p>
        <p>${o.destaque ? esc(o.destaque) : `<span class="ph">${esc(placeholders.destaque)}</span>`}</p>
      </aside>
    </div>
  </div>
</section>`;
};

export const htmlAnexo = () => doc("Anexo B", estiloAnexo(), obras.map(paginaObra).join(""));
