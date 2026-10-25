/**
 * Cláusula 11 — Memorial de cálculo (saída do software de cálculo da Geoforte).
 *
 * Os blocos abaixo foram transcritos da proposta original (páginas 9 a 27).
 * As tabelas "Resultados das Fases" (≈ 600 números) foram extraídas
 * automaticamente do PDF original para memorial-resultados.json — não digitar
 * à mão. `npm run verificar` confere todos os números contra o original.
 *
 * Única normalização: o rótulo do software "Fase 3- Escavação" virou
 * "Fase 3 - Escavação".
 */
import { readFileSync } from "node:fs";

const resultados = JSON.parse(readFileSync(new URL("./memorial-resultados.json", import.meta.url), "utf8"));

const FASES = { BERMA: "Fase 1 - Berma", ESCORA: "Fase 2 - Escora", "ESCAVAÇÃO": "Fase 3 - Escavação" };
const nomeFase = (f) => FASES[f.replace(/^Fase \d - /, "")] ?? f;
const comNomes = (lista) => lista.map((f) => ({ ...f, fase: nomeFase(f.fase) }));

/** Iguais nas duas contenções. */
const normas = [
  ["Norma de concreto", "ABNT NBR 6118 (Brasil)"],
  ["Concreto", "C30, usina.rigor"],
  ["Aço", "CA-50 e CA-60"],
  ["Tipo de ambiente", "Tipo III"],
  ["Cobrimento", "6.0 cm"],
  ["Tamanho máximo agregado", "20 mm"],
];
const acoes = [
  ["Majoração esforços em construção", "1.40"],
  ["Majoração esforços em serviço", "1.40"],
  ["Sem análise sísmica", null],
  ["Sem considerar ações térmicas nas escoras", null],
];
const dadosGerais = [
  ["Cota do Térreo", "0.00 m"],
  ["Altura do muro sobre a rasante", "0.00 m"],
  ["Tipologia", "Parede de estacas de concreto"],
];
const terreno = [
  ["Percentagem de atrito interno entre o terreno e o tardoz da cortina", "30.0 %"],
  ["Percentagem de atrito interno entre o terreno e o intradorso da cortina", "30.0 %"],
  ["Profundidade do nível freático", "4.40 m"],
];
const coeficientes = [
  "Ativo tardoz: 0.31",
  "Repouso tardoz: 0.50",
  "Passivo tardoz: 3.95",
  "Ativo intradorso: 0.31",
  "Repouso intradorso: 0.50",
  "Passivo intradorso: 3.95",
];
const estrato = (ref, cota, recalque) => ({
  ref,
  cota,
  descricao: [
    "Densidade aparente: 18.0 kN/m³",
    "Densidade submersa: 10.0 kN/m³",
    "Ângulo atrito interno: 30 graus",
    "Coesão: 0.00 kN/m²",
    `Coef. de recalque empuxo ativo: ${recalque} kN/m³`,
    `Coef. de recalque empuxo passivo: ${recalque} kN/m³`,
    "Gradiente Coef. de recalque: 0.0 kN/m4",
  ],
  coeficientes,
});
const estratos = [estrato("1 - Areia 1", "0.00 m", "10000.0"), estrato("2 - Areia 2", "-4.00 m", "15000.0")];
const geometria = [
  ["Altura total", "8.00 m"],
  ["Diâmetro", "45 cm"],
  ["Distância entre eixos", "0.55 m"],
];

const REFERENCIA = "CONTENCAO GRAND PALLADIUM DOCA (CONTENCAO EM ESTACAS HÉLICE CONTÍNUA - DOCA)";
const NBR = "Norma Brasileira ABNT NBR 6118:2014.";
const verificacoes = (cortante) => [
  { v: "Espaçamento livre mínimo armaduras horizontais:", norma: `${NBR} Artigo 18.3.2.2`, valores: ["Mínimo: 2.4 cm", "Calculado: 14.3 cm"] },
  { v: "Espaçamento máximo armaduras horizontais:", norma: `${NBR} Artigo 18.3.3.2`, valores: ["Máximo: 16.3 cm", "Calculado: 15 cm"] },
  { v: "Diâmetro mínimo armaduras horizontais:", norma: `${NBR} Artigo 18.4.3`, valores: ["Mínimo: 0.5 cm", "Calculado: 0.6 cm"] },
  { v: "Quantidade mínima geométrica vertical:", norma: "Critério Adotado", valores: ["Mínimo: 0.004", "Calculado: 0.00758"] },
  { v: "Quantidade mínima mecânica vertical:", norma: "Norma EHE-08. Artigo 42.3.2 (Flexão simples ou composta)", valores: ["Mínimo: 0.00318", "Calculado: 0.00758"] },
  { v: "Espaçamento livre mínimo armaduras verticais:", norma: `${NBR} Artigo 18.3.2.2`, valores: ["Mínimo: 2 cm", "Calculado: 13.4 cm"] },
  { v: "Espaçamento máximo entre barras: - Armadura vertical:", norma: "Norma EC-2. Artigo 9.3.1.1 (3)", valores: ["Máximo: 25 cm", "Calculado: 15 cm"] },
  { v: "Verificação à flexão composta:", norma: "Verificação realizada por módulo de parede", valores: [] },
  { v: "Verificação ao cortante:", norma: "Artigo 17.4 (norma NBR 6118:2014)", valores: ["Máximo: 151.1 kN", `Calculado: ${cortante}`] },
];

