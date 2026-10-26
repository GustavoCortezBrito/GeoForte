/**
 * Conteúdo do Anexo B — Obras executadas (proposta GEO 2701A/25).
 * Empresa e cabeçalho ficam em empresa.mjs, compartilhados com o resto do documento.
 *
 * Tudo vem do BRIEFING. Campo ainda sem dado = null: aparece no PDF como
 * placeholder destacado (fundo laranja-claro, borda tracejada), para a
 * Eng. Denise revisar. Para preencher, troque o null pelo texto e rode
 * `npm run gerar` de novo. Não inventar números.
 */

export const abertura = {
  sobretitulo: "ANEXO B",
  titulo: "Obras executadas",
  subtitulo: "Cortinas de estacas justapostas em Salvador",
  texto:
    "Seleção de contenções executadas pela Geoforte com a mesma solução prevista para a " +
    "expansão do Grand Palladium Imbassaí: cortinas de estacas justapostas, com vigas de " +
    "coroamento, em terrenos litorâneos e junto a edificações existentes.",
};

/**
 * Ordem proposital (briefing): Mana Kai e Nouvelle Blues primeiro — orla e
 * vizinhança construída, mais parecidas com a obra do resort.
 *
 * complemento: `confirmar: true` = valor ainda a confirmar (obras 03 e 04).
 */
export const obras = [
  {
    numero: "01",
    nome: "Mana Kai",
    construtora: "São Conrado Empreendimentos",
    bairro: null,
    ano: null,
    fotoPrincipal: { arquivo: "manakai-vigas-1.jpg", legenda: "Cortina de estacas justapostas concluída" },
    fotoDetalhe: { arquivo: "manakai-vigas-2.jpg", legenda: "Vigas de coroamento" },
    ficha: {
      solucao: "Cortina de estacas justapostas",
      complemento: { valor: "Vigas de coroamento", confirmar: false },
      areaContencao: null, // formato: área + " m²"
      alturaEscavacao: null, // formato: altura + " m"
      estacas: null, // formato: quantidade + " × Ø " + diâmetro + " cm"
      execucao: null, // formato: "mês/ano – mês/ano"
    },
    destaque: null,
  },
  {
    numero: "02",
    nome: "Nouvelle Blues",
    construtora: "André Guimarães",
    bairro: null,
    ano: null,
    fotoPrincipal: { arquivo: "nouvelle-1.jpg", legenda: "Execução da cortina junto a edificações vizinhas" },
    fotoDetalhe: { arquivo: "nouvelle-vigas-2.jpg", legenda: "Estacas e viga de coroamento" },
    ficha: {
      solucao: "Cortina de estacas justapostas",
      complemento: { valor: "Vigas de coroamento", confirmar: false },
      areaContencao: null,
      alturaEscavacao: null,
      estacas: null,
      execucao: null,
    },
    destaque: null,
  },
  {
    numero: "03",
    nome: "Riserva Vita",
    construtora: "SCR Construtora",
    bairro: null,
    ano: null,
    fotoPrincipal: { arquivo: "riserva-1.jpg", legenda: "Execução das estacas com perfuratriz" },
    fotoDetalhe: { arquivo: "riserva-2.jpg", legenda: "Movimentação de armaduras" },
    ficha: {
      solucao: "Cortina de estacas justapostas",
      complemento: { valor: "Vigas de coroamento", confirmar: true },
      areaContencao: null,
      alturaEscavacao: null,
      estacas: null,
      execucao: null,
    },
    destaque: null,
  },
  {
    numero: "04",
    nome: "Imbuí Class",
    construtora: "BTS Empreendimentos",
    bairro: null,
    ano: null,
    fotoPrincipal: { arquivo: "imbui-2.jpg", legenda: "Cortina concluída em planta curva" },
    fotoDetalhe: { arquivo: "imbui-1.jpg", legenda: "Perfuratriz em operação na encosta" },
    ficha: {
      solucao: "Cortina de estacas justapostas",
      complemento: { valor: "Vigas de coroamento", confirmar: true },
      areaContencao: null,
      alturaEscavacao: null,
      estacas: null,
      execucao: null,
    },
    destaque: null,
  },
];

/** Texto mostrado em cada placeholder enquanto o campo estiver null. */
export const placeholders = {
  bairro: "[bairro]",
  ano: "[ano]",
  areaContencao: "[— m²]",
  alturaEscavacao: "[— m]",
  estacas: "[nº] × Ø [—] cm",
  execucao: "[mês/ano] – [mês/ano]",
  destaque: "[Uma frase sobre o desafio e a solução desta obra]",
};
