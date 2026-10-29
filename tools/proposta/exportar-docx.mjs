/**
 * Gera o Word editável da proposta no mesmo desenho do PDF (e um arquivo à parte com os pontos de
 * atenção). Rode depois do PDF, porque ele lê o HTML que o gerador imprimiu:
 *
 *   npm run gerar && npm run docx                    → contenção
 *   npm run gerar:fundacao && npm run docx:fundacao  → fundação
 *
 * Saída em saida/: "<proposta>.docx" e "<proposta> - pontos de atenção.docx".
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { raiz } from "./src/util.mjs";
import { pacote } from "./src/pacote.mjs";
import { medir } from "./src/word/medidas.mjs";
import { montarRevisao, montarWord } from "./src/word/index.mjs";

const saida = join(raiz, "saida");
mkdirSync(saida, { recursive: true });
const m = await medir(join(saida, "html", pacote.id));
const arquivo = join(saida, `${pacote.saida.arquivo}.docx`);
writeFileSync(arquivo, await montarWord(pacote, m));
const revisao = join(saida, `${pacote.saida.arquivo} - pontos de atenção.docx`);
writeFileSync(revisao, await montarRevisao(pacote, m));
console.log("Word:", arquivo);
console.log("Pontos de atenção:", revisao);