const quantitativos = {
  referencia: "Parede de estacas de concreto",
  linhas: [
    { nome: "Armadura vertical", comprimento: ["", "6x7.88", "47.28"], peso: ["", "6x12.44", "74.64"] },
    { nome: "Armadura horizontal", comprimento: ["53x1.14", "", "60.42"], peso: ["53x0.28", "", "14.80"] },
    { nome: "Totais", comprimento: ["60.42", "47.28", ""], peso: ["14.80", "74.64", "89.44"] },
    { nome: "Total com perdas (10.00%)", comprimento: ["66.46", "52.01", ""], peso: ["16.28", "82.10", "98.38"] },
  ],
};
const resumo = {
  colunas: ["Ø 6.3 mm", "Ø 16.0 mm", "Total"],
  concreto: "C30, usina.rigor",
  linhas: [
    ["Referência: Parede de estacas de concreto", "16.28", "82.10", "98.38", "1.27"],
    ["Totais", "16.28", "82.10", "98.38", "1.27"],
  ],
};

const fase = (n, nome, img, cota, berma) => ({
  ref: `Fase ${n}`,
  nome,
  img,
  descricao: [
    "Tipo de fase: Construtiva",
    `Cota de escavação: ${cota}`,
    ...(berma ? [`Altura da berma: ${berma}`, "Ângulo do talude: 30 graus", `Distância ao coroamento do talude: ${berma}`] : []),
    "Com nível freático tardoz até à cota: -4.40 m",
    "Com nível freático intradorso até à cota: -4.40 m",
  ],
});

