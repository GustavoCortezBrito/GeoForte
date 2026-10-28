/**
 * Anexo — Obras executadas (a letra vem do pacote: "B" na contenção, "A" na fundação).
 *   x.1: abertura em página inteira (grafite, como a capa, sem moldura);
 *   contenção: x.2 comparativo das obras com o Grand Palladium, etapas registradas e números da
 *     Geoforte; depois uma página por obra, com mosaico de fotos, etapas e ficha;
 *   fundação: uma página por obra, com a foto enviada pela equipe, na área útil da moldura
 *     (174 × 234 mm).
 */
import { proposta, numerosGeoforte, secoes, anexo } from "./pacote.mjs";
import { asset, esc } from "./util.mjs";

const { abertura, obras, letra } = anexo;
const { placeholders, etapas, grandPalladium } = anexo;
const fundacao = anexo.tipo === "fundacao";
/** Número da página (x.n) da primeira obra: a contenção tem o comparativo antes dela. */
const primeira = fundacao ? 2 : 3;
/** Páginas do anexo sem a abertura (o gerador confere esta contagem). */
export const nPaginasAnexo = fundacao ? obras.length : obras.length + 1;
import { estiloAnexo, estiloAnexoAbertura } from "./estilos.mjs";

/** Valor preenchido ou placeholder destacado (campo ainda sem dado). */
const val = (v, ph) => (v == null || v === "" ? `<span class="ph">${esc(ph)}</span>` : esc(v));

const doc = (titulo, css, corpo) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" /><title>${esc(titulo)} · ${esc(proposta.codigo)}</title>
<style>${css}</style></head>
<body>${corpo}</body></html>`;

/** Foto principal da obra: a 1ª do álbum (contenção) ou a única enviada (fundação). */
const principal = (o) => (fundacao ? o.foto : { ...o.fotos[0], arquivo: "fotos/" + o.fotos[0].arquivo });
/** Recorte da foto no cartão da abertura (mais largo que alto): `focoCartao`, senão o `foco` da página. */
const focoCartao = (o) => principal(o).focoCartao ?? principal(o).foco;
/** Linha de crédito da obra: construtora (contenção) ou parceiro/cliente (fundação). */
const quem = (o) => (fundacao ? `${o.papel}: ${o.parceiro}` : o.construtora);

export const htmlAnexoAbertura = () =>
  doc(
    `Anexo ${letra}`,
    estiloAnexoAbertura(),
    `<section class="capa ab">
  <div class="capa-malha" aria-hidden="true"></div>
  <div class="capa-topo">
    <img class="capa-logo" src="${asset("logos/geoforte-logo-invertido.svg")}" alt="Geoforte Fundações" />
    <div class="capa-cod">${esc(proposta.codigo)}<span>Anexo ${esc(letra)}</span></div>
  </div>

  <div class="ab-cab">
    <h1 class="ab-titulo"><span class="ab-letra">${esc(letra)}</span>${esc(abertura.titulo)}</h1>
    <p class="ab-sub">${esc(abertura.subtitulo)}</p>
    <div class="capa-fio" aria-hidden="true"></div>
    <p class="ab-intro">${esc(abertura.texto)}</p>
  </div>

  <div class="ab-grade">
    ${obras
      .map(
        (o, i) => `<article class="ab-card">
      <div class="ab-foto"><img src="${asset(principal(o).arquivo)}" alt="${esc(o.nome)}"${focoCartao(o) ? ` style="object-position:${focoCartao(o)}"` : ""} /></div>
      <div class="ab-txt">
        <span class="ab-num">${esc(o.numero)}</span>
        <div><h2 class="ab-nome">${esc(o.nome)}</h2><p class="ab-constr">${esc(quem(o))}</p></div>
        <span class="ab-pag">${esc(letra)}.${i + primeira}</span>
      </div>
    </article>`,
      )
      .join("")}
  </div>

  <footer class="ab-pe"><span>${esc(proposta.cabecalho.join(" · "))}</span><b>${esc(letra)}.1</b></footer>
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
    <h1 class="ob-tit"><span class="ob-num">${esc(letra)}</span><span class="ob-nome">As obras e o Grand Palladium</span></h1>
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

/* Fundação — uma foto por obra, enviada pela equipe. Só entra o que é registro: nome, parceiro ou
   cliente (como no Word da proposta) e uma legenda que descreve o que se vê. `ficha` é opcional:
   se a equipe passar dados da obra (local, ano, estacas…), eles aparecem na régua abaixo da foto. */
const paginaObraFoto = (o) => `
<section class="pag">
  <header class="ob-topo">
    <h1 class="ob-tit"><span class="ob-num">${esc(o.numero)}</span><span class="ob-nome">${esc(o.nome)}</span></h1>
    <p class="ob-linha">${esc(o.papel)}: <span class="ob-constr">${esc(o.parceiro)}</span></p>
  </header>

  <figure class="ob-foto of-foto"><img src="${asset(o.foto.arquivo)}" alt="${esc(o.foto.legenda)}"${o.foto.foco ? ` style="object-position:${o.foto.foco}"` : ""} /></figure>
  <p class="of-leg">${esc(o.foto.legenda)}</p>
  ${
    o.ficha
      ? `<dl class="ob-fatos of-ficha" style="grid-template-columns:repeat(${o.ficha.length},1fr)">${o.ficha.map(([k, v]) => fato(k, esc(v))).join("")}</dl>`
      : ""
  }
</section>`;

export const htmlAnexo = () =>
  doc(
    `Anexo ${letra}`,
    estiloAnexo(),
    fundacao ? obras.map(paginaObraFoto).join("") : paginaComparativo() + obras.map(paginaObra).join(""),
  );
