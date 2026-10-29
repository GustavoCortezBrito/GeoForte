/**
 * Word editável no mesmo desenho do PDF. Mesma ordem e as mesmas seções de página:
 *
 *   capa (grafite, sem moldura) → sumário (moldura sem número) → carta, cláusulas, assinaturas e
 *   memorial (moldura, Pág. 1…) → abertura do anexo (grafite) → obras (moldura, A.2…) → certificado
 *
 * Fontes da marca embutidas no arquivo; equações como equações do Word; números do sumário como
 * campos de página (Word: selecionar tudo e F9 atualiza, se o texto mudar de página).
 */
import { Document, Footer, Header, Packer, Paragraph, Table } from "docx";
import { entradasSumario } from "../frente.mjs";
import { COR, UTIL, borda, cel, fontesEmbutidas, imagem, mm, par, posProcessar, tabela, txt } from "./base.mjs";
import { cabecalho, rodape } from "./moldura.mjs";
import { capaWord, sumarioWord } from "./frente.mjs";
import { assinaturaWord, cartaWord, numeracaoListas, secaoWord, tituloSecao } from "./corpo.mjs";
import { memorialWord } from "./memorial.mjs";
import { aberturaWord, paginasAnexoWord } from "./anexo.mjs";

const A4 = { width: mm(210), height: mm(297) };

/** Duas tabelas encostadas viram uma só no Word: entre elas vai um parágrafo de 1 pt. */
const separarTabelas = (lista) =>
  lista.flatMap((x, i) => (x instanceof Table && lista[i + 1] instanceof Table ? [x, new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: "exact" } })] : [x]));
/** Cabeçalho/rodapé vazios das páginas de sangria: um parágrafo de 1 pt, que não empurra o texto. */
const minimo = () => new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: "exact" } });
const vazio = () => ({ default: new Header({ children: [minimo()] }) });
const vazioRod = () => ({ default: new Footer({ children: [minimo()] }) });
/** Página com moldura: margens do @page do PDF (32 / 31 / 18 mm). */
const comMoldura = { top: mm(32), bottom: mm(31), left: mm(18), right: mm(18), header: mm(10.5), footer: mm(7) };
/** Página inteira (capa, abertura, certificado). */
const sangria = { top: 0, bottom: 0, left: mm(18), right: mm(18), header: 0, footer: 0 };

const estilos = {
  default: {
    // corpo 1 pt: os parágrafos vazios (fim de seção, células) não ocupam espaço; todo texto tem tamanho próprio
    document: { run: { font: "Manrope", size: 2, color: COR.g }, paragraph: { spacing: { before: 0, after: 0 } } },
  },
};

/**
 * @param pacote pacote de dados (src/pacote.mjs)
 * @param m      medidas e imagens do HTML (medidas.mjs)
 */
export async function montarWord(pacote, m) {
  const { proposta, empresa, carta, secoes, assinatura, memorial, anexo } = pacote;
  const cab = { default: cabecalho(proposta, m.logo) };
  const cont = {};

  const corpo = [...cartaWord(proposta, carta)];
  for (const s of secoes) corpo.push(...secaoWord(s, m, cont));
  corpo.push(...assinaturaWord(assinatura));
  corpo.push(...(await memorialWord(memorial, m, cont)));

  const doc = new Document({
    creator: "Geoforte",
    title: pacote.saida.titulo,
    subject: pacote.saida.assunto,
    description: "Gerado dos mesmos dados do PDF (tools/proposta).",
    fonts: fontesEmbutidas(),
    styles: estilos,
    numbering: { config: numeracaoListas },
    sections: [
      { properties: { page: { size: A4, margin: sangria } }, headers: vazio(), footers: vazioRod(), children: separarTabelas(capaWord(pacote, m)) },
      {
        properties: { page: { size: A4, margin: comMoldura } },
        headers: cab,
        footers: { default: rodape(empresa, null) },
        children: sumarioWord(pacote, entradasSumario(), m.paginas),
      },
      {
        properties: { page: { size: A4, margin: comMoldura, pageNumbers: { start: 1 } } },
        headers: cab,
        footers: { default: rodape(empresa, "pagina") },
        children: separarTabelas(corpo),
      },
      { properties: { page: { size: A4, margin: sangria } }, headers: vazio(), footers: vazioRod(), children: separarTabelas(aberturaWord(pacote, m)) },
      {
        properties: { page: { size: A4, margin: comMoldura, pageNumbers: { start: 2 } } },
        headers: cab,
        footers: { default: rodape(empresa, { prefixo: `${anexo.letra}.` }) },
        children: separarTabelas(paginasAnexoWord(pacote, m)),
      },
      {
        properties: { page: { size: A4, margin: { top: 0, bottom: 0, left: 0, right: 0, header: 0, footer: 0 } } },
        headers: vazio(),
        footers: vazioRod(),
        children: [new Paragraph({ children: [imagem(m.certificado, { larg: 210, alt: 297, nome: "Certificado GeoSelos", flutuante: true })] })],
      },
    ],
  });
  return posProcessar(await Packer.toBuffer(doc));
}

/** Arquivo à parte, para a equipe decidir: pontos de atenção (com coluna de decisão) e correções. */
export async function montarRevisao(pacote, m) {
  const { proposta, empresa, revisao } = pacote;
  const cabT = (h) => cel([par(txt(h, { fonte: "mono", negrito: true, tam: 8.4, cor: COR.branco }), { tam: 8.4 })], { fundo: COR.g, margem: { t: 1.9, b: 1.9, e: 2.6, d: 2.6 } });
  const c = (t, o = {}) => cel([par(txt(t, { tam: 9, ...o }), { tam: 9, fator: 1.45 })], { bordas: { base: borda() }, margem: { t: 1.9, b: 1.9, e: 2.6, d: 2.6 } });
  const doc = new Document({
    creator: "Geoforte",
    title: `Proposta ${proposta.codigo} — pontos de atenção`,
    fonts: fontesEmbutidas(),
    styles: estilos,
    sections: [
      {
        properties: { page: { size: A4, margin: comMoldura } },
        headers: { default: cabecalho(proposta, m.logo) },
        footers: { default: rodape(empresa, null) },
        children: [
          ...tituloSecao("", "Pontos de atenção", { antes: 0 }),
          par(txt("Itens que pedem uma decisão da equipe antes do envio. No texto da proposta eles foram mantidos como estavam no original.", { cor: COR.g2 }), { antes: 3.5, depois: 3 }),
          tabela({
            larguras: [10, UTIL - 60, 50],
            linhas: [{ cabecalho: true, celulas: ["#", "Ponto", "Decisão"].map(cabT) }, ...revisao.pontos.map((p, i) => ({ celulas: [c(String(i + 1), { fonte: "mono", negrito: true }), c(p), c("")] }))],
          }),
          ...tituloSecao("", "Correções já aplicadas ao texto"),
          par(txt("Digitação, pontuação, concordância e regência, sem mudar o sentido. Já estão no PDF e no Word da proposta.", { cor: COR.g2 }), { antes: 3.5, depois: 3 }),
          tabela({
            larguras: [34, (UTIL - 34) / 2, (UTIL - 34) / 2],
            linhas: [{ cabecalho: true, celulas: ["Onde", "Original", "Corrigido"].map(cabT) }, ...revisao.correcoes.map((x) => ({ celulas: [c(x.onde, { negrito: true }), c(x.original), c(x.corrigido)] }))],
          }),
        ],
      },
    ],
  });
  return posProcessar(await Packer.toBuffer(doc));
}
