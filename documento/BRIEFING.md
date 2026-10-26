# Briefing — Anexo de obras da proposta Geoforte (Grand Palladium)

## Objetivo
Gerar em PDF (A4, retrato) as páginas do **Anexo B — Obras executadas** da proposta comercial
GEO 2701A/25 da Geoforte para a expansão do Grand Palladium Imbassaí Resort & Spa.
Usar a identidade visual do site da Geoforte (cores, fontes, logo em vetor) que está neste projeto.

As páginas vão substituir as páginas 28 a 34 do PDF atual da proposta (feito em Word).
O certificado GeoSelos original continua como última página e não deve ser refeito.

## Contexto
- Cliente: Palladium Hotel Group (grupo espanhol), resort em operação durante a obra.
- Contato do cliente: Sr. Saulo Cotrim, diretor e gestor da obra.
- Objetivo comercial: reconquistar o cliente; o anexo precisa parecer portfólio técnico,
  não post de Instagram.

## Regras técnicas
- NÃO mexer no código de produção do site. Trabalhar numa pasta separada
  (ex.: `tools/proposta-anexo/`) ou num branch próprio. Não fazer deploy nem commit na main.
- Saída: um PDF A4 com uma página por obra + página de abertura (5 páginas).
  Sugestão: HTML/CSS com `@page { size: A4; margin: 0 }` e exportar com Playwright
  (`page.pdf({ format: 'A4', printBackground: true })`).
- Margens internas ≥ 12 mm; texto mínimo 9 pt; tudo legível em escala de cinza.
- Fotos via `<img>` (não background-image).
- Abrir o PDF gerado e conferir página por página antes de entregar.

## Cabeçalho e rodapé (todas as páginas)
- Cabeçalho: logo Geoforte à esquerda; à direita "PROPOSTA GEO 2701A/25 · EXPANSÃO GRAND PALLADIUM IMBASSAÍ".
- Rodapé:
  - Geofor Obras de Fundações Ltda · CNPJ 26.214.785/0001-99
  - Av. Luís Viana Filho, 13145 · Hangar Business Park, Hangar 6, Sl. 419 · São Cristóvão · Salvador – BA
  - (71) 99708-2005 · (71) 3341-2918 · projetos@geoforte.com.br
  - Logos ABEF e GeoSelos (pasta `logos/`) + número da página (B.1 a B.5).

## Páginas

### B.1 — Abertura
- Sobretítulo: ANEXO B
- Título: Obras executadas
- Subtítulo: Cortinas de estacas justapostas em Salvador
- Texto: "Seleção de contenções executadas pela Geoforte com a mesma solução prevista para a
  expansão do Grand Palladium Imbassaí: cortinas de estacas justapostas, com vigas de
  coroamento, em terrenos litorâneos e junto a edificações existentes."
- Grade 2×2 com uma foto de cada obra, número (01–04), nome, construtora e página.

### B.2 a B.5 — Uma página por obra (mesmo modelo)
1. Número da obra + nome + linha "Construtora · bairro, Salvador – BA · ano"
2. Foto principal larga, com legenda curta sobre a foto
3. Abaixo, em duas colunas: foto de detalhe (com legenda) | Ficha técnica
4. "Destaque da obra": uma frase sobre o desafio e a solução

Ficha técnica (mesmos campos em todas):
| Campo | Valor |
|---|---|
| Solução | Cortina de estacas justapostas |
| Complemento | Vigas de coroamento (confirmar nas obras 03 e 04) |
| Área de contenção | [— m²] |
| Altura de escavação | [— m] |
| Estacas | [nº] × Ø [—] cm |
| Execução | [mês/ano] – [mês/ano] |

Campos entre colchetes: ainda sem dados (a Eng. Denise vai preencher). Mostrar como
placeholder visível (cor de destaque) para facilitar a revisão.

| Pág. | Obra | Construtora | Foto principal | Foto de detalhe |
|---|---|---|---|---|
| B.2 | Mana Kai | São Conrado Empreendimentos | `fotos/manakai-vigas-1.jpg` "Cortina de estacas justapostas concluída" | `fotos/manakai-vigas-2.jpg` "Vigas de coroamento" |
| B.3 | Nouvelle Blues | André Guimarães | `fotos/nouvelle-1.jpg` "Execução da cortina junto a edificações vizinhas" | `fotos/nouvelle-vigas-2.jpg` "Estacas e viga de coroamento" |
| B.4 | Riserva Vita | SCR Construtora | `fotos/riserva-1.jpg` "Execução das estacas com perfuratriz" | `fotos/riserva-2.jpg` "Movimentação de armaduras" |
| B.5 | Imbuí Class | BTS Empreendimentos | `fotos/imbui-2.jpg` "Cortina concluída em planta curva" | `fotos/imbui-1.jpg` "Perfuratriz em operação na encosta" |

Ordem proposital: Mana Kai e Nouvelle Blues primeiro (orla e vizinhança construída, mais
parecidas com a obra do resort).

## Atenção
- NÃO usar `fotos/manakai-1.jpg` e `fotos/manakai-2.jpg`: parecem processadas por IA
  (texto das máquinas embaralhado). Estão no pacote só para referência.
- As fotos foram recortadas dos folders do PDF (~970 px de largura). Se a Geoforte tiver os
  originais em alta, trocar.
- Não inventar números (área, prazo, quantidade de estacas). Sem dado → placeholder.

## Referência visual
`referencia/` tem os renders de uma primeira versão do layout (cores genéricas azul/laranja
tiradas do PDF). Seguir a ESTRUTURA, mas aplicar a identidade visual do site.
