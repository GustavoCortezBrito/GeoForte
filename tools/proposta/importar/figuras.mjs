/**
 * Tira do Word da proposta de fundação (GEO 2993A/26) o que não é tabela nem texto corrido:
 *   • as equações (OMML) → dados/fundacao/equacoes.json, em MathML (para o PDF) e no OMML original
 *     (para o Word editável), na ordem do documento;
 *   • as figuras do memorial e as fotos do anexo → assets/fundacao/.
 *
 *   node importar/figuras.mjs "<proposta>.docx"
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import { ommlParaMathML, ommlTexto } from "./omml.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const docx = process.argv[2];
if (!docx) throw new Error('Uso: node importar/figuras.mjs "<proposta>.docx"');
const zip = await JSZip.loadAsync(readFileSync(docx));

// ─── Equações ─────────────────────────────────────────────────────────────────────────────────
const xml = await zip.file("word/document.xml").async("string");
const equacoes = [...xml.matchAll(/<m:oMath>[\s\S]*?<\/m:oMath>/g)].map((m) => {
  const antes = xml.slice(Math.max(0, m.index - 4000), m.index);
  const bloco = /<m:oMathPara>(?:(?!<\/m:oMathPara>)[\s\S])*$/.test(antes);
  return { texto: ommlTexto(m[0]).replace(/\s+/g, " ").trim(), bloco, mathml: ommlParaMathML(m[0], { bloco }), omml: m[0] };
});
mkdirSync(join(raiz, "dados", "fundacao"), { recursive: true });
writeFileSync(join(raiz, "dados", "fundacao", "equacoes.json"), JSON.stringify(equacoes, null, 1));
console.log(`${equacoes.length} equações`);

// ─── Figuras e fotos (nomes das imagens no Word → nomes no projeto) ─────────────────────────────
const FIGURAS = {
  "image4.png": "figuras/nbr6118-tabela-6-1.png",
  "image5.png": "figuras/nbr6122-tabela-4.png",
  "image6.jpeg": "figuras/locacao-sondagens.jpg",
  "image7.jpeg": "figuras/sondagem-sp-01a.jpg",
  "image8.jpeg": "figuras/sondagem-sp-02b.jpg",
  "image9.jpeg": "figuras/sondagem-sp-03c.jpg",
  "image10.jpeg": "figuras/sondagem-sp-04d.jpg",
  "image11.jpeg": "figuras/sondagem-sp-05e.jpg",
  "image27.png": "figuras/armacao-300-4m.png",
  "image28.png": "figuras/armacao-300-6m.png",
  "image29.png": "figuras/armacao-400-4m.png",
  "image30.png": "figuras/armacao-400-6m.png",
  "image31.jpeg": "obras/villaggio-jardins.jpg",
  "image32.jpeg": "obras/pocos-carmopolis.jpg",
  "image33.jpeg": "obras/beach-class-jagauribe.jpg",
  "image34.jpeg": "obras/adorato-cabula.jpg",
};
for (const [de, para] of Object.entries(FIGURAS)) {
  const arq = zip.file(`word/media/${de}`);
  if (!arq) throw new Error(`Imagem ${de} não está no Word: a numeração das imagens mudou. Reveja FIGURAS em importar/figuras.mjs.`);
  const destino = join(raiz, "assets", "fundacao", para);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, await arq.async("nodebuffer"));
}
console.log(`${Object.keys(FIGURAS).length} imagens em assets/fundacao/`);
