/**
 * Texto da proposta GEO 2993A/26 (fundações): carta e cláusulas 1 a 10.
 *
 * Transcrito do Word "Proposta GEO 2993A-26 - FUND - Hélice e Metálica - GRAND PALLADIUM -
 * 28.10.26 (Em Rev)". O conteúdo é o mesmo; só a forma muda. As únicas alterações de texto são
 * as correções listadas em CORRECOES (digitação, pontuação, concordância e regência), sem mudar
 * sentido. O que mudaria sentido fica como está e vai para PONTOS_DE_ATENCAO.
 *
 * Marcação: **negrito**. `rev: true` = trecho marcado em amarelo no Word (ver
 * config.marcarRevisoes em ../empresa.mjs).
 */
import { tabelas } from "./dados.mjs";

export const proposta = {
  codigo: "GEO 2993A/26",
  /** Duas linhas à direita do cabeçalho de todas as páginas (mesmo padrão da proposta de contenção). */
  cabecalho: ["PROPOSTA GEO 2993A/26", "EXPANSÃO GRAND PALLADIUM IMBASSAÍ"],
  cidadeData: "Salvador, 27 de outubro de 2026.",
  emissao: "27 de outubro de 2026",
  obra: "Expansão Grand Palladium Resort & Spa",
  localObra: "Rodovia BA-099, Km 65, S/N · Imbassaí, Mata de São João – BA",
  cliente: "Grand Palladium",
  atencao: "Sr. Saulo Vieira",
  validade: "30 dias",
};

