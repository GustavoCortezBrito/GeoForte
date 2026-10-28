/**
 * Pacote da proposta GEO 2993A/26 (fundações em hélice contínua monitorada e estacas metálicas).
 * Fonte: Word “Proposta GEO 2993A-26 - FUND - Hélice e Metálica - GRAND PALLADIUM - 28.10.26 (Em Rev)”.
 * Ver src/pacote.mjs.
 */
import { empresa, numerosGeoforte, config } from "../empresa.mjs";
import { proposta, carta, secoes, assinatura, CORRECOES, PONTOS_DE_ATENCAO } from "./proposta.mjs";
import { memorial } from "./memorial.mjs";
import * as dadosObras from "./obras.mjs";

const pacote = {
  id: "fundacao",
  proposta,
  empresa,
  numerosGeoforte,
  config,

  /** Capa e sumário. Todos os números vêm do texto da proposta (cláusulas 1.3, 1.4 e 8.3). */
  capa: {
    data: "27 · 10 · 2026",
    titulo: "Fundações em estacas hélice contínua e metálicas",
    subtitulo: "Projeto executivo geotécnico e execução global",
    fatos: [
      { valor: "968", rotulo: "estacas no projeto global: 885 hélice contínua e 83 metálicas" },
      { valor: "5", rotulo: "módulos: Piscinas, Recepção, H01, H02 e H03" },
      { valor: "66 dias", rotulo: "úteis para as hélice contínua, com 2 equipamentos" },
      { valor: "15 dias", rotulo: "úteis para as metálicas, com 1 equipamento" },
    ],
  },
  sumario: {
    lead: "Proposta técnica e comercial para o projeto e a execução global das fundações em estacas hélice contínua monitorada e estacas metálicas da Expansão Grand Palladium Resort & Spa.",
  },

  carta,
  secoes,
  assinatura,
  /** Para quem revisa: o que foi corrigido no texto e o que precisa de decisão (vai no Word editável). */
  revisao: { correcoes: CORRECOES, pontos: PONTOS_DE_ATENCAO },
  memorial,
  anexo: { tipo: "fundacao", letra: "A", ...dadosObras },

  saida: {
    arquivo: "Proposta GEO 2993A-26 - Fundação - Grand Palladium",
    titulo: `Proposta ${proposta.codigo} — Fundações em estacas hélice contínua e metálicas — Expansão Grand Palladium`,
    assunto: "Proposta técnica e comercial: projeto e execução global das fundações em estacas hélice contínua monitorada e estacas metálicas",
    copiaWeb: null,
  },
};

export default pacote;
