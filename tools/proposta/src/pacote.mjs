/**
 * Pacote de dados da proposta em geração. Cada proposta é um pacote em dados/:
 *
 *   contencao  (padrão)  GEO 2701A/25 — contenções em estacas justapostas
 *   fundacao             GEO 2993A/26 — fundações em hélice contínua e estacas metálicas
 *
 * Escolha com --proposta=fundacao (npm run gerar:fundacao) ou com a variável PROPOSTA.
 *
 * O pacote reúne tudo o que muda de uma proposta para outra: textos, memorial, anexo, capa e nomes
 * de arquivo. O restante (estilos, moldura, paginação, sumário) é o mesmo modelo para as duas.
 */
const registro = {
  contencao: () => import("../dados/contencao.mjs"),
  fundacao: () => import("../dados/fundacao/index.mjs"),
};

export const id = process.argv.find((a) => a.startsWith("--proposta="))?.split("=")[1] ?? process.env.PROPOSTA ?? "contencao";
if (!registro[id]) throw new Error(`PROPOSTA="${id}" não existe. Use: ${Object.keys(registro).join(" ou ")}.`);

/** @type {import("../dados/contencao.mjs").default} */
export const pacote = (await registro[id]()).default;
export const { proposta, empresa, numerosGeoforte, config, carta, secoes, assinatura, memorial, anexo, capa, revisao } = pacote;