export const CORRECOES = [
  { onde: "Carta", original: "GEO 2993 A / 26", corrigido: "GEO 2993A / 26 (como no cabeçalho e no nome do arquivo)" },
  { onde: "Carta", original: "estacas metálicas conforme as condições", corrigido: "estacas metálicas, conforme as condições" },
  { onde: "1.1 a)", original: "aspas simples retas em torno dos nomes dos arquivos", corrigido: "aspas simples curvas (‘…’)" },
  { onde: "1.3", original: "fundações profundas dividida de forma estanque", corrigido: "fundações profundas divididas de forma estanque" },
  { onde: "1.4", original: "83 (oitocentas e três) estacas metálicas", corrigido: "83 (oitenta e três) estacas metálicas — o número por extenso estava errado; 83 confere com 1.3.2 e a Tabela 01" },
  { onde: "2.6", original: "EPI’s", corrigido: "EPIs" },
  { onde: "2.14", original: "do Óleo Diesel", corrigido: "do óleo diesel" },
  { onde: "3.2", original: "equipamentos e ferramentas necessárias da atividade", corrigido: "equipamentos e ferramentas necessários à atividade" },
  { onde: "4 (introdução)", original: "inerentes a obra", corrigido: "inerentes à obra" },
  { onde: "4.3", original: "estacas Hélice Contínua", corrigido: "estacas hélice contínua (como em 2.15 e 2.17)" },
  { onde: "5 (Tabela 01)", original: "Preços Global dos Serviços e Materiais - GEOFOR", corrigido: "Preço Global dos Serviços e Materiais – GEOFOR" },
  { onde: "5.1", original: "fck = 30 Mpa", corrigido: "fck = 30 MPa" },
  { onde: "Tabelas 01 a 03", original: "ADMINSITRAÇÃO · vasoso sanitários · Epi's · fck=30 Mpa · ( 50 % de · Kg · estacas metálica tubo", corrigido: "ADMINISTRAÇÃO · vasos sanitários · EPIs · fck = 30 MPa · (50% de · kg · estacas metálicas tubo" },
  { onde: "6 (Obs. 1)", original: "possa gerar a GEOFOR se reserva ao direito de renegociá-lo e em caso de impasse rescindi-lo", corrigido: "possa gerar, a GEOFOR se reserva o direito de renegociá-lo e, em caso de impasse, rescindi-lo" },
  { onde: "6 (Obs. 2)", original: "e na eventualidade de inadimplência incidirá … 2 % + juros de 0,17 % ao dia. Além de ficar", corrigido: "e, na eventualidade de inadimplência, incidirá … 2% + juros de 0,17% ao dia, além de ficar" },
  { onde: "7.1", original: "dias úteis de Segunda a Sexta", corrigido: "dias úteis, de segunda a sexta-feira," },
  { onde: "7.3", original: "será acrescido 25% e 30% respectivamente nos preços", corrigido: "serão acrescidos 25% e 30%, respectivamente, aos preços" },
  { onde: "8.3", original: "com condições normais de trabalho, solo e clima é de 66 dias úteis com 02 equipamentos", corrigido: "em condições normais de trabalho, solo e clima, é de 66 dias úteis, com 02 equipamentos (e igual nas metálicas)" },
  { onde: "8.4", original: "Mata de São João - BA", corrigido: "Mata de São João – BA" },
  { onde: "8.7", original: "solo com impenetrável à perfuração", corrigido: "solo impenetrável à perfuração" },
  { onde: "9", original: "início dos serviços descrito acima", corrigido: "início dos serviços descritos acima" },
  { onde: "10 (foro)", original: "Salvador - BA. Para dirimir", corrigido: "Salvador – BA, para dirimir" },
  { onde: "Memorial 11.1", original: "‘SSAUH1_STR_PE_EP_ 002_…’ e ‘SSAUH1_STR_PE_H2 _000_…’ (espaço no meio do nome)", corrigido: "nomes dos arquivos sem espaço, como em 1.1 a)" },
  { onde: "Memorial 11.3", original: "Para se obter aclasse do concreto", corrigido: "Para se obter a classe do concreto" },
  { onde: "Memorial 11.3", original: "localizada em uma litorânea em Mata de São João - BA ficando", corrigido: "localizada em uma região litorânea em Mata de São João – BA, ficando (faltava a palavra “região”)" },
  { onde: "Memorial 11.4", original: "estribos;", corrigido: "estribos." },
  { onde: "Memorial 11.5", original: "perfis das sondagens a percussão", corrigido: "perfis das sondagens à percussão" },
  { onde: "Memorial 11.6 (Tabela 3)", original: "Estacas Raíz", corrigido: "Estacas Raiz" },
  { onde: "Memorial 11.7 (Onde:)", original: "Ac = área de aço da estaca", corrigido: "As = área de aço da estaca (o símbolo estava repetido: Ac)" },
  { onde: "Memorial 11.7", original: "fyk =500Mpa", corrigido: "fyk = 500 MPa" },
  { onde: "Memorial 11.7", original: "0,944 KN/cm² · 43,478 KN/cm²", corrigido: "0,944 kN/cm² · 43,478 kN/cm² (símbolo da unidade: kN)" },
  { onde: "Memorial 11.8", original: "Abaixo apresenta-se os resultados", corrigido: "Abaixo apresentam-se os resultados" },
  { onde: "Memorial 11.8 (Piscinas)", original: "descriminada", corrigido: "discriminada" },
  { onde: "Memorial 11.8 (H01 e H02)", original: "sobre a cortina de contenção por isso não", corrigido: "sobre a cortina de contenção, por isso não" },
  { onde: "Memorial (numeração)", original: "dois itens “11.6” (carga admissível e carga estrutural); 11.7 a 11.10 a seguir", corrigido: "11.6 a 11.11 em sequência: carga admissível (11.6), carga estrutural (11.7), carga de trabalho (11.8), quantitativos (11.9), procedimento (11.10), critérios (11.11)" },
  { onde: "Memorial (numeração das tabelas)", original: "duas “Tabela 9” (H02 e H03) e “Tabela 10” para os quantitativos", corrigido: "Tabela 9 (H02), Tabela 10 (H03) e Tabela 11 (quantitativos por módulo)" },
  { onde: "Memorial", original: "∅300 mm, ∅400mm (símbolo de conjunto vazio)", corrigido: "Ø300 mm, Ø400 mm (letra Ø)" },
];

