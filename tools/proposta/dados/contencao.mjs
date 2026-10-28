/**
 * Pacote da proposta GEO 2701A/25 (contenções em estacas justapostas). Os dados continuam nos
 * arquivos de sempre (a proposta web importa esses mesmos arquivos); aqui eles só são reunidos
 * no formato que o gerador espera. Ver src/pacote.mjs.
 */
import { proposta, empresa, numerosGeoforte, config } from "./empresa.mjs";
import { carta, secoes, assinatura, CORRECOES, PONTOS_DE_ATENCAO } from "./proposta.mjs";
import { memorial } from "./memorial.mjs";
import * as dadosObras from "./obras.mjs";

const pacote = {
  id: "contencao",
  proposta,
  empresa,
  numerosGeoforte,
  config,

  /** Capa e sumário. Todos os números vêm do texto da proposta (cláusulas 1.3, 1.4, 2.22 e 8.3). */
  capa: {
    data: "23 · 10 · 2026",
    titulo: "Contenções em estacas justapostas",
    subtitulo: "Projeto executivo geotécnico e execução global",
    fatos: [
      { valor: "7.468,0 m²", rotulo: "de contenção no projeto global" },
      { valor: "6", rotulo: "contenções: 5 subsolos e 1 doca" },
      { valor: "88 dias", rotulo: "úteis de execução estimada, com 2 equipamentos" },
      { valor: "3", rotulo: "equipamentos: 2 perfuratrizes HCM e 1 bate-estacas" },
    ],
  },
  sumario: {
    lead: "Proposta técnica e comercial para o projeto e a execução global das contenções em estacas justapostas da Expansão Grand Palladium Resort & Spa.",
  },

  carta,
  secoes,
  assinatura,
  /** Para quem revisa: o que foi corrigido no texto e o que precisa de decisão (vai no Word editável). */
  revisao: { correcoes: CORRECOES, pontos: PONTOS_DE_ATENCAO },
  memorial: { tipo: "contencao", ...memorial },
  anexo: { tipo: "contencao", letra: "B", ...dadosObras },

  saida: {
    arquivo: "Proposta GEO 2701A-25 - Grand Palladium",
    titulo: `Proposta ${proposta.codigo} — Contenções em estacas justapostas — Expansão Grand Palladium`,
    assunto: "Proposta técnica e comercial: projeto e execução global das contenções em estacas justapostas",
    /** Cópia baixada pela proposta web do site (/propostas/grand-palladium). */
    copiaWeb: { pasta: "grand-palladium", arquivo: "Proposta-GEO-2701A-25-Grand-Palladium.pdf" },
  },
};

export default pacote;
