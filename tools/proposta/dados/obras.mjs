/**
 * Conteúdo do Anexo B — Obras executadas (proposta GEO 2701A/25).
 * Empresa e cabeçalho ficam em empresa.mjs, compartilhados com o resto do documento.
 *
 * Textos do BRIEFING. Campo ainda sem dado = null: aparece no PDF como
 * placeholder destacado (fundo laranja-claro, borda tracejada), para a
 * Eng. Denise revisar. Para preencher, troque o null pelo texto e rode
 * `npm run gerar` de novo. Não inventar números.
 *
 * Fotos: originais enviados pela equipe por WhatsApp em 26/10/2026 (até
 * 1600 px), em assets/fotos; a origem de cada uma está gravada no arquivo.
 * `fotos[0]` é a principal. `pdf` escolhe as fotos da página do PDF (a 1ª vai
 * grande, as outras ao lado). Na proposta web todas entram na galeria.
 * As legendas descrevem só o que se vê na foto. `foco` (opcional) é o ponto da
 * foto que não pode sair do recorte (CSS object-position).
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
    cenario: "Orla marítima, entre edificações vizinhas",
    // manakai-01 e -02: a mensagem diz "As duas últimas Mana Kai". São os originais
    // sem tratamento de documento/fotos/manakai-1.jpg e -2.jpg (proibidas pelo briefing).
    fotos: [
      { arquivo: "manakai-01.jpg", etapa: "execucao", legenda: "Execução das estacas com perfuratriz, junto à orla", foco: "68% 50%" },
      { arquivo: "manakai-02.jpg", etapa: "escavacao", legenda: "Escavação interna com a cortina já executada" },
      { arquivo: "manakai-03.jpg", etapa: "execucao", legenda: "Perfuratriz entre as edificações vizinhas" },
      { arquivo: "manakai-04.jpg", etapa: "execucao", legenda: "Perfuratriz junto à cortina" },
      { arquivo: "manakai-05.jpg", etapa: "execucao", legenda: "Operação da perfuratriz" },
      { arquivo: "manakai-06.jpg", etapa: "execucao", legenda: "Perfuratriz e escavadeira na frente de trabalho" },
      { arquivo: "manakai-07.jpg", etapa: "execucao", legenda: "Perfuratriz e mangote na frente de trabalho" },
      { arquivo: "manakai-08.jpg", etapa: "escavacao", legenda: "Escavação com a cortina ao fundo" },
      { arquivo: "manakai-09.jpg", etapa: "vigas", legenda: "Vigas de coroamento" },
      { arquivo: "manakai-10.jpg", etapa: "concluida", legenda: "Cortina de estacas justapostas concluída" },
      { arquivo: "manakai-11.jpg", etapa: "concluida", legenda: "Vista geral da cortina executada" },
      { arquivo: "manakai-12.jpg", etapa: "vigas", legenda: "Cortina com viga de coroamento" },
    ],
    pdf: [0, 2, 8, 9, 5],
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
    cenario: "Escavação colada a edificações existentes",
    fotos: [
      { arquivo: "nouvelle-01.jpg", etapa: "execucao", legenda: "Execução da cortina junto a edificações vizinhas" },
      { arquivo: "nouvelle-02.jpg", etapa: "vigas", legenda: "Estacas e viga de coroamento" },
      { arquivo: "nouvelle-03.jpg", etapa: "concluida", legenda: "Cortina junto à edificação vizinha" },
    ],
    pdf: [0, 1, 2],
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
    cenario: "Escavação profunda, com perfuratriz em operação",
    fotos: [
      { arquivo: "riserva-01.jpg", etapa: "execucao", legenda: "Execução das estacas com perfuratriz" },
      { arquivo: "riserva-02.jpg", etapa: "execucao", legenda: "Movimentação de armaduras" },
      { arquivo: "riserva-03.jpg", etapa: "escavacao", legenda: "Escavação com a cortina executada" },
    ],
    // As três vieram no fim do álbum "Nouvelle Blues", mas o briefing atribui as cenas
    // à Riserva Vita (outra obra: solo vermelho, parede cinza). Confirmar com a equipe.
    fotosConfirmar: true,
    pdf: [0, 1, 2],
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
    cenario: "Encosta, com cortina em planta curva",
    fotos: [
      { arquivo: "imbui-01.jpg", etapa: "concluida", legenda: "Cortina concluída em planta curva" },
      { arquivo: "imbui-02.jpg", etapa: "execucao", legenda: "Perfuratriz em operação na encosta" },
    ],
    pdf: [0, 1],
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

/**
 * Etapas da execução de uma cortina, na ordem em que acontecem. Uma etapa só aparece
 * preenchida na obra que tem foto dela (`etapa` em cada foto) — nada é afirmado sem registro.
 */
export const etapas = [
  { id: "execucao", nome: "Perfuração e armação" },
  { id: "escavacao", nome: "Escavação" },
  { id: "vigas", nome: "Vigas de coroamento" },
  { id: "concluida", nome: "Cortina concluída" },
];

/**
 * Linha do Grand Palladium no comparativo. Cada valor vem da própria proposta:
 * cláusula 4.2 (complexo hoteleiro pré-existente), 8.4 (solo litorâneo) e 3.8 (vigas a cargo da Contratante).
 */
export const grandPalladium = {
  nome: "Grand Palladium",
  cenario: "Complexo hoteleiro existente, em solo litorâneo",
  solucao: "Cortinas de estacas justapostas",
  complemento: "Vigas de coroamento a cargo da Contratante (cl. 3.8)",
};

/** Texto mostrado em cada placeholder enquanto o campo estiver null. */
export const placeholders = {
  bairro: "[bairro]",
  ano: "[ano]",
  areaContencao: "[— m²]",
  alturaEscavacao: "[— m]",
  estacas: "[nº] × Ø [—] cm",
  execucao: "[mês/ano] – [mês/ano]",
  destaque: "[Uma frase sobre o desafio e a solução desta obra]",
  fotosConfirmar: "[confirmar: as fotos vieram no álbum da Nouvelle Blues]",
};
