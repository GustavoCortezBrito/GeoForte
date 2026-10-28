# Propostas da Expansão Grand Palladium

Gera em PDF (A4), com a identidade visual do site da Geoforte, as duas propostas
da expansão do Grand Palladium Imbassaí, e um Word editável de cada uma. O
conteúdo é o da proposta original da equipe; só muda a forma, mais as correções
de digitação listadas em `CORRECOES` (o que muda sentido fica como está e vai
para `PONTOS_DE_ATENCAO`).

| Proposta | Pacote de dados | PDF |
| --- | --- | --- |
| Contenções em estacas justapostas, GEO 2701A/25 (Word de 23/10/2026, em `documento/`) | `dados/*.mjs` | `saida/Proposta GEO 2701A-25 - Grand Palladium.pdf` |
| Fundações em hélice contínua monitorada e estacas metálicas, GEO 2993A/26 (Word de 28/10/2026, em `documento/fundacao/`) | `dados/fundacao/` | `saida/Proposta GEO 2993A-26 - Fundação - Grand Palladium.pdf` |

    capa → sumário → carta e cláusulas 1–10 → assinaturas
    → 11 memorial de cálculo → anexo de obras executadas → certificado GeoSelos original

## Gerar e conferir

    npm install                  (uma vez)
    npm run gerar                → PDF da contenção
    npm run gerar:fundacao       → PDF da fundação
    npm run docx                 → Word editável da contenção
    npm run docx:fundacao        → Word editável da fundação
    npm run verificar            → compara o PDF da contenção com o original
    npm run verificar:fundacao   → compara o PDF da fundação com o Word original

Precisa do Chrome instalado (ou `CHROME_PATH`). Fontes (Space Grotesk e
Manrope, licença OFL), logos e fotos ficam em `assets/`: não precisa de internet.
Os HTML intermediários ficam em `saida/html/<proposta>/`, úteis para inspecionar.
A pasta `saida/` não vai para o git.

`npm run verificar` confere palavra por palavra a carta e as cláusulas 1–10
(devem aparecer só as correções e as mudanças de forma) e confere os números do
memorial. Na fundação ele confere também todo o texto do memorial e todos os
números das planilhas do Excel que o Word traz como imagem (preços, sondagens,
estaqueamento por pilar, quantitativos). Rode depois de qualquer mudança.

## Como a mesma máquina faz as duas propostas

`src/pacote.mjs` escolhe o pacote de dados (`--proposta=fundacao` ou a variável
`PROPOSTA`; padrão: contenção). O pacote reúne texto, memorial, anexo, capa e nomes
de arquivo; estilos, moldura, sumário e paginação são os mesmos. O memorial tem um
módulo por proposta (`src/memorial-contencao.mjs`, `src/memorial-fundacao.mjs`) e o
anexo tem dois formatos (contenção: mosaico de fotos, etapas e ficha; fundação: uma
foto por obra).

## Onde está cada coisa

| Arquivo | Conteúdo |
| --- | --- |
| `dados/empresa.mjs` | dados da empresa, `config` e o código da contenção (a fundação tem o seu) |
| `dados/proposta.mjs`, `memorial.mjs`, `obras.mjs` | contenção: carta e cláusulas, memorial (os resultados por fase vêm de `memorial-resultados.json`, extraído do PDF original), anexo B |
| `dados/contencao.mjs` | monta o pacote da contenção a partir dos arquivos acima (a proposta web importa os mesmos arquivos) |
| `dados/fundacao/` | fundação: `proposta.mjs` (carta, cláusulas, correções, pontos de atenção), `memorial.mjs`, `obras.mjs`, `index.mjs`; `tabelas.json` e `equacoes.json` são gerados pelos importadores |
| `importar/` | importadores do Word da fundação (ver abaixo) |
| `src/` | HTML e estilos de cada parte (capa, corpo, anexo, moldura) e o gerador do Word (`word.mjs`) |
| `assets/certificado-geoselos.pdf` | última página, anexada sem alteração |

## Fundação: do Word ao PDF

O Word da fundação traz as planilhas do Excel coladas como imagem (EMF) e as
fórmulas como equações. Nada disso foi digitado de novo:

    npm run importar:fundacao

- `importar/tabelas.mjs` lê o desenho de cada imagem EMF (textos, posições, cores)
  e remonta as tabelas em `dados/fundacao/tabelas.json`: preços (Tabelas 01 a 03),
  sondagens, carga admissível, cargas de trabalho, estaqueamento por pilar de cada
  módulo e quantitativos. Confere as somas (os preços fecham: Tabela 01 = R$ 4.415.625,00)
  e as quantidades de estacas por módulo.
- `importar/figuras.mjs` converte as 29 equações para MathML (o Chrome desenha no PDF)
  e guarda o OMML original (para o Word editável); copia as figuras e fotos para
  `assets/fundacao/`.
- `importar/docx.mjs` lê o texto do Word (com a numeração automática resolvida);
  `npm run verificar:fundacao` usa para conferir o PDF.

