/**
 * Texto da proposta GEO 2701A/25: carta e cláusulas 1 a 10.
 *
 * Transcrito da proposta original (Word, 23/10/2026). O conteúdo é o mesmo; só a
 * forma muda. As únicas alterações de texto são as correções listadas em
 * CORRECOES, todas de digitação ou pontuação, sem mudar sentido.
 *
 * Marcação: **negrito**. `rev: true` = trecho marcado em amarelo no original
 * (ver config.marcarRevisoes em empresa.mjs).
 */

export const CORRECOES = [
  { onde: "1.1 b)", original: "b) b) Relatórios de Investigação…", corrigido: "b) Relatórios de Investigação…" },
  { onde: "2.13", original: "retroescavadeira par remoção", corrigido: "retroescavadeira para remoção" },
  { onde: "2.15", original: "Fornecimento do armaduras montadas", corrigido: "Fornecimento das armaduras montadas" },
  { onde: "3.9 e 5.1", original: "fck=30 Mpa / fck = 30 Mpa", corrigido: "fck = 30 MPa" },
  { onde: "4 (introdução)", original: "inerentes a obra", corrigido: "inerentes à obra" },
  { onde: "Foro", original: "Salvador - BA. Para dirimir", corrigido: "Salvador – BA, para dirimir" },
];

/** Trechos mantidos como estão, mas que merecem revisão da equipe Geoforte. */
export const PONTOS_DE_ATENCAO = [
  "5 — A “Tabela 01: Preços Global das Cortinas de Contenções (GEOFOR)” não existe no PDF original: há só a legenda. A proposta está sem o preço global.",
  "1.4 — A soma das seis áreas da cláusula 1.3 dá 7.468,3 m², mas o texto diz 7.468,0 m² (sete mil quatrocentos e sessenta e oito).",
  "3.9 — “preços unitários dos na composição” parece ter uma palavra faltando (dos materiais?).",
  "11.2 — As tabelas de verificação da contenção Recepção e Túnel trazem a referência “CONTENCAO GRAND PALLADIUM DOCA”.",
];

export const carta = {
  codigo: "GEO 2701A / 25",
  destinatario: ["À", "GRAND PALLADIUM", "Salvador - BA"],
  atencao: "At.: Sr. Saulo Cotrim.",
  referencia:
    "Proposta para elaboração de Projeto e Execução Global das contenções em Estacas Justapostas para a obra EXPANSÃO GRAND PALLADIUM RESORT & SPA, situada em Rodovia BA-099, Km 65, S/N, Imbassaí, Mata de São João – BA.",
  saudacao: "Prezados Senhores,",
  abertura:
    "Pela presente, formalizamos nossa proposta técnica e comercial em caráter global para a elaboração de projeto executivo geotécnico e execução integral dos serviços de contenções em estacas Justapostas conforme as condições de engenharia, premissas de campo e regramento jurídico discriminados nas cláusulas a seguir:",
};

/**
 * Blocos: { n, t } = cláusula; { tipo: "..." } = bloco especial.
 * `compacto: true` na seção = itens curtos em lista (escopos).
 */