/** Trechos mantidos como estão, mas que merecem revisão da equipe Geoforte antes do envio. */
export const PONTOS_DE_ATENCAO = [
  // Para decidir antes de enviar
  "Carta — O destinatário está como “À SAULO VIEIRA / At.: Sr. Saulo Vieira”. Na proposta de contenção é “À GRAND PALLADIUM / At.: Sr. Saulo Cotrim”. Confirmar o nome (Vieira ou Cotrim) e se a empresa deve aparecer no “À”.",
  "Datas — A carta e a capa dizem 27 de outubro de 2026; o fim do memorial diz 28 de outubro de 2026 (e o arquivo é “28.10.26”).",
  "Concreto — O memorial (11.3) pede fck ≥ 40 MPa (CAA III, C40, pela NBR 6122), mas as cláusulas e as Tabelas 01 e 02 falam em concreto fck = 30 MPa. Confirmar qual vale.",
  "Preços unitários — A cláusula 5.1 diz concreto a R$ 680,00/m³ e aço a R$ 5,70/kg; a Tabela 02 usa R$ 700,00/m³ e R$ 10,00/kg (armação pronta); a Tabela 03 usa R$ 580,00/m³ e R$ 6,00/kg. Confirmar.",
  "Tabela 01, itens sem valor — 5.3 (munck), 5.5 a 5.8 (containers, carro-pipa), 6.4 (PDA, “caso ocorra”) e 7.1 (seguro garantia) estão com “–” no preço. Se “–” quer dizer “incluso”, vale dizer; se é “a definir”, o preço global está incompleto.",
  "PDA — A cláusula 3.8 põe a instrumentação do ensaio dinâmico (PDA) a cargo da Contratante, mas a Tabela 01 (item 6) traz “Ensaios de capacidade de carga (PCE e PDA)” no preço da Geofor, com 4 provas de carga estáticas (R$ 100.000,00).",
  "Faturamento direto — Na proposta de contenção há a cláusula 3.9 (faturamento direto dos materiais das estacas, com os preços unitários). Na fundação ela não existe, mas as Tabelas 02 e 03 dizem “a cargo da contratante” e “faturamento direto”. Conferir se falta a cláusula.",
  "Juros e fim de semana — Multa 2% + juros de 0,17% ao dia (6, Obs. 2) e acréscimo de 25% e 30% para sábado e domingo (7.3). Na proposta de contenção são 0,10% ao dia e 15% e 25%. Confirmar se é de propósito.",
  "Relatório de sondagem — A cláusula 1.1 b) diz que o relatório é de 26/06/2026; o memorial (11.5) e a Tabela 1 dizem 26/05/2026. O nome do arquivo (“…_260902_190936”) sugere 02/09/2026.",
  // Números e normas
  "Estaca H02 — A tabela de estaqueamento do H02 (Tabela 9) soma 243 estacas, mas a cláusula 1.3.4, a Tabela 01 e a Tabela 11 dizem 245; falta o pilar PC70 na tabela (a Tabela 11 mostra 128 estacas de 8,0 m para o H02 e a tabela de pilares, 126).",
  "Tabela 7 (Recepção) — As duas imagens coladas no Word repetiam 11 linhas (pilares P75 a P88); foram contadas uma vez. Com isso a Recepção fecha em 217 estacas hélice contínua e 83 metálicas (cláusula 1.3.2).",
  "Carga estrutural (11.7) — Recalculando com os valores do próprio texto (fcd, fyd, Ac, As e o divisor 1,4), Qadm,est dá cerca de 87,6 tf (Ø400) e 49,3 tf (Ø300), e o texto traz 86,5 tf e 48,7 tf (com 1 tf = 10 kN). Conferir a conta.",
  "NBR 6122 — O memorial cita a norma como 2022 (11.2, 4.1 e item 6.3.2) e como 2024 (11.3, 11.7 e item 5.6). A Tabela 4 mostrada é da NBR 6122:2019 (versão corrigida 2022). Conferir a edição.",
  "H01 e H02 — A observação sobre os pilares que nascem sobre a cortina de contenção (PA34 a PA36, PA47 a PA58, PB33, PB37 a PB42, PC40 a PC47, PC52 a PC59) é a mesma nos dois módulos; as tabelas de pilares também são quase iguais. Conferir se não é cópia do H01.",
  "Tabela 4 (carga admissível) — Para SP-03C, SP-04D e SP-05E, a célula “L=5m / 4m / 5m” ocupa as colunas de 6,0 m e os valores estão nas colunas de 8,0 m. Conferir se o desenho da tabela é esse.",
  // Texto
  "7.2 — Conferir a citação da Instrução Normativa nº 2110/2022 (art. 130, item XVI) e o trecho entre aspas.",
  "7.5 — Repete a regra da perda de concreto da 4.3 com outra redação. Ver se as duas devem ficar.",
  "2.4 e assinatura — A ART é do CREA-BA e o responsável técnico tem registro CREA/SC: conferir o visto no CREA-BA.",
  "Anexo — O Word chama só de “Anexo”; aqui ele é o Anexo A (na proposta de contenção é o Anexo B). As legendas das fotos descrevem só o que se vê e podem ser trocadas.",
  "Tabelas — Há “Tabela 01/02/03” (preços) e “Tabela 1/2/3” (memorial). Os números são parecidos; considerar chamar os do memorial de 11.1, 11.2…",
];

