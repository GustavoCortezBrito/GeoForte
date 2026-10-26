/**
 * Moldura das páginas (todas, exceto a capa): cabeçalho com logo e referência
 * da proposta, rodapé com os dados da empresa, selos e número da página.
 *
 * Os modelos de cabeçalho/rodapé do próprio Chrome não esperam as fontes da
 * marca carregarem (o texto sai em branco). Por isso a moldura é uma página
 * HTML comum, impressa à parte com fundo transparente e "carimbada" por cima de
 * cada página do conteúdo (ver carimbar() em gerar.mjs). O texto continua vetorial.
 *
 * Área útil do conteúdo: margens de 32 mm (topo), 31 mm (base) e 18 mm (laterais)
 * → 174 × 234 mm. Essas medidas casam com @page em estilos.mjs.
 */
import { proposta, empresa } from "../dados/empresa.mjs";
import { asset, esc } from "./util.mjs";
import { fontes, tokens } from "./estilos.mjs";

const folha = (rotulo) => `
<section class="folha">
  <header class="cab">
    <img src="${asset("logos/geoforte-logo.svg")}" alt="Geoforte Fundações" />
    <div class="cab-t">${proposta.cabecalho.map(esc).join("<br />")}</div>
  </header>
  <div class="cab-fio"></div>
  <footer class="rod">
    <div class="rod-t">
      <b>${esc(empresa.razaoSocial)} · CNPJ ${esc(empresa.cnpj)}</b><br />
      ${esc(empresa.endereco)}<br />
      ${esc(empresa.cidade)}<br />
      ${empresa.telefones.map(esc).join(" · ")} · ${esc(empresa.email)}
    </div>
    <div class="rod-d">
      <img class="abef" src="${asset("logos/logo-abef.png")}" alt="ABEF" />
      <img class="selo" src="${asset("logos/geoselos-medalha.png")}" alt="GeoSelos" />
      ${rotulo ? `<span class="rod-p">${esc(rotulo)}</span>` : ""}
    </div>
  </footer>
</section>`;

/** @param {string[]} rotulos  um por página: "Pág. 3", "B.2" ou "" (sem número) */
export const htmlMoldura = (rotulos) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" /><title>Moldura</title><style>
${fontes()}${tokens}
@page{size:210mm 297mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:transparent}
body{font-family:var(--texto);color:var(--g);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.folha{position:relative;width:210mm;height:297mm;overflow:hidden;break-after:page}
.folha:last-child{break-after:auto}
.cab{position:absolute;left:18mm;right:18mm;top:10.5mm;display:flex;align-items:center;justify-content:space-between}
.cab img{height:9.6mm;width:auto}
.cab-t{text-align:right;font-family:var(--mono);font-weight:700;font-size:9pt;line-height:1.38;letter-spacing:.09em}
.cab-fio{position:absolute;left:18mm;right:18mm;top:24mm;height:.55mm;
  background:linear-gradient(to right,var(--o) 0,var(--o) 18mm,var(--fio) 18mm)}
.rod{position:absolute;left:18mm;right:18mm;top:269.5mm;padding-top:3.2mm;border-top:.3mm solid var(--fio);
  display:flex;align-items:center;justify-content:space-between;gap:6mm}
.rod-t{font-size:9pt;line-height:1.34;color:var(--g2)}
.rod-t b{color:var(--g);font-weight:700}
.rod-d{display:flex;align-items:center;gap:3.6mm;flex-shrink:0}
.rod-d .abef{height:8.4mm;width:auto}
.rod-d .selo{height:11.5mm;width:auto}
.rod-p{min-width:14mm;padding-left:3.6mm;border-left:.3mm solid var(--fio);font-family:var(--mono);font-weight:700;
  font-size:10pt;text-align:right;white-space:nowrap}
</style></head><body>${rotulos.map(folha).join("")}</body></html>`;