export const secoes = [
  {
    n: "1",
    titulo: "Preliminar",
    itens: [
      {
        n: "1.1",
        t: "Os quantitativos, metodologias operacionais, dimensionamentos estruturais e estimativas de produtividade desta Proposta Comercial baseiam-se estrita e rigorosamente nos documentos técnicos de engenharia fornecidos pela CONTRATANTE, listados abaixo:",
        sub: [
          { n: "a)", t: "**Projeto arquitetônico** de autoria de Sidney Quintela, arquivos da pasta: “Projeto”, datados de 08/09/2023;" },
          {
            n: "b)",
            t: "**Relatórios de Investigação Geotécnica (Sondagens SPT)** de autoria da empresa TransGeo Geotecnia, compreendendo o arquivo “001 - Relatório de Sondagem” datado de 03/07/2025; e o arquivo “001 - Relatório de Sondagem_260902_190936” datado de 26/06/2026.",
          },
        ],
      },
      {
        n: "1.2",
        t: "A CONTRATANTE declara que os relatórios e plantas entregues refletem com fidelidade a realidade topográfica e a situação real do subsolo da área de intervenção. Qualquer divergência de campo em relação a tais documentos ativará os mecanismos de reequilíbrio previstos nesta proposta.",
      },
      {
        n: "1.3",
        t: "O objeto desta contratação compreende a execução civil e engenharia aplicada de contenções dividida de forma estanque para atender a 05 (cinco) subsolos dos prédios distintos e 01 (uma) doca, localizados dentro do canteiro de obras do Grand Palladium Resort & Spa, mapeados sob os seguintes quantitativos de projeto:",
      },
      {
        tipo: "contencoes",
        titulo: "Contenções",
        linhas: [
          { n: "1.3.1", nome: "Docas", solucao: "Cortinas Justapostas", area: "509,9" },
          { n: "1.3.2", nome: "Módulo Recepção", solucao: "Cortinas Justapostas", area: "1.638,0" },
          { n: "1.3.3", nome: "Módulo Habitacional H01", solucao: "Cortinas Justapostas", area: "1.442,7" },
          { n: "1.3.4", nome: "Módulo Habitacional H02", solucao: "Cortinas Justapostas", area: "1.442,7" },
          { n: "1.3.5", nome: "Módulo Habitacional H03", solucao: "Cortinas Justapostas", area: "1.055,3" },
          { n: "1.3.6", nome: "Módulo Piscinas", solucao: "Cortinas Justapostas", area: "1.379,7" },
        ],
      },
      {
        tipo: "total",
        n: "1.4",
        rotulo: "Consolidação Geral do Escopo do Resort:",
        valor: "7.468,0 m²",
        t: "O projeto global perfaz um total absoluto de 7.468,0 (sete mil quatrocentos e sessenta e oito) metros quadrados de contenção.",
      },
    ],
  },
  {
    n: "2",
    titulo: "Escopo a cargo da Contratada",
    compacto: true,
    itens: [
      { n: "2.1", t: "Mobilização de nossos equipamentos, sua instalação, operação e posterior remoção do canteiro ao final dos serviços." },
      { n: "2.2", t: "Mão de obra especializada e equipamento para execução das perfurações e lançamento de concreto das estacas." },
      { n: "2.3", t: "Informe técnico dos serviços executados e ocorrências de obra com dados de interesse comum." },
      { n: "2.4", t: "Fornecimento da ART CREA-BA." },
      { n: "2.5", t: "Recolhimento das contribuições sociais e previdenciárias da equipe que trabalhar na obra." },
      { n: "2.6", t: "Ferramentas e EPI’s necessários para execução dos serviços contratados." },
      { n: "2.7", t: "Programas de segurança e saúde ocupacional (PGR e PCMSO)." },
      { n: "2.8", t: "Plano de manutenção constante e livro de inspeção do equipamento." },
      { n: "2.9", t: "Exames admissionais, periódicos e demissionais de todos colaboradores (ASO)." },
      { n: "2.10", t: "Fornecimento de hospedagem para as equipes da obra." },
      { n: "2.11", t: "Fornecimento de refeições (café, almoço, janta e cesta básica) para as equipes." },
      { n: "2.12", t: "Transporte de nossas equipes." },
      { n: "2.13", t: "Apoio de equipamento retroescavadeira para remoção do solo proveniente das escavações." },
      { n: "2.14", t: "Fornecimento de Óleo Diesel para abastecimento da máquina." },
      { n: "2.15", t: "Fornecimento das armaduras montadas (Aço CA-50) das estacas hélice contínua." },
      { n: "2.16", t: "Içamento e instalação das armaduras após concretagem das estacas." },
      { n: "2.17", t: "Fornecimento de concreto usinado e bombeamento para as estacas hélice contínua." },
      { n: "2.18", t: "Fornecimento de mangotes para entregar o concreto na conexão do equipamento." },
      { n: "2.19", t: "Fornecimento de cimento para produção da nata de lubrificação diária da linha de concretagem." },
      { n: "2.20", t: "Fornecimento do controle tecnológico do concreto." },
      { n: "2.21", t: "Desenvolvimento de projeto executivo das cortinas de contenção." },
      {
        n: "2.22",
        rev: true,
        t: "Fornecimento (mobilização, montagem, manutenção e desmobilização) de 02 (duas) perfuratrizes de grande porte para estacas hélice contínua monitorada com sistema integrado de monitoramento eletrônico computadorizado e 01 (um) equipamento completo de cravação mecânica (bate-estacas).",
      },
    ],
  },
  {
    n: "3",
    titulo: "Escopo a cargo da Contratante",
    compacto: true,
    itens: [
      { n: "3.1", t: "Definir e manter no canteiro representante qualificado para acompanhar e garantir desenvolvimento normal e ininterrupto dos serviços, garantindo frente de trabalho ininterrupta." },
      { n: "3.2", t: "Entrega e manutenção da área onde se desenvolverão os trabalhos plana e desimpedida de obstáculos visíveis ou não, de forma a permitir o livre acesso dos equipamentos e ferramentas necessárias da atividade." },
      { n: "3.3", t: "Fornecimento de pequeno almoxarifado e vigilância de nossas ferramentas de menor porte e armários para os nossos colaboradores." },
      { n: "3.4", t: "Fornecimento dos perfis de sondagens que se fizerem necessários para uma perfeita caracterização do solo no local da obra." },
      { n: "3.5", t: "Fornecimento de água e energia elétrica cerca de 30 HP e rede trifásica 220 V com cabo trifásico de 50,0 m não situados a mais de 50 metros dos locais de utilização, instalações elétricas que sejam necessárias." },
      { n: "3.6", t: "Locação das cortinas de contenções em locais de referência de nível para orientação dos trabalhos." },
      { n: "3.7", t: "Bota fora do solo proveniente das escavações." },
      { n: "3.8", t: "Materiais e execução das vigas de coroamento no topo das cortinas e arrasamentos de estacas." },
      { n: "3.9", t: "Faturamento direto dos materiais das estacas considerando os seguintes preços unitários dos na composição: concreto fck = 30 MPa – R$ 680,00 por m³, aço CA-50 – R$ 5,70 por kg." },
    ],
  },
  {
    n: "4",
    titulo: "Regras especiais de engenharia e gestão de riscos",
    rev: true,
    intro:
      "Com o objetivo de detalhar minuciosamente as responsabilidades contratuais em face das severas complexidades operacionais inerentes à obra, ficam pactuadas as condições técnicas imperativas dispostas nos parágrafos seguintes.",
    itens: [
      {
        n: "4.1",
        rev: true,
        t: "**Da Tolerância Normativa para Desvios Executivos:** Serão admitidos como válidos e conformes todos os desvios de locação em planta (excentricidade) e desvios de prumo (desaprumo) que se mantiverem estritamente dentro das tolerâncias estipuladas na norma **ABNT NBR 6122:2022**. Eventuais desvios que ultrapassem as marcas normativas decorrentes de deficiências na demarcação topográfica (responsabilidade da CONTRATANTE) ou provocados pelo desvio natural do trado em virtude de matacões ou obstáculos subterrâneos não serão imputados à GEOFOR, correndo os custos de reforço estrutural e cálculo por conta da CONTRATANTE.",
      },
      {
        n: "4.2",
        rev: true,
        t: "**Da Responsabilidade por Redes Subterrâneas Existentes:** Considerando que a área de expansão faz parte de um complexo hoteleiro pré-existente, a CONTRATANTE assume a obrigação formal de entregar à equipe de engenharia da GEOFOR, antes da entrada dos equipamentos em pista, a planta cadastral atualizada ('as-built') de todas as interferências subterrâneas na área (linhas de fibra óptica, alimentação elétrica de alta tensão, tubulações de gás, redes de água potável, esgotamento sanitário, entre outras). A GEOFOR fica integralmente isenta de responsabilidade civil, criminal ou contratual por prejuízos causados pelo rompimento de redes subterrâneas que não constavam nas plantas entregues ou que não foram fisicamente sinalizadas em campo pela equipe da CONTRATANTE.",
      },
      {
        n: "4.3",
        rev: true,
        t: "**Do Risco de Perda de Concreto Fluido:** O processo de injeção de concreto sob pressão em estacas Hélice Contínua convive com o risco físico de perdas decorrentes de vazios no solo (cavernas subterrâneas, bolsões de areia fofa, fendas geológicas) ou sobreconsumo por colapso de paredes laterais em camadas friáveis. A GEOFOR não arcará com o custo financeiro do concreto excedente injetado, uma vez que este é um risco geológico inerente à atividade geotécnica e não foi embutido na planilha de custos ordinários. O faturamento do concreto será realizado com base no volume medido nos relatórios de injeção computadorizados das perfuratrizes.",
      },
      {
        n: "4.4",
        rev: true,
        t: "**Da Limpeza do Canteiro e do Fluxo do Lameiro:** A perfuração via HCM gera, em cada estaca, um resíduo volumoso conhecido como 'lameiro' (mistura de solo local, água e resquícios de nata de cimento). O escopo da GEOFOR restringe-se a extrair mecanicamente este material e depositá-lo adjacente à estaca perfurada. Toda a operação de raspagem contínua das pistas, contenção do fluxo de lama para áreas de preservação ambiental ou jardins do resort, bem como o bombeamento de águas residuárias de lavagem de trado, são de responsabilidade direta e exclusiva da CONTRATANTE.",
      },
    ],
  },
  {
    n: "5",
    titulo: "Preços",
    intro:
      "É o seguinte nosso preço para execução do estaqueamento nas condições acima, nele incluídas todas as despesas com nossa mão de obra, equipamentos, ferramentas, assessoria técnica e impostos ICMS, IPI, PIS, COFINS, ISS, IRPJ, CSLL (empresa optante pelo Simples Nacional, alíquota de recolhimento varia mensalmente conforme faturamento no período anterior).",
    itens: [
      // A tabela não existe no PDF original (só a legenda). Quando ela vier,
      // troque `linhas: null` pelas linhas [descrição, valor] e o placeholder some.
      { tipo: "tabela-precos", legenda: "Tabela 01: Preços Global das Cortinas de Contenções (GEOFOR).", linhas: null },
      {
        n: "5.1",
        rev: true,
        t: "**Valores Unitários de Referência da Composição:** Para fins de formação do preço global contratado, fiscalização de eventuais acréscimos ou supressões de escopo por parte da CONTRATANTE, adota-se a seguinte matriz de preços unitários de balizamento de materiais postos em obra:",
        insumos: [
          ["Concreto Usinado Injetado fck = 30 MPa", "R$ 680,00 por metro cúbico (m³)"],
          ["Aço Estrutural CA-50", "R$ 5,70 por quilograma (kg)"],
        ],
      },
      {
        n: "5.2",
        rev: true,
        t: "**Da Cláusula de Proteção e Reajuste de Insumos Críticos:** Os preços unitários acima tomam como premissa os custos de mercado vigentes na data de assinatura desta proposta. Se houver variação abrupta, inflacionária ou reajuste de usina siderúrgica / usina de concreto que resulte em elevação acumulada superior a 5% (cinco por cento) calculada sobre o valor de referência do Aço ou do Concreto, os preços unitários da tabela contratual serão revisados e repassados proporcionalmente de imediato no faturamento das medições subsequentes, restabelecendo o equilíbrio financeiro do contrato.",
      },
    ],
  },
  {
    n: "6",
    titulo: "Condições de pagamento",
    itens: [
      { n: "6.1", t: "1ª Parcela: sinal no valor R$ 100.000,00 na assinatura do contrato." },
      { n: "6.2", t: "Medições quinzenais para pagamento em até 07 dias corridos após emissão da fatura." },
      {
        tipo: "faturamento",
        n: "6.3",
        rotulo: "Faturamento:",
        partes: [
          {
            pct: "60%",
            t: "Faturamento dos serviços em 60% do valor referente à locação de equipamentos. Fatura de locação pela empresa de razão social GEO TÉCNICA FUNDAÇÕES, inscrita no CNPJ 35.254.214/0001-79.",
          },
          {
            pct: "40%",
            t: "Faturamento dos serviços em 40% do valor referente à mão de obra. Nota Fiscal de serviço pela empresa de razão social GEOFOR OBRAS DE FUNDAÇÕES, inscrita no CNPJ 26.214.785/0001-99.",
          },
        ],
      },
      {
        tipo: "obs",
        itens: [
          "Qualquer alteração na Política Econômica praticada pelo Governo que provoque desequilíbrio econômico-financeiro do contrato que esta proposta possa gerar a GEOFOR se reserva ao direito de renegociá-lo e em caso de impasse rescindi-lo sem nenhum tipo de penalidade.",
          "Todos os pagamentos deverão ser realizados na data de cada evento e na eventualidade de inadimplência incidirá sobre os valores devidos multa de 2 % + juros de 0,10 % ao dia.",
        ],
      },
    ],
  },
  {
    n: "7",
    titulo: "Diversos",
    itens: [
      { n: "7.1", t: "Os preços desta proposta foram compostos com base na premissa de atividade nos dias úteis de Segunda a Sexta num total de 44 horas semanais." },
      { n: "7.2", t: "A GEOFOR está dispensada de retenção do INSS de acordo com Instrução Normativa nº 2110/2022 - Art.130 item XVI, “estão isentos de Retenção as Empresas de Prestação de Serviços de Geotecnia e Fundações” no que a GEOFOR se enquadra." },
      { n: "7.3", t: "Caso o cliente solicite trabalho aos sábados e domingos, será acrescido 15% e 25% respectivamente nos preços unitários das estacas executadas." },
      { n: "7.4", t: "No escopo de orçamento não está previsto haver retenção técnica ou contratual dos serviços. No caso de incluir retenção no Contrato da Contratante, os valores unitários serão ajustados no mesmo valor percentual (%) da retenção e acrescidos os impostos incidentes." },
      { n: "7.5", rev: true, t: "Caso aconteça perda de concreto, a GEOFOR não arcará com esse custo, pois não está considerado na composição de custo este risco inerente da atividade." },
      {
        n: "7.6",
        rev: true,
        t: "A responsabilidade financeira máxima agregada da GEOFOR por qualquer descumprimento, multa contratual, erro técnico de engenharia ou sinistro comprovado decorrente da execução das contenções objeto desta proposta fica estritamente limitada ao valor equivalente a 10% (dez por cento) do valor total dos serviços de mão de obra efetivamente executados, não respondendo a contratada em nenhuma hipótese por danos indiretos, lucros cessantes, perdas comerciais, quebra de receitas ou atrasos na inauguração comercial das novas dependências do Resort por parte do grupo hoteleiro CONTRATANTE.",
      },
    ],
  },
  {
    n: "8",
    titulo: "Prazos",
    itens: [
      { n: "8.1", t: "Mobilização e transporte de equipamentos e pessoal: a combinar." },
      { n: "8.2", t: "De instalação no canteiro: 01 dia." },
      { n: "8.3", t: "De execução: em condições normais de trabalho, solo e clima, o prazo estimado para execução das cortinas em estacas justapostas é de **88 dias úteis para 02 equipamentos**." },
      {
        n: "8.4",
        rev: true,
        t: "**Paralisações por Força Maior e Intempéries Climáticas (Chuvas):** Considerando as características geotécnicas do solo litorâneo da Mata de São João - BA, a GEOFOR fica integralmente isenta de penalidades, multas contratuais ou imputação de atrasos causados por chuvas torrenciais ou índices pluviométricos que impeçam a circulação segura das máquinas pesadas nas pistas ou que comprometam a qualidade civil do concreto fluido. Os dias afetados por fortes precipitações e o período subsequente necessário para a secagem/restabelecimento da compactação do solo serão automaticamente estendidos ao prazo final de entrega.",
      },
      {
        n: "8.5",
        rev: true,
        t: "O prazo estimado presume uma frente de trabalho contínua e sem interrupções logísticas ou burocráticas causadas pelo cliente. Sempre que os equipamentos principais da GEOFOR (Perfuratrizes ou Bate-Estacas) e suas respectivas equipes ficarem ociosos por culpa direta ou indireta da CONTRATANTE, configurar-se-á o estado de **Standby Operacional**.",
        complemento: "São causadores legítimos de aplicação da taxa de Standby, sem prejuízo de outros fatores exógenos à CONTRATADA:",
        lista: [
          "Falta ou interrupção no fornecimento de água industrial ou energia trifásica de 30 HP;",
          "Atraso ou interrupção na entrega de concreto usinado das betoneiras na cota regulamentar;",
          "Falta de liberação de frentes ou eixos topográficos devidamente demarcados;",
          "Interrupções impostas pela fiscalização, administração do Resort, ordens de silêncio ou restrições de horários não pactuados;",
          "Pistas sem condições de tráfego, atolamento de caminhões ou instabilidade de patolamento.",
        ],
      },
      {
        n: "8.6",
        rev: true,
        t: "Ocorrido o evento de paralisação por período acumulado superior a 02 (duas) horas em um mesmo dia útil, a GEOFOR iniciará a contagem de horas paradas e faturará à CONTRATANTE o valor indenizatório **de R$ 500,00 por hora fracionada ou o teto de R$ 5.000,00 por dia útil de paralisação por equipamento prejudicado**, visando sanar os custos fixos de ociosidade de maquinário pesado e equipes de prontidão móvel.",
      },
      {
        n: "8.7",
        rev: true,
        t: "**Obstáculos Geológicos Ocultos:** Caso sejam interceptados no subsolo matacões de rocha sã, blocos de concreto de obras antigas, tubulações de concreto armado blindadas ou solo com impenetrável à perfuração mecânica ordinária com o trado padrão, a GEOFOR paralisará o respectivo ponto. O tempo decorrente de tentativas de quebra, substituição de ponteiras avariadas ou redesenho locacional será computado como hora trabalhada extraordinária. Caso seja necessária metodologia especial (como perfuratrizes pneumáticas de rocha), os custos serão formalizados via Termo Aditivo.",
      },
    ],
  },
  {
    n: "9",
    titulo: "Aceite contratual",
    itens: [
      {
        tipo: "paragrafo",
        t: "A autorização por V.S.as., para colocação dos nossos equipamentos no canteiro de obra e consequente início dos serviços descrito acima, mesmo que verbal, implicará no aceite tácito de todas as cláusulas constantes desta proposta.",
      },
    ],
  },
  {
    n: "10",
    titulo: "Validade da proposta",
    // Layout: começa em página nova, junto com o foro e as assinaturas (página de fechamento).
    quebraAntes: true,
    itens: [
      {
        tipo: "paragrafo",
        t: "A presente será válida pelo prazo de 30 dias, condicionada ao exame do Projeto, das sondagens e das condições locais de trabalho após o preparo do canteiro.",
      },
      {
        tipo: "paragrafo",
        t: "Fica eleito o Foro da cidade de Salvador – BA, para dirimir questões deste oriundo, sendo ele obrigatório às partes, herdeiros e sucessores.",
      },
    ],
  },
];

export const assinatura = {
  despedida: "Atenciosamente,",
  empresa: "GEOFOR OBRAS DE FUNDAÇÕES LTDA",
  nome: "Engº Lucas Fonseca Jordão",
  registro: "CREA 939007/SC",
  deAcordo: "De Acordo,",
  campos: ["Empresa", "CNPJ", "Insc. Est.", "End."],
};
