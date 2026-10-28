/**
 * Anexo — Obras executadas (proposta GEO 2993A/26, fundações).
 *
 * Nome da obra, parceiro ou cliente e a foto vêm do anexo do Word da proposta (uma foto por obra,
 * em assets/fundacao/obras). As legendas descrevem só o que se vê na foto e a equipe pode trocá-las.
 * `foco` (opcional) é o ponto da foto que não pode sair do recorte (CSS object-position);
 * `focoCartao` é o mesmo para o cartão da página de abertura, que é bem mais largo que alto.
 *
 * `ficha` é opcional: se a equipe passar dados da obra, basta listar pares [rótulo, valor] e eles
 * aparecem numa régua abaixo da foto, no mesmo desenho da proposta de contenção. Exemplo:
 *   ficha: [["Local", "Salvador – BA"], ["Ano", "2025"], ["Estacas", "120 × Ø 30 cm"]]
 * Não inventar números: sem dado, deixar `ficha: null` (nada aparece no PDF).
 */

export const abertura = {
  sobretitulo: "ANEXO",
  titulo: "Obras executadas",
  subtitulo: "Fundações em estacas hélice contínua monitorada e estacas metálicas",
  texto:
    "Obras de fundações em estacas hélice contínua monitorada e estacas metálicas executadas pela " +
    "Geoforte, com os parceiros e clientes de cada uma.",
};

export const obras = [
  {
    numero: "01",
    nome: "Villaggio Jardins",
    papel: "Parceiro",
    parceiro: "Sian Engenharia",
    foto: {
      arquivo: "fundacao/obras/villaggio-jardins.jpg",
      legenda: "Equipamentos com torre e perfis metálicos cravados na frente de trabalho",
      foco: "50% 82%",
      focoCartao: "50% 72%",
    },
    ficha: null,
  },
  {
    numero: "02",
    nome: "Poços Carmópolis",
    papel: "Parceiro",
    parceiro: "Carmo Energy",
    foto: {
      arquivo: "fundacao/obras/pocos-carmopolis.jpg",
      legenda: "Estaca metálica tubular no bate-estacas, com marcações de comprimento ao longo do fuste",
      foco: "50% 38%",
      focoCartao: "50% 36%",
    },
    ficha: null,
  },
  {
    numero: "03",
    nome: "Beach Class Jagauribe",
    papel: "Cliente",
    parceiro: "Moura Dubeux",
    foto: {
      arquivo: "fundacao/obras/beach-class-jagauribe.jpg",
      legenda: "Bate-estacas e perfis metálicos na frente de trabalho, com edifícios em construção ao fundo",
      foco: "50% 12%",
      focoCartao: "50% 14%",
    },
    ficha: null,
  },
  {
    numero: "04",
    nome: "Adorato Cabula",
    papel: "Parceiro",
    parceiro: "JVF Empreendimentos",
    foto: {
      arquivo: "fundacao/obras/adorato-cabula.jpg",
      legenda: "Perfuratriz com trado helicoidal em operação, junto à contenção em concreto",
      foco: "50% 22%",
      focoCartao: "50% 8%",
    },
    ficha: null,
  },
];
