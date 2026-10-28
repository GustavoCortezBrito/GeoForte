/**
 * Capa e sumário. Todos os números da capa vêm do texto da proposta
 * (ver `capa` no pacote de dados) — nada calculado nem inventado.
 */
import { pacote, proposta, config, secoes, memorial, anexo, capa } from "./pacote.mjs";
import { asset, esc } from "./util.mjs";
import { estiloCapa, estiloSumario } from "./estilos.mjs";

const { entradasMemorial } = await import(`./memorial-${memorial.tipo}.mjs`);

const doc = (titulo, css, corpo) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" /><title>${esc(titulo)}</title><style>${css}</style></head>
<body>${corpo}</body></html>`;

export const htmlCapa = () =>
  doc(
    `Capa · ${proposta.codigo}`,
    estiloCapa(),
    `<section class="capa">
  <div class="capa-malha" aria-hidden="true"></div>
  <img class="capa-simbolo" src="${asset("logos/geoforte-simbolo.svg")}" alt="" aria-hidden="true" />
  <div class="capa-topo">
    <img class="capa-logo" src="${asset("logos/geoforte-logo-invertido.svg")}" alt="Geoforte Fundações" />
    <div class="capa-cod">${esc(proposta.codigo)}<span>${esc(capa.data)}</span></div>
  </div>

  <div class="capa-meio">
    <p class="capa-tipo">Proposta técnica e comercial</p>
    <h1 class="capa-titulo">${esc(capa.titulo)}</h1>
    <p class="capa-sub">${esc(capa.subtitulo)}</p>
    <div class="capa-fio" aria-hidden="true"></div>
    <div class="capa-obra">
      <b>${esc(proposta.obra)}</b>
      <span>${esc(proposta.localObra)}</span>
    </div>

    <div class="capa-fatos">
      ${capa.fatos.map((f) => `<div class="capa-fato"><b>${esc(f.valor)}</b><span>${esc(f.rotulo)}</span></div>`).join("\n      ")}
    </div>
  </div>

  <div class="capa-pe">
    <div><b>Para</b><strong>${esc(proposta.cliente)}</strong><br />At.: ${esc(proposta.atencao)}</div>
    <div><b>Emissão</b><strong>${esc(proposta.cidadeData.replace(/\.$/, ""))}</strong></div>
    <div><b>Validade</b><strong>${esc(proposta.validade)}</strong></div>
  </div>
</section>`,
  );

/** Entradas do sumário, na ordem do documento. `id` casa com as marcas do corpo. */
export const entradasSumario = () => [
  { id: "carta", n: "", titulo: "Carta de apresentação" },
  ...secoes.map((s) => ({ id: `s${s.n}`, n: s.n, titulo: s.titulo })),
  { id: "assinaturas", n: "", titulo: "Assinaturas" },
  { id: `s${memorial.n}`, n: memorial.n, titulo: memorial.titulo, grupo: true },
  ...entradasMemorial(memorial),
  { id: "anexo", n: anexo.letra, titulo: `Anexo ${anexo.letra} · ${anexo.abertura.titulo}`, pagina: `${anexo.letra}.1`, grupo: true },
  { id: "certificado", n: "", titulo: "Certificado GeoSelos", pagina: "Final" },
];

/** @param {Record<string,number>} paginas  id → número da página (Pág. n) */
export const htmlSumario = (paginas) => {
  const entradas = entradasSumario();
  return doc(
    `Sumário · ${proposta.codigo}`,
    estiloSumario(),
    `<main${entradas.length > 22 ? ` class="denso"` : ""}>
  <h1 class="sum-h">Sumário</h1>
  <p class="sum-lead">${esc(pacote.sumario.lead)}</p>
  <ol class="sum-lista">
    ${entradas
      .map((e) => {
        const p = e.pagina ?? paginas[e.id] ?? "—";
        const cls = [e.nivel === 2 ? "n2" : "", e.grupo ? "grupo" : ""].filter(Boolean).join(" ");
        return `<li${cls ? ` class="${cls}"` : ""}><span class="sum-n">${esc(e.n)}</span><span class="sum-t">${esc(e.titulo)}</span><span class="sum-l"></span><span class="sum-p">${esc(p)}</span></li>`;
      })
      .join("\n    ")}
  </ol>
  ${
    config.marcarRevisoes
      ? `<p class="sum-nota"><b>Revisão A.</b> As cláusulas com a etiqueta “Revisado” e fundo laranja-claro foram alteradas em relação à versão anterior desta proposta.</p>`
      : ""
  }
</main>`,
  );
};
