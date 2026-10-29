/**
 * Moldura das páginas no Word (src/moldura.mjs no PDF): cabeçalho com o logo, a referência da
 * proposta e o fio laranja/cinza; rodapé com os dados da empresa, os selos e o número da página.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AlignmentType, Footer, Header, PageNumber, Paragraph, TextRun } from "docx";
import { raiz } from "../util.mjs";
import { COR, MONO, TEXTO, UTIL, cel, espaco, imagem, par, pt, tabela, txt, borda } from "./base.mjs";

/** Faixa fina em duas cores (o fio do cabeçalho, o fio da capa): duas células pintadas. */
export const faixa = (altura, partes) =>
  tabela({
    larguras: partes.map((p) => p.mm),
    linhas: [
      {
        altura,
        exata: true,
        celulas: partes.map((p) => cel([new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: "exact" } })], { fundo: p.cor })),
      },
    ],
  });

/** Cabeçalho: logo à esquerda, duas linhas da proposta à direita, fio a 24 mm do topo. */
export function cabecalho(proposta, logoPng) {
  const linhaCab = (t) =>
    par(txt(t, { fonte: "mono", negrito: true, tam: 9, espaco: 0.09 }), { tam: 9, fator: 1.38, alinhar: AlignmentType.RIGHT });
  return new Header({
    children: [
      tabela({
        larguras: [90, UTIL - 90],
        linhas: [
          {
            altura: 9.6,
            celulas: [
              cel([new Paragraph({ children: [imagem(logoPng, { larg: 9.6 * (logoAspecto(logoPng)), alt: 9.6, nome: "Geoforte Fundações" })] })], { vAlign: "meio" }),
              cel(proposta.cabecalho.map(linhaCab), { vAlign: "meio" }),
            ],
          },
        ],
      }),
      espaco(3.9),
      faixa(0.55, [
        { mm: 18, cor: COR.o },
        { mm: UTIL - 18, cor: COR.fio },
      ]),
      espaco(0.3),
    ],
  });
}

const logoAspecto = (png) => png.readUInt32BE(16) / png.readUInt32BE(20);

/**
 * Rodapé: fio cinza, dados da empresa à esquerda; ABEF, GeoSelos e o rótulo da página à direita.
 * rotulo: "pagina" (Pág. n), { prefixo: "A." } (A.n) ou null (sem número).
 */
export function rodape(empresa, rotulo) {
  const linhaRod = (filhos) => par(filhos, { tam: 9, fator: 1.34 });
  const textoRod = [
    linhaRod(txt(`**${empresa.razaoSocial} · CNPJ ${empresa.cnpj}**`, { tam: 9, cor: COR.g2 })),
    linhaRod(txt(empresa.endereco, { tam: 9, cor: COR.g2 })),
    linhaRod(txt(empresa.cidade, { tam: 9, cor: COR.g2 })),
    linhaRod(txt(`${empresa.telefones.join(" · ")} · ${empresa.email}`, { tam: 9, cor: COR.g2 })),
  ];
  const numero = rotulo
    ? [
        new TextRun({ text: rotulo === "pagina" ? "Pág. " : rotulo.prefixo, font: MONO, bold: true, size: pt(10), color: COR.g }),
        new TextRun({ children: [PageNumber.CURRENT], font: MONO, bold: true, size: pt(10), color: COR.g }),
      ]
    : [];
  const selos = new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [
      imagem("logos/logo-abef.png", { larg: 8.4 * aspectoArquivo("abef"), alt: 8.4, nome: "ABEF" }),
      new TextRun({ text: "   ", font: TEXTO, size: pt(9) }),
      imagem("logos/geoselos-medalha.png", { larg: 11.5 * aspectoArquivo("selo"), alt: 11.5, nome: "GeoSelos" }),
    ],
  });
  const fio = borda(COR.fio, 0.3);
  return new Footer({
    children: [
      tabela({
        larguras: rotulo ? [UTIL - 54, 36, 18] : [UTIL - 36, 36],
        linhas: [
          {
            celulas: [
              cel(textoRod, { bordas: { topo: fio }, margem: { t: 3.2 }, vAlign: "meio" }),
              cel([selos], { bordas: { topo: fio }, margem: { t: 3.2 }, vAlign: "meio" }),
              ...(rotulo
                ? [
                    cel([par(numero, { tam: 10, alinhar: AlignmentType.RIGHT, borda: { esq: { cor: COR.fio, mm: 0.3, espaco: 3.6 } } })], {
                      bordas: { topo: fio },
                      margem: { t: 3.2 },
                      vAlign: "meio",
                    }),
                  ]
                : []),
            ],
          },
        ],
      }),
      espaco(0.3),
    ],
  });
}

// proporção (largura/altura) dos selos do rodapé, lida dos PNG em assets/logos
const aspectos = {};
function aspectoArquivo(qual) {
  if (!aspectos[qual]) {
    const b = readFileSync(join(raiz, "assets", "logos", qual === "abef" ? "logo-abef.png" : "geoselos-medalha.png"));
    aspectos[qual] = b.readUInt32BE(16) / b.readUInt32BE(20);
  }
  return aspectos[qual];
}

