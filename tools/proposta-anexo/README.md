# Anexo B — Obras executadas (proposta GEO 2701A/25)

Gera em PDF (A4, retrato, 5 páginas) o Anexo B da proposta para a expansão do
Grand Palladium Imbassaí, com a identidade visual do site da Geoforte.
Substitui as páginas 28 a 34 do PDF da proposta; o certificado GeoSelos
original continua como última página e não é refeito aqui.

## Gerar

    npm install
    npm run gerar

Saída em `saida/`: `anexo-b-obras-executadas.pdf` e o `anexo-b.html` usado
para gerá-lo. Precisa do Chrome instalado (ou `CHROME_PATH`) e de internet
para baixar as fontes da marca (Space Grotesk e Manrope).

## Preencher os dados

Tudo fica em `dados.mjs`. Campo `null` aparece no PDF como placeholder
laranja tracejado. Para preencher, troque o `null` pelo texto e gere de novo:
bairro, ano, área de contenção, altura de escavação, estacas, execução e o
destaque de cada obra. Nas obras 03 e 04, depois de confirmar as vigas de
coroamento, mude `confirmar: true` para `false`.

## Fotos

`assets/fotos/` tem só as 8 fotos indicadas no briefing. As versões atuais
foram recortadas dos folders (~970 px de largura) e ficam moles impressas
em A4. Para trocar por originais em alta, salve com o mesmo nome do arquivo.
`manakai-1.jpg` e `manakai-2.jpg` não são usadas (parecem processadas por IA).
