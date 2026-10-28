/**
 * Gera o Word editável da proposta (texto para revisão), dos mesmos dados do PDF.
 *
 *   npm run docx              → saida/Proposta GEO 2701A-25 - Grand Palladium (texto para revisão).docx
 *   npm run docx:fundacao     → saida/Proposta GEO 2993A-26 - Fundação - Grand Palladium (texto para revisão).docx
 *
 * Volta para o PDF assim: a equipe edita o Word; compare com o Word original da pasta saida
 * (node importar/docx.mjs <arquivo> imprime o texto, um bloco por linha) e passe as mudanças para
 * dados/ — o PDF sai de lá.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { raiz } from "./src/util.mjs";
import { pacote } from "./src/pacote.mjs";
import { montarWord } from "./src/word.mjs";

const saida = join(raiz, "saida");
mkdirSync(saida, { recursive: true });
const arquivo = join(saida, `${pacote.saida.arquivo} (texto para revisão).docx`);
writeFileSync(arquivo, await montarWord(pacote));
console.log("Word:", arquivo);
