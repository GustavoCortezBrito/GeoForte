/**
 * Dados extraídos do Word da proposta GEO 2993A/26 (importar/tabelas.mjs e importar/figuras.mjs):
 *   tabelas.json  — as planilhas coladas no Word como imagem (preços, sondagens, estaqueamento…);
 *   equacoes.json — as equações do memorial, já em MathML.
 * Não editar à mão: rode `npm run importar:fundacao` de novo se o Word mudar.
 */
import { readFileSync } from "node:fs";

const ler = (nome) => JSON.parse(readFileSync(new URL(nome, import.meta.url), "utf8"));

export const tabelas = ler("./tabelas.json");
export const equacoes = ler("./equacoes.json");

/** MathML da equação n (ordem em que aparecem no Word). Unidade escrita “KN” no Word vira “kN”. */
export const eq = (n) => {
  if (!equacoes[n]) throw new Error(`Equação ${n} não existe em equacoes.json (${equacoes.length} equações).`);
  return equacoes[n].mathml.replaceAll(">KN<", ">kN<");
};
