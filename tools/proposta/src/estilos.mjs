/**
 * Estilos do documento — identidade visual do site da Geoforte:
 * grafite #22252A, laranja #EF6C1A, papel #FAFAF8; Space Grotesk (títulos,
 * números, rótulos) e Manrope (texto). Fontes locais em assets/fonts.
 *
 * Página A4 com margens de 18 mm nas laterais, 32 mm no topo (cabeçalho) e
 * 31 mm embaixo (rodapé): área útil de 174 × 234 mm.
 */
import { asset, dataUri } from "./util.mjs";

const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF";

/** @font-face das duas famílias. `embutir` = data URI (cabeçalho/rodapé do Chrome). */
export const fontes = (embutir = false) => {
  const src = (f) => (embutir ? dataUri(`fonts/${f}`) : asset(`fonts/${f}`));
  const face = (familia, arq, pesos) => `
    @font-face{font-family:"${familia}";src:url(${src(arq + "-latin.woff2")}) format("woff2");font-weight:${pesos};font-display:block;unicode-range:${LATIN}}
    @font-face{font-family:"${familia}";src:url(${src(arq + "-latin-ext.woff2")}) format("woff2");font-weight:${pesos};font-display:block;unicode-range:${LATIN_EXT}}`;
  return face("Manrope", "manrope", "200 800") + face("Space Grotesk", "spacegrotesk", "300 700");
};

export const tokens = `
:root{
  --g:#22252a; --g2:#4f5560; --g3:#6b717c; --g4:#9aa0a9;
  --o:#ef6c1a; --oi:#b94e0c; --ow:#fbf0e8; --ow2:#f6dcc8;
  --papel:#fafaf8; --painel:#f3f2ee; --zebra:#f8f7f4;
  --fio:rgba(34,37,42,.13); --fio2:rgba(34,37,42,.28);
  --mono:"Space Grotesk",system-ui,sans-serif; --texto:"Manrope",system-ui,sans-serif;
}`;

const paginaComMoldura = `@page{size:210mm 297mm;margin:32mm 18mm 31mm}`;

const base = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;color:var(--g)}
body{font-family:var(--texto);font-size:9.6pt;line-height:1.52;-webkit-print-color-adjust:exact;print-color-adjust:exact;
  font-feature-settings:"kern" 1;text-rendering:geometricPrecision}
img{display:block}
strong{font-weight:700;color:var(--g)}
.num,.tnum{font-variant-numeric:tabular-nums}
/* Marca do sumário (só na 1ª passada): fora do fluxo, branca e com corpo suficiente
   para o extrator de texto não fundir dígitos repetidos ("11.1" virava "1.1" em 1px). */
