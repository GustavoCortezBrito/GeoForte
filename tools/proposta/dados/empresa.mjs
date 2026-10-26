/**
 * Dados compartilhados por todas as partes do documento.
 * Fonte: proposta original GEO 2701A/25 (Word, 23/10/2026) e BRIEFING.md.
 */

export const proposta = {
  codigo: "GEO 2701A/25",
  /** Duas linhas à direita do cabeçalho de todas as páginas (BRIEFING). */
  cabecalho: ["PROPOSTA GEO 2701A/25", "EXPANSÃO GRAND PALLADIUM IMBASSAÍ"],
  cidadeData: "Salvador, 23 de outubro de 2026.",
  emissao: "23 de outubro de 2026",
  /** Capa do PDF e topo da proposta web (texto da carta e das cláusulas 1.3 e 10). */
  obra: "Expansão Grand Palladium Resort & Spa",
  localObra: "Rodovia BA-099, Km 65, S/N · Imbassaí, Mata de São João – BA",
  cliente: "Grand Palladium",
  atencao: "Sr. Saulo Cotrim",
  validade: "30 dias",
};

export const empresa = {
  razaoSocial: "Geofor Obras de Fundações Ltda",
  cnpj: "26.214.785/0001-99",
  endereco: "Av. Luís Viana Filho, 13145 · Hangar Business Park, Hangar 6, Sl. 419",
  cidade: "São Cristóvão · Salvador – BA",
  // A proposta original lista três números; o BRIEFING do anexo citava só os dois primeiros.
  telefones: ["(71) 99708-2005", "(71) 3341-2918", "(71) 99708-2008"],
  email: "projetos@geoforte.com.br",
};

export const config = {
  /**
   * A proposta original marca em amarelo as cláusulas 2.22, 4 (inteira), 5.1, 5.2,
   * 7.5, 7.6 e 8.4 a 8.7 — ao que tudo indica, o que mudou nesta revisão "A".
   * false: documento limpo para o cliente. true: essas cláusulas aparecem com fundo
   * laranja-claro e a etiqueta "Revisado", e o sumário ganha uma nota explicando.
   */
  marcarRevisoes: false,
};