export const carta = {
  codigo: "GEO 2993A / 26",
  destinatario: ["À", "SAULO VIEIRA", "Salvador – BA"],
  atencao: "At.: Sr. Saulo Vieira.",
  referencia:
    "Proposta para elaboração de projeto e execução global das fundações para a obra EXPANSÃO GRAND PALLADIUM RESORT & SPA, situada em Rodovia BA-099, Km 65, S/N, Imbassaí, Mata de São João – BA.",
  saudacao: "Prezados Senhores,",
  abertura:
    "Pela presente, formalizamos nossa proposta técnica e comercial em caráter global para a elaboração de projeto executivo geotécnico e execução integral dos serviços de fundações profundas em estacas tipo Hélice Contínua Monitorada e estacas metálicas, conforme as condições de engenharia, premissas de campo e regramento jurídico discriminados nas cláusulas a seguir:",
};

// ─── Planilhas de preço (Tabelas 01 a 03): vêm de tabelas.json, com as correções de digitação ──────
const TEXTO = [
  [/ADMINSITRAÇÃO/g, "ADMINISTRAÇÃO"],
  [/vasoso sanitários/g, "vasos sanitários"],
  [/Epi's/g, "EPIs"],
  [/fck=30 Mpa/g, "fck = 30 MPa"],
  [/\(\s*(\d+)\s*% de/g, "($1% de"],
  [/estacas metálica tubo/g, "estacas metálicas tubo"],
  [/ - /g, " – "],
];
const corrigir = (s) => (s == null ? s : TEXTO.reduce((t, [de, para]) => t.replace(de, para), s));
const planilha = (legenda, linhas) => ({
  tipo: "planilha",
  legenda,
  linhas: linhas.map((l) => ({ ...l, desc: corrigir(l.desc), un: l.un === "Kg" ? "kg" : l.un })),
});

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
          {
            n: "a)",
            t: "**Projetos Estruturais (Plantas de Locação e Cargas)** de autoria da ProEst Projeto e Tecnologia de Estruturas, consubstanciados nos arquivos digitais: ‘SSAUH1_STR_PE_BP_002_CAR_SS_R04’; ‘SSAUH1_STR_PE_EP_002_CAR_SS_R02’; ‘SSAUH1_STR_PE_H1_000_CAR_SS_R03’; ‘SSAUH1_STR_PE_H2_000_CAR_SS_R01’; ‘SSAUH1_STR_PE_H3_001_CAR_SS_R01’.",
          },
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
        t: "O objeto desta contratação compreende a execução civil e engenharia aplicada de fundações profundas divididas de forma estanque para atender a 05 (cinco) prédios/módulos distintos localizados dentro do canteiro de obras do Grand Palladium Resort & Spa, mapeados sob os seguintes quantitativos de projeto:",
      },
      {
        tipo: "modulos",
        titulo: "Módulos",
        colunas: ["Estacas Hélice Contínua Monitorada", "Estacas Metálicas"],
        linhas: [
          { n: "1.3.1", nome: "Módulo Piscinas", valores: ["116", null] },
          { n: "1.3.2", nome: "Módulo Recepção", valores: ["217", "83"] },
          { n: "1.3.3", nome: "Módulo Habitacional H01", valores: ["245", null] },
          { n: "1.3.4", nome: "Módulo Habitacional H02", valores: ["245", null] },
          { n: "1.3.5", nome: "Módulo Habitacional H03", valores: ["62", null] },
        ],
      },
      {
        tipo: "total",
        n: "1.4",
        rotulo: "Consolidação Geral do Escopo do Resort:",
        valor: "968 estacas",
        t: "O projeto global perfaz um total absoluto de 885 (oitocentas e oitenta e cinco) estacas Hélice Contínua Monitorada e 83 (oitenta e três) estacas metálicas cravadas, totalizando 968 elementos de fundação profunda.",
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
      { n: "2.4", t: "Fornecimento da Anotação de Responsabilidade Técnica (ART) do Conselho Regional de Engenharia e Agronomia (CREA) referente ao projeto e à execução das estacas de fundação." },
      { n: "2.5", t: "Recolhimento das contribuições sociais e previdenciárias da equipe que trabalhar na obra." },
      { n: "2.6", t: "Ferramentas e EPIs necessários para execução dos serviços contratados." },
      { n: "2.7", t: "Programas de segurança e saúde ocupacional (PGR – Programa de Gerenciamento de Riscos e PCMSO – Programa de Controle Médico de Saúde Ocupacional)." },
      { n: "2.8", t: "Plano de manutenção constante e livro de inspeção do equipamento." },
      { n: "2.9", t: "Exames admissionais, periódicos e demissionais de todos os colaboradores (ASO)." },
      { n: "2.10", t: "Fornecimento de hospedagem para as equipes." },
      { n: "2.11", t: "Fornecimento de refeições (café da manhã, almoço, janta e cesta básica mensal) para as equipes." },
      { n: "2.12", t: "Transporte de nossas equipes para a região da obra (mobilização e desmobilização) e transporte diário (ida e volta) até a frente de trabalho." },
      { n: "2.13", t: "Apoio de equipamento retroescavadeira para remoção do solo proveniente das escavações." },
      { n: "2.14", t: "Fornecimento do óleo diesel para abastecimento dos equipamentos." },
      { n: "2.15", t: "Fornecimento das armaduras montadas (aço CA-50) das estacas hélice contínua." },
      { n: "2.16", t: "Içamento e instalação das armaduras após concretagem das estacas hélice contínua." },
      { n: "2.17", t: "Fornecimento de concreto usinado e seu bombeamento para as estacas hélice contínua." },
      { n: "2.18", t: "Fornecimento de tubulação / mangotes para entregar o concreto na base da torre do equipamento. Em atendimento às exigências do sistema de monitoramento computadorizado, fica vedado o uso de caminhão tipo bomba-lança articulada." },
      { n: "2.19", t: "Fornecimento de cimento para produção e injeção diária da nata de lubrificação da linha de bombeamento da concretagem." },
      { n: "2.20", t: "Fornecimento e descarga do material das estacas metálicas na obra." },
      { n: "2.21", t: "Fornecimento de máquina de solda e conjunto completo de maçarico para oxi-corte em campo." },
      { n: "2.22", t: "Produção de talas de aço para as emendas e execução das emendas das estacas metálicas." },
      { n: "2.23", t: "Fornecimento do controle tecnológico do concreto usinado." },
      { n: "2.24", t: "Desenvolvimento, dimensionamento, detalhamento e emissão de projeto executivo final das fundações com base no projeto estrutural fornecido." },
      {
        n: "2.25",
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
      { n: "3.2", t: "Entrega e manutenção da área onde se desenvolverão os trabalhos plana e desimpedida de obstáculos visíveis ou não, de forma a permitir o livre acesso dos equipamentos e ferramentas necessários à atividade." },
      { n: "3.3", t: "Fornecimento de pequeno almoxarifado e vigilância de nossas ferramentas de menor porte e armários para os nossos colaboradores." },
      { n: "3.4", t: "Fornecimento dos perfis de sondagens que se fizerem necessários para uma perfeita caracterização do solo no local da obra." },
      { n: "3.5", t: "Fornecimento de água e energia elétrica cerca de 30 HP e rede trifásica 220 V com cabo trifásico de 50,0 m não situados a mais de 50 metros dos locais de utilização." },
      { n: "3.6", t: "Locação das estacas em locais de referência de nível para orientação dos trabalhos." },
      { n: "3.7", t: "Fornecer e responsabilizar-se pela estabilidade de estruturas e/ou aterros provisórios ou não porventura necessários à execução dos serviços." },
      { n: "3.8", t: "Contratar empresa especializada na instrumentação para ensaio dinâmico (PDA)." },
      { n: "3.9", t: "Bota-fora do solo proveniente das escavações mecanizadas." },
      { n: "3.10", t: "Materiais e execução dos blocos de coroamento e arrasamento das estacas." },
      { n: "3.11", t: "Materiais e execução das vigas das fundações (vigas de equilíbrio e de travamento)." },
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
        t: "**Do Risco de Perda de Concreto Fluido:** O processo de injeção de concreto sob pressão em estacas hélice contínua convive com o risco físico de perdas decorrentes de vazios no solo (cavernas subterrâneas, bolsões de areia fofa, fendas geológicas) ou sobreconsumo por colapso de paredes laterais em camadas friáveis. A GEOFOR não arcará com o custo financeiro do concreto excedente injetado, uma vez que este é um risco geológico inerente à atividade geotécnica e não foi embutido na planilha de custos ordinários. O faturamento do concreto será realizado com base no volume medido nos relatórios de injeção computadorizados das perfuratrizes.",
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
      planilha("Tabela 01: Preço Global dos Serviços e Materiais – GEOFOR.", tabelas.precos.tabela01),
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
      planilha("Tabela 02: Estimativa de Materiais das Estacas (a cargo da contratante).", tabelas.precos.tabela02),
      planilha("Tabela 03: Estimativa de Materiais e Execução dos Blocos de Coroamento (a cargo da contratante).", tabelas.precos.tabela03),
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
          "Qualquer alteração na Política Econômica praticada pelo Governo que provoque desequilíbrio econômico-financeiro do contrato que esta proposta possa gerar, a GEOFOR se reserva o direito de renegociá-lo e, em caso de impasse, rescindi-lo sem nenhum tipo de penalidade.",
          "Todos os pagamentos deverão ser realizados na data de cada evento e, na eventualidade de inadimplência, incidirá sobre os valores devidos multa de 2% + juros de 0,17% ao dia, além de ficar a critério exclusivo da GEOFOR a continuidade dos serviços.",
        ],
      },
    ],
  },
  {
    n: "7",
    titulo: "Diversos",
    itens: [
      { n: "7.1", t: "Os preços desta proposta foram compostos com base na premissa de atividade nos dias úteis, de segunda a sexta-feira, num total de 44 horas semanais." },
      { n: "7.2", t: "A GEOFOR está dispensada de retenção do INSS de acordo com Instrução Normativa nº 2110/2022 - Art.130 item XVI, “estão isentos de Retenção as Empresas de Prestação de Serviços de Geotecnia e Fundações” no que a GEOFOR se enquadra." },
      { n: "7.3", t: "Caso o cliente solicite trabalho aos sábados e domingos, serão acrescidos 25% e 30%, respectivamente, aos preços unitários das estacas executadas." },
      { n: "7.4", t: "No escopo de orçamento não está previsto haver retenção técnica ou contratual dos serviços. No caso de incluir retenção no Contrato da Contratante, os valores unitários serão ajustados no mesmo valor percentual (%) da retenção e acrescidos os impostos incidentes." },
      { n: "7.5", rev: true, t: "Caso aconteça perda de concreto, a GEOFOR não arcará com esse custo, pois não está considerado na composição de custo este risco inerente da atividade." },
      {
        n: "7.6",
        rev: true,
        t: "A responsabilidade financeira máxima agregada da GEOFOR por qualquer descumprimento, multa contratual, erro técnico de engenharia ou sinistro comprovado decorrente da execução das fundações objeto desta proposta fica estritamente limitada ao valor equivalente a 10% (dez por cento) do valor total dos serviços de mão de obra efetivamente executados, não respondendo a contratada em nenhuma hipótese por danos indiretos, lucros cessantes, perdas comerciais, quebra de receitas ou atrasos na inauguração comercial das novas dependências do Resort por parte do grupo hoteleiro CONTRATANTE.",
      },
    ],
  },
  {
    n: "8",
    titulo: "Prazos",
    itens: [
      { n: "8.1", t: "Mobilização e transporte de equipamentos e pessoal: a combinar." },
      { n: "8.2", t: "De instalação no canteiro: 01 dia." },
      {
        tipo: "cartoes",
        n: "8.3",
        rotulo: "De execução:",
        partes: [
          {
            pct: "66 dias úteis",
            t: "**Hélice Contínua** – o prazo estimado para execução das 885 estacas hélice contínua monitorada, em condições normais de trabalho, solo e clima, é de 66 dias úteis, com 02 equipamentos de grande porte em paralelo.",
          },
          {
            pct: "15 dias úteis",
            t: "**Metálicas** – o prazo estimado para execução das 83 estacas metálicas, em condições normais de trabalho, solo e clima, é de 15 dias úteis, com 01 equipamento.",
          },
        ],
      },
      {
        n: "8.4",
        rev: true,
        t: "**Paralisações por Força Maior e Intempéries Climáticas (Chuvas):** Considerando as características geotécnicas do solo litorâneo da Mata de São João – BA, a GEOFOR fica integralmente isenta de penalidades, multas contratuais ou imputação de atrasos causados por chuvas torrenciais ou índices pluviométricos que impeçam a circulação segura das máquinas pesadas nas pistas ou que comprometam a qualidade civil do concreto fluido. Os dias afetados por fortes precipitações e o período subsequente necessário para a secagem/restabelecimento da compactação do solo serão automaticamente estendidos ao prazo final de entrega.",
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
        t: "**Obstáculos Geológicos Ocultos:** Caso sejam interceptados no subsolo matacões de rocha sã, blocos de concreto de obras antigas, tubulações de concreto armado blindadas ou solo impenetrável à perfuração mecânica ordinária com o trado padrão, a GEOFOR paralisará o respectivo ponto. O tempo decorrente de tentativas de quebra, substituição de ponteiras avariadas ou redesenho locacional será computado como hora trabalhada extraordinária. Caso seja necessária metodologia especial (como perfuratrizes pneumáticas de rocha), os custos serão formalizados via Termo Aditivo.",
      },
    ],
  },
  {
    n: "9",
    titulo: "Aceite contratual",
    itens: [
      {
        tipo: "paragrafo",
        t: "A autorização por V.S.as., para colocação dos nossos equipamentos no canteiro de obra e consequente início dos serviços descritos acima, mesmo que verbal, implicará no aceite tácito de todas as cláusulas constantes desta proposta.",
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
