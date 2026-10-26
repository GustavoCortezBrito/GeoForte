# Proposta GEO 2701A/25 — Expansão Grand Palladium

Gera em PDF (A4) a proposta completa de contenções em estacas justapostas
para a expansão do Grand Palladium Imbassaí, com a identidade visual do site
da Geoforte. O conteúdo é o da proposta original da equipe (Word, 23/10/2026,
em `documento/`); só muda a forma, mais as correções listadas abaixo.

    capa → sumário → carta e cláusulas 1–10 → assinaturas
    → 11 memorial de cálculo (Doca; Recepção e Túnel)
    → Anexo B: abertura + 4 obras executadas → certificado GeoSelos original

## Gerar e conferir

    npm install          (uma vez)
    npm run gerar        → saida/Proposta GEO 2701A-25 - Grand Palladium.pdf
    npm run verificar    → compara o PDF gerado com o original

Precisa do Chrome instalado (ou `CHROME_PATH`). Fontes (Space Grotesk e
Manrope, licença OFL), logos e fotos ficam em `assets/`: não precisa de internet.
Os HTML intermediários ficam em `saida/html/`, úteis para inspecionar.

`npm run verificar` confere palavra por palavra a carta e as cláusulas 1–10
(devem aparecer só as correções e as mudanças de forma) e confere que todos os
números do memorial do original estão no gerado, na mesma quantidade. Rode
depois de qualquer mudança no texto.

## Onde está cada coisa

| Arquivo | Conteúdo |
| --- | --- |
| `dados/empresa.mjs` | código da proposta, data, dados da empresa, `config` |
| `dados/proposta.mjs` | carta, cláusulas 1–10, assinaturas, correções e pontos de atenção |
| `dados/memorial.mjs` | memorial de cálculo (11); os resultados por fase vêm de `memorial-resultados.json`, extraído do PDF original |
| `dados/obras.mjs` | Anexo B: obras, fotos, ficha técnica |
| `src/` | HTML e estilos de cada parte (capa, corpo, anexo, moldura) |
| `assets/certificado-geoselos.pdf` | última página do original, anexada sem alteração |

## Antes de enviar ao cliente

- **Tabela 01 (preço global):** não existe no PDF original, só a legenda. O
  PDF mostra um aviso tracejado no lugar. Preencha `linhas` no bloco
  `tabela-precos` de `dados/proposta.mjs`.
- **Anexo B:** campos `null` em `dados/obras.mjs` aparecem como placeholder
  laranja (bairro, ano, área, altura, estacas, execução e destaque de cada
  obra). Troque o `null` pelo dado e gere de novo. Nas obras 03 e 04, depois de
  confirmar as vigas de coroamento, mude `confirmar: true` para `false`.
- **Pontos de atenção** (mantidos como no original, para a equipe revisar):
  ver `PONTOS_DE_ATENCAO` em `dados/proposta.mjs`.

## Proposta web

A mesma proposta tem uma versão web no site, em `/propostas/grand-palladium`
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

## Revisões em amarelo

O original marca em amarelo as cláusulas 2.22, 4, 5.1, 5.2, 7.5, 7.6 e 8.4–8.7.
Por padrão o PDF sai limpo. Com `config.marcarRevisoes = true`
(`dados/empresa.mjs`) esses trechos ganham fundo laranja-claro e a etiqueta
"Revisado".

## Fotos

`assets/fotos/` tem só as 8 fotos indicadas no briefing, recortadas dos folders
(~970 px de largura): ficam moles impressas em A4. Para trocar por originais em
alta, salve com o mesmo nome. `manakai-1.jpg` e `manakai-2.jpg` não são usadas
(parecem processadas por IA); `imbui-2.jpg` também mostra textura de
processamento quando ampliada.
