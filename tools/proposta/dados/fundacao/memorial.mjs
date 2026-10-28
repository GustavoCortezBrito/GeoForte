/**
 * Memorial de cálculo (11) da proposta GEO 2993A/26: texto, equações, figuras e as tabelas do
 * Excel que o Word trazia como imagem (reconstruídas de tabelas.json, sem digitar nada).
 *
 * Blocos (ver src/memorial-fundacao.mjs): lista · p · sub · figura · equacao · onde · calculo ·
 * tabela · estaqueamento · obs · quebra. Marcação: **negrito**; `{{n}}` no texto de um `p` é a
 * equação n de `eqs`. A numeração do Word tinha dois “11.6” e duas “Tabela 9”; aqui 11.1 a 11.11
 * e Tabelas 1 a 11 seguem em sequência (ver CORRECOES em proposta.mjs).
 */
import { tabelas, eq } from "./dados.mjs";

// ─── Tabelas montadas a partir de tabelas.json ───────────────────────────────────────────────────
const S = tabelas.sondagens;
const tabelaSondagens = {
  tipo: "tabela",
  legenda: "Tabela 1 – Resumo das sondagens à percussão e mistas.",
  cabecalho: [[{ t: S.titulo, cs: S.colunas.length }], S.colunas],
  linhas: S.linhas.map((l) => l.map((v, i) => (i === 0 ? { t: v, c: "nome" } : v))),
};

const CA = tabelas.cargaAdmissivel;
const tabelaCargaAdmissivel = {
  tipo: "tabela",
  legenda: "Tabela 4 – Carga Admissível para cada sondagem.",
  cabecalho: [
    [{ t: "Furo", rs: 3 }, { t: "Carga Admissível Estacas Hélice Contínua (tf) – MÉTODO DÉCOURT", cs: 6 }],
    CA.comprimentos.map((t) => ({ t: t.replace(/\s*=\s*/, " = "), cs: 2 })),
    CA.comprimentos.flatMap(() => CA.diametros),
  ],
  // sondagens que pararam no impenetrável: uma célula “L=5m” cobre as duas colunas de 6,0 m
  linhas: CA.linhas.map((l) => [
    { t: l.furo, c: "nome" },
    ...(l.unico ? [{ t: l.valores[0], cs: 2, c: "nota" }, ...l.valores.slice(2)] : l.valores),
  ]),
};

const CT = tabelas.cargasTrabalho;
const tabelaCargasTrabalho = {
  tipo: "tabela",
  legenda: "Tabela 5 – Cargas de trabalho adotadas em função do diâmetro e comprimento.",
  cabecalho: [["Estaca", { t: "Resumo das Cargas de trabalho adotadas", cs: 3 }]],
  linhas: CT.linhas.map((l) => [{ t: l.diam, c: "nome" }, ...l.pares.map((p) => `${p.comprimento} → até ${p.carga}`)]),
};

const Q = tabelas.quantitativos;
const tabelaQuantitativos = {
  tipo: "tabela",
  legenda: "Tabela 11 – Quantitativos das Estacas por Módulo.",
  classe: "mf-quant",
  cabecalho: [["Módulo", "Quant.", "Diâm. (cm)", "Comp. Unit. (m)", "Comp. Total (m)", "Aço (kg)", "Concreto +50% (m³)", "Escavação +15% (m³)"]],
  linhas: Q.modulos.flatMap((m) =>
    m.linhas.map((l, i) => [
      ...(i === 0 ? [{ t: m.nome, rs: m.linhas.length, c: "nome" }] : []),
      l.quant,
      l.diam,
      l.compUnit,
      l.compTotal,
      ...(i === 0 ? [{ t: m.aco, rs: m.linhas.length, c: "tot" }, { t: m.concreto, rs: m.linhas.length, c: "tot" }, { t: m.escavacao, rs: m.linhas.length, c: "tot" }] : []),
    ]),
  ),
};