.toc-marca{position:absolute;left:0;top:0;font-size:6px;line-height:6px;color:#fff;white-space:nowrap}
.com-marcas .carta-topo,.com-marcas .assin,.com-marcas .cont-h,.com-marcas .sec-h{position:relative}
.nw{white-space:nowrap}
/* Placeholder: dado ainda não informado — destacado para a revisão e legível em escala de cinza */
.ph{color:var(--oi);font-weight:700;background:var(--ow);padding:0 1.2mm;
  box-shadow:inset 0 -.45mm 0 var(--oi);-webkit-box-decoration-break:clone;box-decoration-break:clone}
.ic-ok{width:2.6mm;height:2.6mm;display:inline-block;vertical-align:-.35mm}
`;

/* ─── Capa (página inteira, grafite) ─────────────────────────────────────── */
const capa = `
@page{size:A4;margin:0}
.capa{position:relative;width:210mm;height:297mm;overflow:hidden;background:var(--g);color:var(--papel);
  padding:16mm 18mm 15mm;display:flex;flex-direction:column}
.capa-simbolo{position:absolute;right:-30mm;top:52mm;height:250mm;width:auto;opacity:.13}
.capa-malha{position:absolute;inset:0;
  background-image:linear-gradient(rgba(250,250,248,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(250,250,248,.045) 1px,transparent 1px);
  background-size:12mm 12mm;-webkit-mask-image:radial-gradient(120% 90% at 85% 30%,#000 20%,transparent 75%)}
.capa-topo{position:relative;display:flex;justify-content:space-between;align-items:flex-start}
.capa-logo{height:13mm;width:auto}
.capa-cod{font-family:var(--mono);font-weight:700;font-size:10pt;letter-spacing:.12em;text-align:right;line-height:1.45;color:var(--papel)}
.capa-cod span{display:block;color:var(--g4);font-weight:500;letter-spacing:.06em}
.capa-meio{position:relative;margin-top:auto}
.capa-tipo{font-family:var(--mono);font-weight:700;font-size:10.5pt;letter-spacing:.16em;text-transform:uppercase;color:var(--o)}
.capa-titulo{margin-top:5mm;font-family:var(--mono);font-weight:700;font-size:44pt;line-height:.98;letter-spacing:-.035em;max-width:150mm}
.capa-sub{margin-top:5mm;font-family:var(--mono);font-weight:500;font-size:16pt;line-height:1.25;color:#c9ccd2;max-width:140mm}
.capa-fio{margin-top:11mm;height:.7mm;background:linear-gradient(to right,var(--o) 0,var(--o) 24mm,rgba(250,250,248,.18) 24mm)}
.capa-obra{margin-top:7mm}
.capa-obra b{display:block;font-family:var(--mono);font-weight:700;font-size:15pt;letter-spacing:-.01em;color:var(--papel)}
.capa-obra span{display:block;margin-top:1.5mm;font-size:10.5pt;color:#b9bdc4}
.capa-fatos{position:relative;margin-top:12mm;display:grid;grid-template-columns:repeat(4,1fr);border-top:.3mm solid rgba(250,250,248,.22)}
.capa-fato{padding:5mm 4mm 0 0}
.capa-fato + .capa-fato{padding-left:4.5mm;border-left:.3mm solid rgba(250,250,248,.16)}
.capa-fato b{display:block;font-family:var(--mono);font-weight:700;font-size:21pt;line-height:1;letter-spacing:-.02em;color:var(--papel);white-space:nowrap}
.capa-fato span{display:block;margin-top:2.2mm;font-size:8.6pt;line-height:1.35;color:#b9bdc4}
.capa-pe{position:relative;margin-top:14mm;padding-top:5mm;border-top:.3mm solid rgba(250,250,248,.22);
  display:grid;grid-template-columns:1.25fr 1fr .8fr;gap:6mm;font-size:9pt;line-height:1.45;color:#b9bdc4}
.capa-pe b{display:block;font-family:var(--mono);font-weight:700;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--o);margin-bottom:1.2mm}
.capa-pe strong{color:var(--papel);font-weight:600}
`;

/* ─── Sumário ────────────────────────────────────────────────────────────── */
const sumario = `
.sum-h{font-family:var(--mono);font-weight:700;font-size:30pt;line-height:1;letter-spacing:-.03em}
.sum-lead{margin-top:4mm;font-size:10.5pt;color:var(--g2);max-width:130mm}
.sum-lista{margin-top:9mm;list-style:none;border-top:.6mm solid var(--g)}
.sum-lista li{display:flex;align-items:baseline;gap:4mm;padding:2.05mm 0;border-bottom:.25mm solid var(--fio)}
.sum-n{width:11mm;flex-shrink:0;font-family:var(--mono);font-weight:700;font-size:10pt;color:var(--o);font-variant-numeric:tabular-nums}
.sum-t{font-family:var(--mono);font-weight:500;font-size:11pt;color:var(--g)}
.sum-l{flex:1;border-bottom:.35mm dotted var(--fio2);transform:translateY(-1mm)}
.sum-p{font-family:var(--mono);font-weight:700;font-size:10pt;color:var(--g);font-variant-numeric:tabular-nums;min-width:12mm;text-align:right}
.sum-lista li.n2{padding:1.25mm 0 1.25mm 15mm}
.sum-lista li.n2 .sum-n{color:var(--g3);font-weight:500}
.sum-lista li.n2 .sum-t{font-size:10pt;color:var(--g2)}
.sum-lista li.n2 .sum-p{font-weight:500;color:var(--g2)}
.sum-lista li.grupo{margin-top:4mm;border-top:.6mm solid var(--g)}
.sum-nota{margin-top:8mm;padding:3.5mm 4mm;background:var(--ow);font-size:9pt;color:var(--g2)}
.sum-nota b{color:var(--oi)}
`;

/* ─── Corpo: carta e cláusulas ───────────────────────────────────────────── */
const corpo = `
p{orphans:3;widows:3}
.carta-topo{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:3mm;border-bottom:.25mm solid var(--fio)}
.carta-cod{font-family:var(--mono);font-weight:700;font-size:11pt;letter-spacing:.04em}
.carta-data{font-size:10pt;color:var(--g2)}
.carta-dest{margin-top:8mm;display:grid;grid-template-columns:1fr 1fr;gap:10mm}
.carta-para p{font-size:10pt;line-height:1.45}
.carta-para .nome{font-family:var(--mono);font-weight:700;font-size:13pt;letter-spacing:-.01em;margin:.6mm 0}
.carta-at{font-size:10pt;font-weight:600;align-self:end}
.carta-ref{margin-top:7mm;padding:4.5mm 5mm;background:var(--painel);display:grid;grid-template-columns:13mm 1fr;gap:2mm}
.carta-ref .rot{font-family:var(--mono);font-weight:700;font-size:9pt;letter-spacing:.08em;text-transform:uppercase;color:var(--oi);padding-top:.5mm}
.carta-ref p{font-size:10pt;line-height:1.5;font-weight:600}
.carta-saud{margin-top:8mm;font-weight:600}
.carta-abert{margin-top:2.5mm;font-size:10pt;line-height:1.6}

.sec{margin-top:10mm}
.sec-quebra{break-before:page;margin-top:0}
.sec-h{display:flex;align-items:baseline;gap:3.5mm;font-family:var(--mono);font-weight:700;font-size:14pt;
  letter-spacing:-.015em;line-height:1.15;padding-bottom:2.6mm;break-after:avoid;
  background:linear-gradient(to right,var(--o) 0,var(--o) 14mm,var(--fio) 14mm) left bottom/100% .55mm no-repeat}
.sec-h .sec-n{color:var(--o);font-variant-numeric:tabular-nums;min-width:9mm}
.sec-intro{margin-top:3.5mm;font-size:9.8pt;line-height:1.58;color:var(--g)}
.sec-intro + .cl, .sec-h + .cl{margin-top:3.6mm}

.cl{display:grid;grid-template-columns:11.5mm 1fr;margin-top:3mm;break-inside:avoid}
.cl-n{font-family:var(--mono);font-weight:600;font-size:9.4pt;color:var(--g3);font-variant-numeric:tabular-nums;padding-top:.1mm}
.cl-t > p + p{margin-top:2mm}
.cl-c{margin-top:1.5mm}
.sub{margin-top:2.2mm;display:grid;grid-template-columns:6mm 1fr;row-gap:1.6mm}
.sub dt{font-family:var(--mono);font-weight:700;color:var(--oi)}
.lista{margin-top:2mm;list-style:square;padding-left:4.6mm}
.lista li{margin-top:1.2mm;padding-left:.6mm}
.lista li::marker{color:var(--o);font-size:1.15em}
.complemento{margin-top:2mm}

/* revisões (config.marcarRevisoes) */
.rev{position:relative;background:var(--ow);box-shadow:-2.5mm 0 0 var(--ow),2.5mm 0 0 var(--ow);padding:1.4mm 0}
.rev::after{content:"Revisado";position:absolute;right:0;top:-1.6mm;font-family:var(--mono);font-weight:700;font-size:6.8pt;
  letter-spacing:.1em;text-transform:uppercase;color:#fff;background:var(--oi);padding:.3mm 1.4mm}
.sec-rev .sec-intro{background:var(--ow);box-shadow:-2.5mm 0 0 var(--ow),2.5mm 0 0 var(--ow);padding:1.4mm 0}

/* tabelas genéricas */
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
thead{display:table-header-group}
tr{break-inside:avoid}
th{font-family:var(--mono);font-weight:700;text-align:left}
.t{font-size:9.2pt}
.t thead th{background:var(--g);color:#fff;font-size:8.4pt;letter-spacing:.03em;padding:1.9mm 2.6mm}
.t tbody td{padding:1.9mm 2.6mm;border-bottom:.25mm solid var(--fio);vertical-align:top}
.t .r{text-align:right}
.t-cap{font-family:var(--mono);font-weight:700;font-size:9.6pt;margin:0 0 2mm}

.bloco-tab{margin:4mm 0 0 11.5mm;break-inside:avoid}
.t-cont td:first-child{font-family:var(--mono);font-weight:600;color:var(--g3);width:15mm}
.t-cont td.nome{font-weight:700}
.t-cont td.area{font-family:var(--mono);font-weight:700;font-size:10pt;text-align:right;white-space:nowrap}

.total{margin-top:1mm;display:grid;grid-template-columns:auto 1fr;gap:6mm;align-items:center;padding:4mm 5mm;background:var(--g);color:#e8e9ec}
.total-v{font-family:var(--mono);font-weight:700;font-size:21pt;letter-spacing:-.02em;color:#fff;white-space:nowrap}
.total p{font-size:9.6pt;line-height:1.5}
.total strong{color:#fff}

.precos{margin:4mm 0 1mm;break-inside:avoid}
.precos figcaption{font-family:var(--mono);font-weight:700;font-size:9.6pt;margin-bottom:2mm;break-after:avoid}
.precos-ph{padding:7mm 6mm;background:var(--ow);border:.35mm dashed var(--oi);color:var(--oi);text-align:center}
.precos-ph b{display:block;font-family:var(--mono);font-size:12pt;letter-spacing:-.01em}
.precos-ph span{display:block;margin-top:1.5mm;font-size:9pt;color:var(--g2)}

.insumos{margin-top:2.5mm}
.insumos td{padding:1.8mm 2.6mm;border-bottom:.25mm solid var(--fio)}
.insumos tr:first-child td{border-top:.5mm solid var(--g)}
.insumos td + td{font-family:var(--mono);font-weight:700;text-align:right;white-space:nowrap}

.fat{margin-top:2.5mm;display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.fat-card{padding:4mm 4.5mm;background:var(--painel)}
.fat-card b{display:block;font-family:var(--mono);font-weight:700;font-size:20pt;line-height:1;letter-spacing:-.02em;color:var(--o)}
.fat-card p{margin-top:2.4mm;font-size:9pt;line-height:1.5}

.obs{margin:4mm 0 0 11.5mm;padding-top:3mm;border-top:.25mm solid var(--fio);break-inside:avoid}
.obs p{display:grid;grid-template-columns:15mm 1fr;font-size:9.2pt;line-height:1.5;color:var(--g2)}
.obs p + p{margin-top:2mm}
.obs b{font-family:var(--mono);font-weight:700;color:var(--g)}
.par{margin-top:3.4mm;font-size:9.8pt;line-height:1.6}

/* assinaturas */
.assin{margin-top:9mm;break-inside:avoid;display:grid;grid-template-columns:1fr 1fr;gap:12mm}
.assin-desp{font-weight:600}
.assin-linha{margin-top:15mm;border-top:.3mm solid var(--g);padding-top:2.4mm}
.assin-linha p{font-size:9.6pt;line-height:1.5}
.assin-linha .emp{font-family:var(--mono);font-weight:700;font-size:10pt;letter-spacing:.01em}
.campos{margin-top:2mm}
.campo{display:grid;grid-template-columns:20mm 1fr;align-items:end;gap:2mm;margin-top:4.6mm}
.campo span{font-size:9pt;color:var(--g2)}
.campo i{display:block;border-bottom:.3mm solid var(--g2);height:4.6mm}
`;

/* ─── Memorial de cálculo ────────────────────────────────────────────────── */
const memorial = `
.memorial{break-before:page}
.cont{margin-top:9mm}
.cont + .cont{break-before:page}
.cont-h{display:flex;align-items:baseline;gap:3.5mm;font-family:var(--mono);font-weight:700;font-size:17pt;letter-spacing:-.02em;break-after:avoid}
.cont-h span{color:var(--o)}
.m-h{margin-top:7mm;font-family:var(--mono);font-weight:700;font-size:10.6pt;letter-spacing:-.005em;break-after:avoid;
  display:flex;align-items:center;gap:2.4mm}
.m-h::before{content:"";width:2.2mm;height:2.2mm;background:var(--o);flex-shrink:0}
.m-sub{margin-top:3.4mm;font-family:var(--mono);font-weight:600;font-size:9.4pt;color:var(--g2);break-after:avoid}
.m-h + *, .m-sub + *{margin-top:2.6mm}
.memorial .t{font-size:8.5pt}
.memorial .t thead th{font-size:7.8pt;padding:1.5mm 2.2mm}
.memorial .t tbody td{padding:1.35mm 2.2mm}

.grade2{display:grid;grid-template-columns:1fr 1fr;gap:9mm;break-inside:avoid}
.spec{font-size:8.9pt}
.spec div{display:flex;justify-content:space-between;gap:5mm;padding:1.25mm 0;border-bottom:.25mm solid var(--fio)}
.spec div:first-child{border-top:.5mm solid var(--g)}
.spec dt{color:var(--g2)}
.spec dd{font-family:var(--mono);font-weight:600;text-align:right;white-space:nowrap}
.spec dt.so{color:var(--g)}

.t-estr td ul{list-style:none}
.t-estr td li{line-height:1.6}
.t-estr td.ref{font-family:var(--mono);font-weight:700;white-space:nowrap}

.secao{display:grid;grid-template-columns:64mm 1fr;gap:10mm;align-items:start}
.secao figure img{width:44mm;height:auto;border:.25mm solid var(--fio)}
figcaption.leg{margin-top:1.8mm;font-size:7.8pt;color:var(--g3);font-family:var(--mono);font-weight:500;letter-spacing:.02em}

.fase{display:grid;grid-template-columns:102mm 1fr;gap:7mm;align-items:start;margin-top:4mm;break-inside:avoid}
.fase img{width:102mm;height:auto;border:.25mm solid var(--fio)}
.fase-n{font-family:var(--mono);font-weight:700;font-size:9.6pt;padding-bottom:1.6mm;border-bottom:.5mm solid var(--g)}
.fase-n span{color:var(--g3);font-weight:500}
.fase ul{list-style:none;font-size:8.6pt}
.fase li{padding:1.05mm 0;border-bottom:.25mm solid var(--fio);line-height:1.4}

/* duas fases por página: linhas mais justas que as das outras tabelas */
.t-res{font-size:7.9pt;line-height:1.3;break-inside:avoid}
.t-res caption{caption-side:top;text-align:left;font-family:var(--mono);font-weight:700;font-size:9.6pt;padding:0 0 1.8mm}
.t-res caption span{color:var(--g3);font-weight:500}
.t-res thead th{font-size:7pt!important;line-height:1.18;vertical-align:bottom;text-align:right;padding:1.2mm 1.6mm!important}
.t-res thead th:first-child{text-align:left}
.t-res thead th small{display:block;font-weight:500;color:#c9ccd2;font-size:6.8pt;margin-top:.4mm}
.t-res tbody td{text-align:right;padding:.75mm 1.6mm!important}
.t-res tbody td:first-child{text-align:left;font-family:var(--mono);font-weight:600}
.t-res tbody tr:nth-child(even) td{background:var(--zebra)}
.t-res tr.ext td{background:var(--painel)!important;border-bottom:.25mm solid var(--fio2);padding-top:1mm!important;padding-bottom:1mm!important;line-height:1.25}
.t-res tr.ext td:first-child{font-family:var(--mono);font-weight:700;color:var(--g)}
.t-res tr.ext td b{display:block;font-family:var(--mono);font-weight:700;font-size:8.2pt}
.t-res tr.ext td i{display:block;font-style:normal;font-size:6.9pt;color:var(--g3)}
.t-res + .t-res{margin-top:6mm}

.ref-linha{font-size:8.4pt;color:var(--g2);margin-bottom:2mm}
.ref-linha b{font-family:var(--mono);color:var(--g)}
.t-ver td:first-child b{display:block;font-weight:700}
.t-ver td:first-child span{display:block;margin-top:.5mm;font-size:7.8pt;color:var(--g3)}
.t-ver td.val{white-space:nowrap;font-family:var(--mono);font-weight:500}
.ok{display:inline-flex;align-items:center;gap:1mm;font-family:var(--mono);font-weight:700;color:var(--g);white-space:nowrap}
.ok .ic-ok{color:var(--o)}
.t-ver td.est{width:20mm}
.t-est tr.crit td{background:var(--painel)!important;font-weight:700;padding-top:1.8mm!important}
.t-est tr.grp td{font-family:var(--mono);font-weight:600;color:var(--g2)}
.t-est td.ind{padding-left:5mm!important}
.t-est tr.fim td{text-align:center;font-family:var(--mono);font-weight:700;border-top:.5mm solid var(--g);border-bottom:0}
.info{margin-top:3mm;list-style:square;padding-left:4mm;font-size:8.4pt;color:var(--g2)}
.info li{margin-top:1mm;padding-left:.4mm}
.info li::marker{color:var(--g4)}

.t-ver,.t-est,.t-quant,.t-resumo,.t-arm,.secao,.grade2{break-inside:avoid}
.ref-linha,.m-sub,.m-h,.t-cap{break-after:avoid}
.t-quant td,.t-quant th{text-align:center}
.t-quant td.nome{text-align:left;font-weight:700}
.t-quant td.unid{text-align:left;color:var(--g2)}
.t-quant tbody tr.par2 td{border-bottom:.25mm solid var(--fio2)}
.t-quant tbody tr:not(.par2) td{border-bottom:0}
.t-quant thead tr + tr th{background:#3a3e45}
.t-quant td.tot, .t-resumo td.tot{font-family:var(--mono);font-weight:700}
.t-resumo td,.t-resumo th{text-align:center}
.t-resumo td:first-child{text-align:left}
.t-resumo thead tr + tr th{background:#3a3e45}
.t-resumo tbody tr:last-child td{font-family:var(--mono);font-weight:700;border-top:.5mm solid var(--g)}
.t-arm{width:auto;min-width:110mm}
.t-arm td{font-family:var(--mono);font-weight:600}
`;

/* ─── Anexo B ────────────────────────────────────────────────────────────── */
/* B.1 — abertura em página inteira: usa a base da capa (.capa, malha, topo, fio) */
const abertura = `
.ab-cab{position:relative;margin-top:15mm}
.ab-titulo{margin-top:4mm;font-family:var(--mono);font-weight:700;font-size:46pt;line-height:.98;letter-spacing:-.035em;color:var(--papel)}
.ab-sub{margin-top:4mm;font-family:var(--mono);font-weight:500;font-size:15pt;line-height:1.25;color:#c9ccd2}
.ab .capa-fio{margin-top:8mm}
.ab-intro{margin-top:6mm;max-width:152mm;font-size:10.6pt;line-height:1.6;color:#b9bdc4}
.ab-grade{position:relative;margin-top:10mm;flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:7mm 6mm}
.ab-card{display:flex;flex-direction:column;min-height:0}
.ab-foto{flex:1;min-height:0;overflow:hidden;background:#2c3036}
.ab-foto img{width:100%;height:100%;object-fit:cover}
.ab-txt{display:grid;grid-template-columns:9mm 1fr auto;gap:2mm;align-items:baseline;padding:3.2mm 0 2.8mm;border-bottom:.3mm solid rgba(250,250,248,.2)}
.ab-num{font-family:var(--mono);font-weight:700;font-size:13.5pt;line-height:1.1;color:var(--o);font-variant-numeric:tabular-nums}
.ab-nome{font-family:var(--mono);font-weight:700;font-size:13.5pt;line-height:1.1;letter-spacing:-.015em;color:var(--papel)}
.ab-constr{margin-top:1mm;font-size:9.4pt;color:#b9bdc4}
.ab-pag{font-family:var(--mono);font-weight:700;font-size:9pt;letter-spacing:.08em;color:var(--o)}
.ab-pe{position:relative;margin-top:9mm;padding-top:4mm;border-top:.3mm solid rgba(250,250,248,.22);
  display:flex;justify-content:space-between;align-items:baseline;font-family:var(--mono);font-weight:500;font-size:9pt;letter-spacing:.08em;color:#b9bdc4}
.ab-pe b{font-weight:700;font-size:10pt;letter-spacing:.02em;color:var(--papel)}
`;

/* B.2–B.5 — uma obra por página, dentro da moldura */
const anexo = `
.pag{width:174mm;height:234mm;overflow:hidden;display:flex;flex-direction:column;break-after:page}
.pag:last-child{break-after:auto}

.ob-topo{display:grid;grid-template-columns:auto 1fr;gap:5mm;align-items:end;padding-bottom:4mm;border-bottom:.25mm solid var(--fio)}
.ob-num{font-family:var(--mono);font-weight:700;font-size:50pt;line-height:.78;letter-spacing:-.04em;color:var(--o);font-variant-numeric:tabular-nums}
.ob-nome{font-family:var(--mono);font-weight:700;font-size:26pt;line-height:1;letter-spacing:-.03em}
.ob-linha{margin-top:2mm;font-size:10pt;color:var(--g2)}

.ob-foto{position:relative;overflow:hidden;background:var(--painel)}
.ob-foto img{width:100%;height:100%;object-fit:cover}
.ob-foto figcaption{position:absolute;left:0;right:0;bottom:0;padding:9mm 4mm 3mm;
  background:linear-gradient(to top,rgba(34,37,42,.88),rgba(34,37,42,0));
  color:#fff;font-family:var(--mono);font-weight:500;font-size:9pt;letter-spacing:.01em}
.ob-foto figcaption::before{content:"";display:inline-block;width:5mm;height:.6mm;background:var(--o);vertical-align:middle;margin-right:2.4mm;transform:translateY(-.3mm)}
/* mosaico: a 1ª foto grande, as outras empilhadas ao lado (fotos originais, até 1600 px) */
.ob-mosaico{margin-top:5mm;flex:1;min-height:0;display:grid;gap:2.5mm;grid-template-columns:1.85fr 1fr;grid-template-rows:1fr 1fr}
.ob-mosaico .m0{grid-row:1 / 3}
.ob-mosaico.n2 .m1{grid-row:1 / 3}
.ob-mosaico .m1 figcaption,.ob-mosaico .m2 figcaption{padding:7mm 3mm 2.4mm;font-size:9pt;line-height:1.25}
.ob-mosaico .m1 figcaption::before,.ob-mosaico .m2 figcaption::before{display:none}

/* números da obra: mesma régua laranja + grafite da capa */
.ob-fatos{flex-shrink:0;display:grid;grid-template-columns:1fr 1fr 1.2fr 1.35fr;padding-top:.7mm;border-bottom:.25mm solid var(--fio);
  background:linear-gradient(to right,var(--o) 0,var(--o) 24mm,var(--g) 24mm) left top/100% .7mm no-repeat}
.ob-fatos div{padding:3.6mm 2.5mm 3.4mm 3.6mm;border-left:.25mm solid var(--fio)}
.ob-fatos div:first-child{padding-left:0;border-left:0}
.ob-fatos dt{font-size:9pt;line-height:1.25;color:var(--g2)}
.ob-fatos dd{margin-top:1.6mm;font-family:var(--mono);font-weight:700;font-size:12.5pt;line-height:1.2;letter-spacing:-.01em;color:var(--g)}
.ob-fatos dd .ph{font-size:9.6pt;letter-spacing:0}

.ob-base{margin-top:6mm;display:grid;grid-template-columns:1fr 1fr;gap:6mm;align-items:stretch;flex-shrink:0}
.ob-sol{display:flex;flex-direction:column;min-height:0}
.ob-rot{font-family:var(--mono);font-weight:700;font-size:9pt;letter-spacing:.14em;text-transform:uppercase;color:var(--oi)}
.ob-sol-t{margin-top:1.8mm;font-family:var(--mono);font-weight:700;font-size:15pt;line-height:1.15;letter-spacing:-.015em}
.ob-sol-c{margin-top:2.6mm;padding-top:2.2mm;border-top:.25mm solid var(--fio);font-family:var(--mono);font-weight:600;font-size:10pt;line-height:1.35;color:var(--g)}
.ob-sol-c small{display:block;margin-bottom:.6mm;font-family:var(--texto);font-weight:400;font-size:9pt;color:var(--g2)}
.ob-dest{background:var(--g);padding:4.4mm 5mm 4.8mm;border-top:.7mm solid var(--o)}
.ob-dest .ob-rot{color:var(--o)}
.ob-dest p + p{margin-top:2mm;font-size:10.6pt;line-height:1.5;color:#f1f2f4}
.ob-dest .ph{color:#ffd9bf;background:rgba(239,108,26,.18);box-shadow:inset 0 -.45mm 0 var(--o)}
`;

export const estiloCapa = () => fontes() + tokens + base + capa;
export const estiloSumario = () => fontes() + tokens + paginaComMoldura + base + sumario;
export const estiloCorpo = () => fontes() + tokens + paginaComMoldura + base + corpo + memorial;
export const estiloAnexoAbertura = () => fontes() + tokens + base + capa + abertura;
export const estiloAnexo = () => fontes() + tokens + paginaComMoldura + base + anexo;