O texto das cláusulas e do memorial, o anexo e a capa são escritos à mão em
`dados/fundacao/*.mjs`, com as correções registradas.

## Word editável

`npm run docx` e `npm run docx:fundacao` geram, em `saida/`, o "texto para
revisão": carta, cláusulas com a numeração do PDF, tabelas do Word (nada de
imagem), as equações do memorial como equações do Word, as obras do anexo, os
pontos de atenção (com coluna de decisão) e as correções já aplicadas. Trechos
amarelos são as cláusulas revisadas.

Para trazer as edições de volta ao PDF: peça o arquivo editado, compare com o
original (`node importar/docx.mjs <arquivo>` imprime o texto, um bloco por linha;
use `git diff --no-index a.txt b.txt` nas duas saídas) e passe as mudanças para
`dados/`. Gere o PDF de novo e rode o `verificar`.

## Antes de enviar ao cliente

Contenção:

- **Tabela 01 (preço global):** não existe no PDF original, só a legenda. O
  PDF mostra um aviso tracejado no lugar. Preencha `linhas` no bloco
  `tabela-precos` de `dados/proposta.mjs`.
- **Anexo B:** campos `null` em `dados/obras.mjs` aparecem como placeholder
  laranja (bairro, ano, área, altura, estacas, execução e destaque de cada
  obra). Troque o `null` pelo dado e gere de novo. Nas obras 03 e 04, depois de
  confirmar as vigas de coroamento, mude `confirmar: true` para `false`.

Fundação:

- **Decisões:** a lista `PONTOS_DE_ATENCAO` de `dados/fundacao/proposta.mjs` (e o
  fim do Word editável) traz o que precisa ser decidido: destinatário e datas da
  carta, fck 30 × 40 MPa, preços unitários da cláusula 5.1 × Tabelas 02 e 03, itens
  da Tabela 01 sem valor, PDA, juros e adicional de fim de semana, H02 sem o pilar
  PC70 e outros.
- **Anexo A:** cada obra tem uma foto e uma legenda que só descreve o que se vê.
  Para acrescentar dados da obra (local, ano, estacas…), preencha `ficha` em
  `dados/fundacao/obras.mjs`; sem dado, nada aparece.
- **Dados com preço:** `dados/fundacao/` e o Word de origem trazem o preço global
  da proposta. O repositório é público: não publique sem decidir isso antes.

## Proposta web (contenção)

A proposta de contenção tem uma versão web no site, em `/propostas/grand-palladium`
(`src/app/propostas/grand-palladium/`). É um link privado: fora do Google
(noindex), do sitemap e do menu. A página lê os mesmos arquivos de `dados/`
(via `src/lib/propostas/grand-palladium.ts`), então texto, números e cláusulas
mudam junto com o PDF.

- `npm run gerar` também copia o PDF para `public/propostas/grand-palladium/`,
  de onde a página oferece o download. Gere de novo antes de publicar.
- Na web, campo `null` de `dados/obras.mjs` não aparece (no PDF ele vira
  placeholder). A Tabela 01 vazia aparece como aviso nos dois.
- Vídeos e imagens de fundo da página foram gerados no Higgsfield e são só
  ilustrativos (a página diz isso). O prompt de cada um está gravado no
  próprio arquivo.

A fundação ainda não tem página web.

## Revisões em amarelo

O original da contenção marca em amarelo as cláusulas 2.22, 4, 5.1, 5.2, 7.5,
7.6 e 8.4–8.7; o da fundação, as 2.25, 4, 5.1, 5.2, 7.5, 7.6 e 8.4–8.7. Por
padrão o PDF sai limpo. Com `config.marcarRevisoes = true` (`dados/empresa.mjs`)
esses trechos ganham fundo laranja-claro e a etiqueta "Revisado". No Word
editável elas sempre aparecem com marca-texto amarela.

## Fotos

`assets/fotos/` tem as 20 fotos originais que a equipe mandou por WhatsApp em
26/10/2026 (até 1600 px), com o nome da obra (`manakai-01.jpg`…). A origem de
cada uma (arquivo original, álbum) está gravada no próprio arquivo. Em
`dados/obras.mjs`, `fotos` lista todas (a 1ª é a principal) e `pdf` escolhe as
2 ou 3 da página do PDF; a proposta web mostra todas na galeria.

- `manakai-01` e `-02` são os originais sem tratamento de
  `documento/fotos/manakai-1.jpg` e `-2.jpg` (essas continuam proibidas). A
  `manakai-01` foi recortada embaixo para tirar a data gravada pela câmera.
- As três da Riserva Vita vieram no fim do álbum "Nouvelle Blues", mas o
  briefing atribui essas cenas à Riserva Vita. Até a equipe confirmar, a página
  dela no PDF mostra um aviso `[confirmar…]` (`fotosConfirmar`).

`assets/fundacao/obras/` tem as quatro fotos do anexo da fundação (tiradas do
Word) e `assets/fundacao/figuras/` as figuras do memorial.