const E = tabelas.estaqueamento;
const estaqueamento = (legenda, grupos, classe) => ({ tipo: "estaqueamento", legenda, grupos, classe });

/** Símbolo As (área de aço): no Word a lista “Onde:” repetia o símbolo Ac. */
const As = "<math><msub><mrow><mi>A</mi></mrow><mrow><mi>s</mi></mrow></msub></math>";

const modulo = (t) => ({ tipo: "sub", t });
/** Célula em destaque (coluna da estaca hélice contínua na Tabela 3). */
const H = (t) => ({ t, c: "dest" });

export const memorial = {
  tipo: "fundacao",
  n: "11",
  titulo: "Memorial de cálculo",
  secoes: [
    {
      n: "11.1",
      titulo: "Arquivos de referência",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "Plantas de locação e cargas dos pilares de autoria da ProEst Projeto e Tecnologia de Estruturas, arquivos: ‘SSAUH1_STR_PE_BP_002_CAR_SS_R04’, ‘SSAUH1_STR_PE_EP_002_CAR_SS_R02’, ‘SSAUH1_STR_PE_H1_000_CAR_SS_R03’, ‘SSAUH1_STR_PE_H2_000_CAR_SS_R01’ e ‘SSAUH1_STR_PE_H3_001_CAR_SS_R01’.",
            "Relatórios de sondagens à percussão de autoria da TransGeo Geotecnia, arquivo: “001 - Relatório de Sondagem” datado de 03/07/2025; e arquivo “001 - Relatório de Sondagem_260902_190936” datado de 26/06/2026.",
          ],
        },
      ],
    },
    {
      n: "11.2",
      titulo: "Normas aplicáveis",
      blocos: [
        {
          tipo: "lista",
          itens: ["**ABNT NBR 6118/2023** – Projeto de Estruturas de Concreto", "**ABNT NBR 6122/2022** – Projeto e Execução de Fundações"],
        },
      ],
    },
    {
      n: "11.3",
      titulo: "Concreto das estacas hélice contínua monitorada",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "Resistência característica: **fck ≥ 40 MPa** (28 dias);",
            "Consumo mínimo: **350 kg de cimento/m³**;",
            "Fator a/c ≤ 0,45;",
            "Abatimento (Slump Test): 220 a 260 mm;",
            "Exsudação ≤ 4%;",
            "Agregados: 4,75 a 12,5 mm;",
            "Lançamento obrigatório no mesmo dia da perfuração, com tremonha de ≥ 1,50 m.",
          ],
        },
        {
          tipo: "p",
          t: "Para se obter a classe do concreto ou resistência característica do concreto (fck) se faz necessário saber a Classe de Agressividade Ambiental – CAA. Esta, por sua vez, é definida segundo a Tabela 6.1 da norma brasileira ABNT NBR 6118/2023:",
        },
        { tipo: "figura", arquivo: "fundacao/figuras/nbr6118-tabela-6-1.png", alt: "ABNT NBR 6118/2023, Tabela 6.1 – Classes de agressividade ambiental (CAA)", largura: "122mm" },
        {
          tipo: "p",
          t: "A obra está localizada em uma região litorânea em Mata de São João – BA, ficando dentro de uma área de solos salinos. Desta maneira, a classificação se enquadra na classe de agressividade ambiental forte CAA III.",
        },
        {
          tipo: "p",
          t: "Através da Tabela 4 da norma brasileira ABNT NBR 6122/2024 obtém-se a definição da classe do concreto ou resistência característica do concreto (fck), bem como outras informações para o dimensionamento das fundações:",
        },
        { tipo: "figura", arquivo: "fundacao/figuras/nbr6122-tabela-4.png", alt: "ABNT NBR 6122, Tabela 4 – Estacas moldadas in loco e tubulões: parâmetros para dimensionamento", largura: "150mm" },
      ],
    },
    {
      n: "11.4",
      titulo: "Armações das estacas",
      blocos: [{ tipo: "lista", itens: ["Aço CA-50 em barras longitudinais e estribos."] }],
    },
    {
      n: "11.5",
      titulo: "Dados geotécnicos – sondagens",
      blocos: [
        {
          tipo: "p",
          t: "A litologia do solo local pode ser visualizada através dos relatórios de sondagens à percussão de autoria da TransGeo Geotecnia, arquivo: “001 - Relatório de Sondagem” datado de 03/07/2025; e arquivo “001 - Relatório de Sondagem_260902_190936” datado de 26/06/2026.",
        },
        {
          tipo: "p",
          t: "Foram realizados 05 furos de sondagem à percussão contidos no relatório datado de 26/05/2026, sendo que a profundidade até atingir o impenetrável variou de 4,49m a 5,61m nos SP-03C a SP-05E e nos demais furos paralisando com 12,45 m como limite de sondagem estabelecido pelo cliente, não atingindo o impenetrável SPT.",
        },
        {
          tipo: "p",
          t: "Já no relatório datado de 03/07/2025 foram executados 51 furos de sondagem à percussão paralisados com a profundidade de 8,45 m como limite de sondagem estabelecido pelo cliente, não atingindo o impenetrável SPT em nenhum deles.",
        },
        {
          tipo: "p",
          t: "É possível observar que em sua maioria o solo é uma areia fina a média de pouco a medianamente compacta. Em geral os valores de Nspt aumentam conforme profundidade e foi encontrado o nível d’água em todos os furos de sondagem.",
        },
        {
          tipo: "p",
          t: "Abaixo encontra-se a locação das sondagens à percussão mais recentes encontrada no arquivo “001 - Relatório de Sondagem_260902_190936”:",
        },
        {
          tipo: "figura",
          arquivo: "fundacao/figuras/locacao-sondagens.jpg",
          legenda: "Figura 1 – Locação dos furos das sondagens à percussão.",
          alt: "Imagem de satélite com a locação dos furos SP-01A, SP-02B, SP-03C, SP-04D e SP-05E",
          largura: "150mm",
        },
        {
          tipo: "p",
          t: "Seguem abaixo os perfis das sondagens à percussão do terreno utilizados para o dimensionamento das fundações: SP-01A, SP-02B, SP-03C, SP-04D e SP-05E:",
        },
        { tipo: "figura", pagina: true, arquivo: "fundacao/figuras/sondagem-sp-01a.jpg", legenda: "Figura 2 – Furo de Sondagem SP-01A.", alt: "Perfil de sondagem à percussão SP-01A" },
        { tipo: "figura", pagina: true, arquivo: "fundacao/figuras/sondagem-sp-02b.jpg", legenda: "Figura 3 – Furo de Sondagem SP-02B.", alt: "Perfil de sondagem à percussão SP-02B" },
        { tipo: "figura", pagina: true, arquivo: "fundacao/figuras/sondagem-sp-03c.jpg", legenda: "Figura 4 – Furo de Sondagem SP-03C.", alt: "Perfil de sondagem à percussão SP-03C" },
        { tipo: "figura", pagina: true, arquivo: "fundacao/figuras/sondagem-sp-04d.jpg", legenda: "Figura 5 – Furo de Sondagem SP-04D.", alt: "Perfil de sondagem à percussão SP-04D" },
        { tipo: "figura", pagina: true, arquivo: "fundacao/figuras/sondagem-sp-05e.jpg", legenda: "Figura 6 – Furo de Sondagem SP-05E.", alt: "Perfil de sondagem à percussão SP-05E" },
        { tipo: "p", t: "A seguir encontra-se o resumo das principais informações das sondagens à percussão e mistas da obra:" },
        tabelaSondagens,
        { tipo: "obs", rotulo: "Legenda:", t: "Cota B.F. – Cota de Boca de Furo das sondagens;\nProf. N.A – Profundidade do Nível d’água" },
      ],
    },
    {
      n: "11.6",
      titulo: "Carga admissível das estacas hélice contínua monitorada",
      blocos: [
        {
          tipo: "p",
          t: "Usualmente o cálculo da capacidade de carga geotécnica de estacas é feito a partir de métodos semiempíricos que correlacionam ensaios estáticos ou dinâmicos com os valores Nspt de sondagens. Para o dimensionamento apresentado através do referido projeto de fundações foi utilizado o método Décourt-Quaresma (1978) cuja expressão geral para determinação da carga admissível geotécnica de uma estaca é dada pela equação a seguir:",
        },
        { tipo: "equacao", mathml: eq(0) },
        {
          tipo: "onde",
          itens: [
            [eq(1), "= área da base;"],
            [eq(2), "= coeficientes que dependem do tipo de solo e de estaca;"],
            [eq(3), "= coeficiente que depende do tipo de solo na base da estaca;"],
            [eq(4), "= média do NSPT da ponta, um imediatamente superior e um imediatamente inferior a ela;"],
            [eq(5), "= perímetro do fuste;"],
            [eq(6), "= média do NSPT no fuste."],
          ],
        },
        {
          tipo: "tabela",
          legenda: "Tabela 2 – Valores do coeficiente C.",
          classe: "mf-estreita",
          cabecalho: [["Tipo de Solo", "C (tf/m²)"]],
          linhas: [
            [{ t: "Areia", c: "nome" }, "40"],
            [{ t: "Silte Arenoso", c: "nome" }, "25"],
            [{ t: "Silte Argiloso", c: "nome" }, "20"],
            [{ t: "Argila", c: "nome" }, "12"],
          ],
        },
        {
          tipo: "tabela",
          legenda: "Tabela 3 – Valores dos fatores de correção α e β.",
          cabecalho: [
            [{ t: "Tipo de Solo", cs: 2 }, "Estacas Cravadas", "Estacas Escavadas (em geral)", "Estacas Escavadas (c/ bentonita)", { t: "Estaca Hélice Contínua", c: "dest" }, "Estacas Raiz", "Injetadas sob alta pressão"],
          ],
          // a coluna da hélice contínua (a que vale para esta obra) fica em destaque
          linhas: [
            [{ t: "Areia", rs: 2, c: "nome" }, { t: "α", c: "simb" }, "1,00", "0,85", "0,85", H("0,30"), "0,85", "1,00"],
            [{ t: "β", c: "simb" }, "1,00", "0,80", "0,90", H("1,00"), "1,50", "3,00"],
            [{ t: "Solos Intermediários", rs: 2, c: "nome" }, { t: "α", c: "simb" }, "1,00", "0,60", "0,60", H("0,30"), "0,60", "1,00"],
            [{ t: "β", c: "simb" }, "1,00", "0,65", "0,75", H("1,00"), "1,50", "3,00"],
            [{ t: "Argila", rs: 2, c: "nome" }, { t: "α", c: "simb" }, "1,00", "0,50", "0,50", H("0,30"), "0,50", "1,00"],
            [{ t: "β", c: "simb" }, "1,00", "0,50", "0,60", H("1,00"), "1,50", "3,00"],
          ],
        },
        {
          tipo: "p",
          t: "Abaixo encontra-se o resumo dos resultados de carga admissível para cada furo de sondagem por meio do método Décourt-Quaresma (1978) supracitado:",
        },
        tabelaCargaAdmissivel,
        { tipo: "p", t: "Para o SP-01A e SP-02B foram analisados os casos das fundações executadas no nível do térreo e no nível do subsolo." },
      ],
    },
    {
      n: "11.7",
      titulo: "Carga estrutural das estacas hélice contínua monitorada",
      blocos: [
        {
          tipo: "p",
          t: "O cálculo da capacidade de carga estrutural de estacas corresponde a carga que pode ser absorvida pela seção de concreto empregada, dimensionada como um pilar não submetido à flambagem devido ao confinamento lateral pelo solo. A expressão geral para determinação da carga admissível estrutural de uma estaca é dada pela equação a seguir:",
        },
        { tipo: "equacao", mathml: eq(7) },
        { tipo: "p", t: "Sendo, {{0}} e {{1}}", eqs: [eq(8), eq(9)] },
        {
          tipo: "onde",
          itens: [
            [eq(10), "= área de concreto da estaca;"],
            [eq(11), "= resistência característica do concreto à compressão;"],
            [As, "= área de aço da estaca;"],
            [eq(13), "= resistência característica do aço à compressão;"],
            [eq(14), "= coeficiente de ponderação da resistência à compressão do concreto;"],
            [eq(15), "= coeficiente de ponderação da resistência à compressão do aço."],
          ],
        },
        {
          tipo: "p",
          t: "Através da Tabela 4 da norma brasileira ABNT NBR 6122/2024, para a CAA III obtém-se como classe do concreto C40 (fck), {{0}} = 3,6 e mínimo de 0,4% de taxa de armadura. O aço utilizado é o CA-50, logo {{1}} = 500 MPa e {{2}} = 1,15. Tem-se então o seguinte:",
          eqs: [eq(16), eq(17), eq(18)],
        },
        {
          tipo: "calculo",
          titulo: "Estacas Ø400 mm",
          eqs: [eq(19), eq(20), eq(21), eq(22)],
          nota: "armadura mínima = 0,4%",
          notaApos: 1,
          resultado: eq(23),
        },
        {
          tipo: "calculo",
          titulo: "Estacas Ø300 mm",
          eqs: [eq(24), eq(25), eq(26), eq(27)],
          nota: "armadura mínima = 0,4%",
          notaApos: 1,
          resultado: eq(28),
        },
      ],
    },
    {
      n: "11.8",
      titulo: "Carga de trabalho das estacas hélice contínua monitorada",
      quebra: true,
      blocos: [
        {
          tipo: "p",
          t: "Conforme item 5.6 da norma brasileira ABNT NBR 6122/2024 “deve ser considerado o peso próprio de blocos de coroamento ou sapatas, ou no mínimo 5% da carga vertical permanente”, sendo então considerado para o dimensionamento das fundações o acréscimo de 5% da carga vertical.",
        },
        {
          tipo: "p",
          t: "Vale ressaltar também que segundo o item 6.3.2 da norma brasileira NBR 6122/2022 é permitido majorar em até 15% a carga admissível da estaca quando o vento for a ação variável principal.",
        },
        { tipo: "p", t: "A seguir é apresentado o resumo das cargas de trabalho adotadas em função do comprimento das estacas e diâmetro:" },
        tabelaCargasTrabalho,
        {
          tipo: "p",
          t: "Abaixo apresentam-se os resultados obtidos após definição das configurações das fundações para cada pilar. É possível observar a quantidade de estacas por pilar, o diâmetro da estaca e o comprimento dela, bem como a carga de trabalho por estaca em cada pilar:",
        },
        modulo("MÓDULO PISCINAS – Estacas Hélice Contínua Ø300 mm"),
        estaqueamento("Tabela 6 – Resultado do estaqueamento do Módulo Piscinas.", E.piscinas.map((g) => ({ rotulo: null, linhas: g.linhas }))),
        { tipo: "obs", t: "O pilar P7 veio sem a carga discriminada na planta de locação e cargas dos pilares, sendo utilizada a do projeto original de fundação." },
        modulo("MÓDULO RECEPÇÃO – Estacas Hélice Contínua Ø300 mm e Ø400 mm, e Estacas Metálicas Tubo TP 5”"),
        estaqueamento("Tabela 7 – Resultado do estaqueamento do Módulo Recepção.", E.recepcao.map((g) => ({ rotulo: g.rotulo, linhas: g.linhas }))),
        modulo("MÓDULO APARTAMENTOS H01 – Estacas Hélice Contínua Ø300 mm"),
        estaqueamento("Tabela 8 – Resultado do estaqueamento do Módulo Apartamentos H01.", E.h01.map((g) => ({ rotulo: g.rotulo, linhas: g.linhas }))),
        {
          tipo: "obs",
          t: "Os pilares PA34 a PA36, PA47 a PA58, PB33, PB37 a PB42, PC40 a PC47, PC52 a PC59 estão previstos para nascerem diretamente sobre a cortina de contenção, por isso não foram indicados na tabela acima.",
        },
        modulo("MÓDULO APARTAMENTOS H02 – Estacas Hélice Contínua Ø300 mm"),
        estaqueamento("Tabela 9 – Resultado do estaqueamento do Módulo Apartamentos H02.", E.h02.map((g) => ({ rotulo: g.rotulo, linhas: g.linhas }))),
        {
          tipo: "obs",
          t: "Os pilares PA34 a PA36, PA47 a PA58, PB33, PB37 a PB42, PC40 a PC47, PC52 a PC59 estão previstos para nascerem diretamente sobre a cortina de contenção, por isso não foram indicados na tabela acima.",
        },
        modulo("MÓDULO APARTAMENTOS H03 – Estacas Hélice Contínua Ø300 mm"),
        // no Word o rótulo “APARTAMENTOS 03 - H03” cobria as duas partes da tabela; é um grupo só
        estaqueamento("Tabela 10 – Resultado do estaqueamento do Módulo Apartamentos H03.", [{ rotulo: null, linhas: E.h03.flatMap((g) => g.linhas) }]),
      ],
    },
    {
      n: "11.9",
      titulo: "Quantitativos das estacas",
      quebra: true,
      blocos: [
        { tipo: "sub", t: "QUANTITATIVO TOTAL DOS 5 MÓDULOS:" },
        {
          tipo: "lista",
          itens: [
            "Estacas Ø300 mm: 746 unidades (L concretado = 6,0 a 10,0 m ; L armado = 4,0 a 6,0 m)",
            "Estacas Ø400 mm: 139 unidades (L concretado = 8,0 a 10,0 m ; L armado = 4,0 a 6,0 m)",
            "**Volume total de concreto**: 925,5 m³ (sobreconsumo de 50%)",
            "**Volume total de escavação**: 709,6 m³ (empolamento de 15%)",
            "**Consumo de aço CA-50**: 21.689,2 kg",
            "Estacas Metálicas Tubo TP 5”: 83 unidades (L cravado = 5,0 a 7,0 m)",
          ],
        },
        { tipo: "sub", t: "QUANTITATIVOS POR MÓDULO:" },
        tabelaQuantitativos,
        { tipo: "lista", itens: ["Estacas Metálicas Tubo TP 5”:\nComprimento Total previsto = 514,0 m\nPeso Total previsto = 18.504,0 kg"] },
        { tipo: "sub", t: "DETALHAMENTO DAS ARMAÇÕES DAS ESTACAS:", quebra: true },
        {
          tipo: "figura",
          titulo: "**Estacas Hélice Contínua Monitorada Ø300 mm – Comprimento Armado = 4,0 m:**",
          arquivo: "fundacao/figuras/armacao-300-4m.png",
          legenda: "Figura 7 – Armação das estacas Hélice Contínua Monitorada Ø300 mm – Comprimento Armado = 4,0 m.",
          alt: "Detalhamento da armação das estacas Ø300 mm, comprimento armado 4,0 m",
          largura: "112mm",
        },
        {
          tipo: "figura",
          pagina: true,
          titulo: "**Estacas Hélice Contínua Monitorada Ø300 mm – Comprimento Armado = 6,0 m:**",
          arquivo: "fundacao/figuras/armacao-300-6m.png",
          legenda: "Figura 8 – Armação das estacas Hélice Contínua Monitorada Ø300 mm – Comprimento Armado = 6,0 m.",
          alt: "Detalhamento da armação das estacas Ø300 mm, comprimento armado 6,0 m",
          largura: "112mm",
        },
        {
          tipo: "figura",
          pagina: true,
          titulo: "**Estacas Hélice Contínua Monitorada Ø400 mm – Comprimento Armado = 4,0 m:**",
          arquivo: "fundacao/figuras/armacao-400-4m.png",
          legenda: "Figura 9 – Armação das estacas Hélice Contínua Monitorada Ø400 mm – Comprimento Armado = 4,0 m.",
          alt: "Detalhamento da armação das estacas Ø400 mm, comprimento armado 4,0 m",
          largura: "112mm",
        },
        {
          tipo: "figura",
          pagina: true,
          titulo: "**Estacas Hélice Contínua Monitorada Ø400 mm – Comprimento Armado = 6,0 m:**",
          arquivo: "fundacao/figuras/armacao-400-6m.png",
          legenda: "Figura 10 – Armação das estacas Hélice Contínua Monitorada Ø400 mm – Comprimento Armado = 6,0 m.",
          alt: "Detalhamento da armação das estacas Ø400 mm, comprimento armado 6,0 m",
          largura: "112mm",
        },
      ],
    },
    {
      n: "11.10",
      titulo: "Procedimento executivo das estacas hélice contínua monitorada",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "Perfuração mecanizada dos fustes das estacas com equipamento adequado até a profundidade especificada em projeto, devendo-se confirmar as características do solo através da comparação com a sondagem mais próxima.",
            "Limpeza do fuste antes da concretagem.",
            "Colocação da armadura imediatamente após a concretagem com o uso de espaçadores afim de garantir o cobrimento mínimo especificado.",
            "Concretagem com lançamento contínuo. Deve-se utilizar um funil que tenha comprimento mínimo de 1,50 m com a finalidade de orientar o fluxo de concreto.",
            "Registro de profundidade, diâmetro e volume de concreto consumido.",
            "As estacas devem ser concretadas no mesmo dia da perfuração diretamente do caminhão betoneira. Caso não seja possível o acesso do caminhão, o lançamento do concreto deve ser bombeado e com uso de mangotes ou tremonha.",
            "Não se deve executar estacas com entre eixos menores que 3 vezes o diâmetro em intervalo inferior a 12 h. Esta distância refere-se à estaca de maior diâmetro.",
          ],
        },
      ],
    },
    {
      n: "11.11",
      titulo: "Critérios de aceitação das estacas",
      blocos: [
        {
          tipo: "lista",
          itens: [
            "Profundidade mínima das estacas conforme projeto. Caso não seja atingida a profundidade mínima especificada, o projetista das fundações deverá ser consultado.",
            "Desvios de locação, medidos na cota de arrasamento, ≤ 10% do diâmetro da estaca correspondente. Valores superiores devem ser analisados pelo projetista das fundações;",
            "O fck do concreto das estacas hélice contínua monitorada tem que ser, no mínimo, o especificado neste projeto com tolerância de 5%;",
            "O desvio de prumo aceitável para a estaca é de 1º.",
            "Rejeição de estacas com colapso de fuste ou falha na concretagem;",
            "Tolerância de arrasamento ≤ 2 cm em relação à cota de projeto;",
            "É necessário a adoção de medidas de controle de execução das estacas metálicas, como nega em 100% das estacas e diagrama de cravação em pelo menos 10% das estacas.",
          ],
        },
      ],
    },
  ],
  /** Fecho do memorial, como no Word: local, data e os engenheiros responsáveis. */
  fecho: {
    local: "Salvador – BA, 28 de outubro de 2026.",
    nomes: ["Eng. Denise Bresciani", "Eng. Lucas Fonseca Jordão", "Eng. André Felipe de Oliveira Carvalho"],
  },
};
