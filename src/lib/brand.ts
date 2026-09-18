/**
 * Identidade visual Geoforte — Conceito 01 "Pilar".
 *
 * O "G" da marca redesenhado com precisão geométrica e prolongado numa ponta
 * cravada no chão: a letra e a fundação na mesma forma.
 *
 * Fonte: docs/geoforte-identidade-visual-conceitos.pdf
 */

export const brand = {
  /** Laranja da marca. Só para preenchimento e texto grande — ver `orangeInk`. */
  orange: "#EF6C1A",
  /** Laranja escurecido, mesmo matiz (23°), para texto pequeno sobre papel. 4,8:1. */
  orangeInk: "#B94E0C",
  /** Laranja de estado pressionado / hover em preenchimentos. */
  orangeDeep: "#D25A0E",
  /** Grafite. Tinta sobre papel e fundo das faixas escuras. */
  graphite: "#22252A",
  /** Papel. Fundo padrão do site e tinta sobre grafite. */
  paper: "#FAFAF8",
} as const;

/**
 * Geometria do símbolo, em unidades de viewBox.
 *
 * O anel tem centro em (50, 50), raio externo 50 e interno 30,5. O corte à
 * direita é uma cunha de ±32° com vértice em (68,7, 50); o travessão do "G"
 * atravessa esse corte. A estaca desce do interior do anel até a ponta em
 * (50, 141).
 */
export const mark = {
  viewBox: "0 0 100 141",
  width: 100,
  height: 141,
  /** Proporção largura/altura do símbolo completo. */
  ratio: 100 / 141,
  /** Anel do "G" com o corte em cunha. */
  ring:
    "M96.81 32.43A50 50 0 1 0 96.81 67.57L79.71 56.885A30.5 30.5 0 1 1 79.71 43.115Z",
  /** Travessão do "G". */
  bar: { x: 46, y: 40.25, width: 44.3, height: 19.5 },
  /** Estaca cravada — fuste e ponta. */
  pile: "M42.4 91H57.6V126L50 141L42.4 126Z",
  /** Só o anel + travessão, sem a estaca (altura 100). */
  ringOnlyViewBox: "0 0 100 100",
} as const;

/**
 * Medidas de construção do símbolo, para a página de manual.
 * Em unidades de viewBox e em múltiplos do diâmetro externo (D = 100).
 */
export const markSpecs = [
  ["Diâmetro externo", "D = 100", "Define toda a escala do símbolo."],
  ["Diâmetro interno", "0,61 D", "Raio 30,5 — espessura do traço 19,5."],
  ["Abertura do G", "±32°", "Cunha com vértice em 0,187 D à direita do centro."],
  ["Travessão", "0,195 D", "Mesma espessura do anel; avança até 0,403 D."],
  ["Estaca", "0,152 D", "Fuste de 0,35 D e ponta de 0,15 D."],
  ["Altura total", "1,41 D", "Do topo do anel à ponta cravada."],
] as const;