export const memorial = {
  n: "11",
  titulo: "Memorial de cálculo",
  contencoes: [
    {
      n: "11.1",
      titulo: "Contenção da Doca",
      normas,
      acoes,
      dadosGerais,
      terreno,
      estratos,
      secao: "memorial/doca-secao.png",
      geometria,
      fases: [
        fase(1, "Fase 1 - Berma", "memorial/doca-fase1.png", "-3.90 m", "2.00 m"),
        fase(2, "Fase 2 - Escora", "memorial/doca-fase2.png", "-3.90 m", "2.00 m"),
        fase(3, "Fase 3 - Escavação", "memorial/doca-fase3.png", "-3.90 m", null),
      ],
      cargas: {
        titulo: "Cargas no tardoz",
        linhas: [["Uniforme", "Na superfície", "Valor: 10 kN/m²", "Fase 1 - Berma", "Fase 3 - Escavação"]],
      },
      escoras: [{ descricao: ["Cota: 0.00 m", "Rigidez axial: 9800000 kN/m", "Distância: 1.7 m"], inicial: "Fase 2 - Escora", final: "Fase 3 - Escavação" }],
      resultados: comNomes(resultados.doca),
      apoio: {
        titulo: "Esforços sem majorar – Escoras",
        cota: "Cota: 0.00 m",
        linhas: [
          ["Fase 2 - Escora", ["Carga concentrada: 0.00 kN", "Carga linear: 0.00 kN/m"]],
          ["Fase 3 - Escavação", ["Carga concentrada: 43.15 kN", "Carga linear: 26.15 kN/m"]],
        ],
      },
      armadura: { vertical: "6 Ø 16.0 mm", horizontal: "Ø 6.3 mm c/ 15 cm" },
      referencia: REFERENCIA,
      verificacoes: verificacoes("24.6 kN"),
      informacao: [
        "Seção crítica à flexão composta: Cota: -2.50 m, Md: -32.02 kN·m, Nd: 0.00 kN, Vd: -2.59 kN, Tensão máxima do aço: 225.556 MPa",
        "Seção crítica ao esforço cortante: Cota: -4.50 m",
        "A verificação do estado limite de fissuração não se realizou, porque não se definiu nenhuma fase de serviço",
        "Os esforços são majorados e por estaca (Diâmetro: 45 cm)",
      ],
      estabilidade: {
        coeficientes: {
          letra: "A",
          criterios: [
            {
              titulo: "Relação entre o momento originado pelos empuxos passivos no intradorso e o momento originado pelos empuxos ativos no tardoz:",
              minimo: "Mínimo: 1.5",
              grupo: "Hipótese básica:",
              fases: [["Fase 1 - Berma:", "1.653"], ["Fase 2 - Escora:", "3.021"], ["Fase 3 - Escavação:", "2.764"]],
            },
            {
              titulo: "Relação entre o empuxo passivo total no intradorso e o empuxo realmente mobilizado:",
              minimo: "Mínimo: 1.5",
              grupo: "Hipótese básica:",
              fases: [["Fase 1 - Berma:", "2.088"], ["Fase 2 - Escora:", "2.088"], ["Fase 3 - Escavação:", "2.345"]],
            },
          ],
        },
        circulo: {
          letra: "B",
          criterios: [
            {
              titulo: "Círculo de deslizamento desfavorável:",
              minimo: "Mínimo: 1.5",
              grupo: "Combinações sem sismo:",
              fases: [
                ["Fase 1 - Berma: Coordenadas do centro do círculo (-2.54 m ; 3.01 m) - Raio: 11.31 m:", "2.26"],
                ["Fase 2 - Escora: Coordenadas do centro do círculo (-2.54 m ; 3.01 m) - Raio: 11.31 m:", "2.26"],
                ["Fase 3 - Escavação: Coordenadas do centro do círculo (-2.54 m ; 3.01 m) - Raio: 11.31 m:", "2.26"],
              ],
            },
          ],
        },
      },
      quantitativos,
      resumo,
    },
    {
      n: "11.2",
      titulo: "Contenção Recepção e Túnel",
      normas,
      acoes,
      dadosGerais,
      terreno,
      estratos,
      secao: "memorial/recepcao-secao.png",
      geometria,
      fases: [
        fase(1, "Fase 1 - Berma", "memorial/recepcao-fase1.png", "-3.00 m", "1.50 m"),
        fase(2, "Fase 2 - Escora", "memorial/recepcao-fase2.png", "-3.10 m", "1.50 m"),
        fase(3, "Fase 3 - Escavação", "memorial/recepcao-fase3.png", "-3.00 m", null),
      ],
      // O original não traz cargas, escoras nem esforços nos apoios para esta contenção.
      cargas: null,
      escoras: null,
      resultados: comNomes(resultados.recepcao),
      apoio: null,
      armadura: { vertical: "6 Ø 16.0 mm", horizontal: "Ø 6.3 mm c/ 15 cm" },
      referencia: REFERENCIA,
      verificacoes: verificacoes("28.6 kN"),
      informacao: [
        "Seção crítica à flexão composta: Cota: -4.50 m, Md: 59.10 kN·m, Nd: 0.00 kN, Vd: 3.02 kN, Tensão máxima do aço: 420.931 MPa",
        "Seção crítica ao esforço cortante: Cota: -3.50 m",
        "A verificação do estado limite de fissuração não se realizou, porque não se definiu nenhuma fase de serviço",
        "Os esforços são majorados e por estaca (Diâmetro: 45 cm)",
      ],
      estabilidade: {
        coeficientes: {
          letra: "C",
          criterios: [
            {
              titulo: "Relação entre o momento originado pelos empuxos passivos no intradorso e o momento originado pelos empuxos ativos no tardoz:",
              minimo: "Mínimo: 2",
              grupo: "Hipótese básica:",
              fases: [["Fase 1 - Berma:", "2.646"], ["Fase 2 - Escora:", "2.646"], ["Fase 3 - Escavação:", "2.248"]],
            },
            {
              titulo: "Relação entre o empuxo passivo total no intradorso e o empuxo realmente mobilizado:",
              minimo: "Mínimo: 1.5",
              grupo: "Hipótese básica:",
              fases: [["Fase 1 - Berma:", "3.151"], ["Fase 2 - Escora:", "3.151"], ["Fase 3 - Escavação:", "3.255"]],
            },
          ],
        },
        circulo: {
          letra: "D",
          criterios: [
            {
              titulo: "Círculo de deslizamento desfavorável:",
              minimo: "Mínimo: 1.5",
              grupo: "Combinações sem sismo:",
              fases: [
                ["Fase 1 - Berma: Coordenadas do centro do círculo (-1.95 m ; 3.04 m) - Raio: 11.21 m:", "3.193"],
                ["Fase 2 - Escora: Coordenadas do centro do círculo (-1.95 m ; 3.04 m) - Raio: 11.21 m:", "3.193"],
                ["Fase 3 - Escavação: Coordenadas do centro do círculo (-1.95 m ; 3.04 m) - Raio: 11.21 m:", "3.193"],
              ],
            },
          ],
        },
      },
      quantitativos,
      resumo,
    },
  ],
};
