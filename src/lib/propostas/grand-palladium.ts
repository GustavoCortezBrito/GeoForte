/**
 * Proposta web GEO 2701A/25 (Expansão Grand Palladium Imbassaí).
 *
 * Todo o conteúdo vem de tools/proposta/dados — a mesma fonte do PDF. Aqui o
 * texto só é reorganizado para a página; nada é digitado de novo. Os números
 * de cláusula mostrados na página são os do PDF, para o cliente cruzar os dois.
 * Se uma cláusula mudar de lugar ou de redação a ponto de não ser achada, o
 * build falha (melhor do que publicar um número errado).
 */
import type { StaticImageData } from "next/image";
import { proposta, empresa } from "@proposta/dados/empresa.mjs";
import { secoes, assinatura as assinaturaPdf } from "@proposta/dados/proposta.mjs";
import { memorial } from "@proposta/dados/memorial.mjs";
import { obras as obrasPdf } from "@proposta/dados/obras.mjs";
import manakai01 from "@proposta/assets/fotos/manakai-01.jpg";
import manakai02 from "@proposta/assets/fotos/manakai-02.jpg";
import manakai03 from "@proposta/assets/fotos/manakai-03.jpg";
import manakai04 from "@proposta/assets/fotos/manakai-04.jpg";
import manakai05 from "@proposta/assets/fotos/manakai-05.jpg";
import manakai06 from "@proposta/assets/fotos/manakai-06.jpg";
import manakai07 from "@proposta/assets/fotos/manakai-07.jpg";
import manakai08 from "@proposta/assets/fotos/manakai-08.jpg";
import manakai09 from "@proposta/assets/fotos/manakai-09.jpg";
import manakai10 from "@proposta/assets/fotos/manakai-10.jpg";
import manakai11 from "@proposta/assets/fotos/manakai-11.jpg";
import manakai12 from "@proposta/assets/fotos/manakai-12.jpg";
import nouvelle01 from "@proposta/assets/fotos/nouvelle-01.jpg";
import nouvelle02 from "@proposta/assets/fotos/nouvelle-02.jpg";
import nouvelle03 from "@proposta/assets/fotos/nouvelle-03.jpg";
import riserva01 from "@proposta/assets/fotos/riserva-01.jpg";
import riserva02 from "@proposta/assets/fotos/riserva-02.jpg";
import riserva03 from "@proposta/assets/fotos/riserva-03.jpg";
import imbui01 from "@proposta/assets/fotos/imbui-01.jpg";
import imbui02 from "@proposta/assets/fotos/imbui-02.jpg";

/** PDF completo (gerado por tools/proposta, copiado para public/ a cada `npm run gerar`). */
export const PDF_URL = "/propostas/grand-palladium/Proposta-GEO-2701A-25-Grand-Palladium.pdf";

// ─── Tipos do texto da proposta (dados/proposta.mjs é JS puro) ──────────────

export interface Clausula {
  n: string;
  t: string;
  sub?: { n: string; t: string }[];
  insumos?: [string, string][];
  complemento?: string;
  lista?: string[];
}
type Bloco =
  | Clausula
  | { tipo: "contencoes"; titulo: string; linhas: { n: string; nome: string; solucao: string; area: string }[] }
  | { tipo: "total"; n: string; rotulo: string; valor: string; t: string }
  | { tipo: "tabela-precos"; legenda: string; linhas: [string, string][] | null }
  | { tipo: "faturamento"; n: string; rotulo: string; partes: { pct: string; t: string }[] }
  | { tipo: "obs"; itens: string[] }
  | { tipo: "paragrafo"; t: string };
interface Secao {
  n: string;
  titulo: string;
  intro?: string;
  itens: Bloco[];
}

const SECOES = secoes as unknown as Secao[];

function secao(n: string): Secao {
  const s = SECOES.find((x) => x.n === n);
  if (!s) throw new Error(`Proposta web: seção ${n} não encontrada em dados/proposta.mjs`);
  return s;
}
const ehClausula = (b: Bloco): b is Clausula => !("tipo" in b);
function clausula(n: string): Clausula {
  const c = SECOES.flatMap((s) => s.itens).find((b): b is Clausula => ehClausula(b) && b.n === n);
  if (!c) throw new Error(`Proposta web: cláusula ${n} não encontrada em dados/proposta.mjs`);
  return c;
}
type TipoBloco = "contencoes" | "total" | "tabela-precos" | "faturamento" | "obs" | "paragrafo";
function bloco<T extends TipoBloco>(n: string, tipo: T) {
  const b = secao(n).itens.find((x) => "tipo" in x && x.tipo === tipo);
  if (!b) throw new Error(`Proposta web: bloco "${tipo}" não encontrado na seção ${n}`);
  return b as Extract<Bloco, { tipo: T }>;
}
function extrair(re: RegExp, texto: string, onde: string): string {
  const m = texto.match(re);
  if (!m) throw new Error(`Proposta web: não achei ${re} na cláusula ${onde}`);
  return m[1];
}
/** "**Título:** texto" → { titulo, texto } (cláusulas com título em negrito). */
function comTitulo(c: Clausula) {
  const m = c.t.match(/^\*\*(.+?):?\*\*:?\s*([\s\S]*)$/);
  return m ? { n: c.n, titulo: m[1].replace(/:$/, ""), texto: m[2] } : { n: c.n, titulo: "", texto: c.t };
}
/** "1.638,0" → 1638 */
const numeroBR = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

// ─── Cabeçalho ──────────────────────────────────────────────────────────────

export const cabecalho = {
  codigo: proposta.codigo,
  obra: proposta.obra,
  localObra: proposta.localObra,
  cliente: proposta.cliente,
  atencao: proposta.atencao,
  emissao: proposta.emissao,
  validade: proposta.validade,
};

export { empresa };

// ─── 1. Escopo ──────────────────────────────────────────────────────────────

const tabelaContencoes = bloco("1", "contencoes");
const total = bloco("1", "total");

const c13 = clausula("1.3");

export const escopo = {
  objeto: c13.t,
  subsolos: Number(extrair(/(\d+) \([^)]+\) subsolos/, c13.t, c13.n)),
  docas: Number(extrair(/(\d+) \([^)]+\) doca/, c13.t, c13.n)),
  documentos: clausula("1.1").sub ?? [],
  premissa: clausula("1.2").t,
  contencoes: tabelaContencoes.linhas.map((l) => ({ ...l, m2: numeroBR(l.area) })),
  total: { n: total.n, valor: total.valor, texto: total.t },
};

// ─── 2 e 3. Responsabilidades ───────────────────────────────────────────────

const lista = (n: string) => secao(n).itens.filter(ehClausula).map((c) => ({ n: c.n, t: c.t }));

export const responsabilidades = {
  geoforte: { titulo: secao("2").titulo, itens: lista("2") },
  cliente: { titulo: secao("3").titulo, itens: lista("3") },
};

// ─── Execução (2.15–2.22 e 8.3) ─────────────────────────────────────────────

const c222 = clausula("2.22");
const c83 = clausula("8.3");

export const execucao = {
  equipamentos: { n: c222.n, texto: c222.t },
  prazo: {
    n: c83.n,
    dias: Number(extrair(/(\d+) dias úteis/, c83.t, c83.n)),
    equipamentos: Number(extrair(/dias úteis para (\d+) equipamentos/, c83.t, c83.n)),
    texto: c83.t,
  },
  instalacao: { n: "8.2", texto: clausula("8.2").t },
  mobilizacao: { n: "8.1", texto: clausula("8.1").t },
  /**
   * A execução em quatro passos, cada um com o texto das cláusulas do escopo da
   * Geoforte que o descrevem (o título é só o nome do passo). `midia` aponta o
   * vídeo ilustrativo em public/propostas/grand-palladium/.
   */
  passos: [
    { titulo: "Perfuração", refs: ["2.2", "2.22"], midia: "trado" },
    { titulo: "Concretagem", refs: ["2.17", "2.18", "2.19"], midia: "concreto" },
    { titulo: "Armação", refs: ["2.15", "2.16"], midia: "armadura" },
    { titulo: "Controle tecnológico", refs: ["2.20", "2.3"], midia: "controle" },
  ].map((p) => ({ ...p, clausulas: p.refs.map((n) => ({ n, t: clausula(n).t })) })),
  projeto: { n: "2.21", t: clausula("2.21").t },
};

// ─── 4. Regras de engenharia e riscos ───────────────────────────────────────

export const regras = {
  titulo: secao("4").titulo,
  intro: secao("4").intro ?? "",
  itens: secao("4").itens.filter(ehClausula).map(comTitulo),
};

// ─── 5 e 6. Preços e pagamento ──────────────────────────────────────────────

const c51 = clausula("5.1");
const tabela01 = bloco("5", "tabela-precos");
const fat = bloco("6", "faturamento");

export const precos = {
  intro: secao("5").intro ?? "",
  /** Tabela 01 não existe no PDF original: `linhas` null = preço global ainda a inserir. */
  tabela01: { legenda: tabela01.legenda, linhas: tabela01.linhas },
  unitarios: { ...comTitulo(c51), insumos: c51.insumos ?? [] },
  reajuste: comTitulo(clausula("5.2")),
  sinal: { n: "6.1", texto: clausula("6.1").t, valor: extrair(/(R\$ [\d.,]+)/, clausula("6.1").t, "6.1") },
  medicoes: { n: "6.2", texto: clausula("6.2").t },
  faturamento: { n: fat.n, partes: fat.partes.map((p) => ({ ...p, pct: p.pct, valor: Number(p.pct.replace("%", "")) })) },
  observacoes: bloco("6", "obs").itens,
};

// ─── 7 a 10. Condições ──────────────────────────────────────────────────────

const c85 = clausula("8.5");
const c86 = clausula("8.6");
/** O termo em negrito de uma cláusula sem título ("…o estado de **Standby Operacional**."). */
const termo = (c: Clausula) => extrair(/\*\*([^*]+)\*\*/, c.t, c.n);

export const condicoes = {
  // 8.5 e 8.6 não têm título no PDF; juntas, tratam do standby (o termo em negrito da 8.5).
  prazo: [
    { ...comTitulo(clausula("8.4")) },
    {
      n: "8.5 · 8.6",
      titulo: termo(c85).charAt(0) + termo(c85).slice(1).toLowerCase(),
      texto: c85.t,
      complemento: c85.complemento,
      lista: c85.lista,
      continuacao: c86.t,
    },
    { ...comTitulo(clausula("8.7")) },
  ],
  standby: {
    n: c86.n,
    hora: extrair(/(R\$ [\d.,]+) por hora/, c86.t, c86.n),
    teto: extrair(/teto de (R\$ [\d.,]+)/, c86.t, c86.n),
  },
  diversos: secao("7").itens.filter(ehClausula).map((c) => ({ n: c.n, t: c.t })),
  aceite: secao("9").itens.map((b) => ("t" in b ? b.t : "")).join(" "),
  validade: secao("10").itens.map((b) => ("t" in b ? b.t : "")),
};

export const assinatura = { nome: assinaturaPdf.nome, registro: assinaturaPdf.registro, empresa: assinaturaPdf.empresa };

// ─── 11. Memorial de cálculo ────────────────────────────────────────────────

const metros = (s: string) => parseFloat(s);
const valor = (linha: string) => linha.split(":").pop()!.trim();
/** Nome curto de cada critério de estabilidade do software, para o gráfico. */
function nomeCurto(titulo: string) {
  if (titulo.startsWith("Relação entre o momento")) return "Momento passivo ÷ ativo";
  if (titulo.startsWith("Relação entre o empuxo passivo")) return "Empuxo passivo ÷ mobilizado";
  if (titulo.startsWith("Círculo de deslizamento")) return "Círculo de deslizamento";
  throw new Error(`Proposta web: critério de estabilidade sem nome curto: ${titulo}`);
}

/** Uma contenção do memorial, em números prontos para desenhar. */
export interface ContencaoMemorial {
  n: string;
  titulo: string;
  /** Altura total da estaca, diâmetro e espaçamento entre eixos, em metros. */
  estaca: { comprimento: number; diametro: number; eixos: number };
  nivelAgua: number;
  /** Cota do topo de cada camada (m, negativa para baixo). */
  camadas: { nome: string; topo: number }[];
  escora: { cota: number; desdeFase: string } | null;
  /** Sobrecarga uniforme no terreno contido (texto do memorial), se houver. */
  sobrecarga: string | null;
  fases: {
    ref: string;
    nome: string;
    curto: string;
    cotaEscavacao: number;
    alturaBerma: number | null;
    /** Ângulo do talude da berma, em graus (texto do software). */
    talude: number | null;
    /** Deslocamento horizontal da cortina (mm) ao longo da profundidade. */
    deslocamentos: { cota: number; mm: number }[];
    /** Momento fletor (kN·m/m) ao longo da profundidade. */
    momentos: { cota: number; v: number }[];
  }[];
  /** `texto` e `minimoTexto` guardam o valor como o memorial escreve (sem inventar casas decimais). */
  estabilidade: { criterio: string; curto: string; minimo: number; minimoTexto: string; fases: { fase: string; fs: number; texto: string }[] }[];
  cortante: { calculado: string; maximo: string };
  armadura: { vertical: string; horizontal: string };
}

export const memorialWeb: { n: string; titulo: string; contencoes: ContencaoMemorial[] } = {
  n: memorial.n,
  titulo: memorial.titulo,
  contencoes: memorial.contencoes.map((c) => {
    const geo = Object.fromEntries(c.geometria);
    const na = c.terreno.find(([k]) => k.startsWith("Profundidade do nível freático"));
    const estab = [...c.estabilidade.coeficientes.criterios, ...c.estabilidade.circulo.criterios];
    const cortante = c.verificacoes.find((v) => v.v.startsWith("Verificação ao cortante"));
    return {
      n: c.n,
      titulo: c.titulo,
      estaca: {
        comprimento: metros(geo["Altura total"]),
        diametro: metros(geo["Diâmetro"]) / 100,
        eixos: metros(geo["Distância entre eixos"]),
      },
      nivelAgua: -metros(na ? na[1] : "0"),
      camadas: c.estratos.map((e) => ({ nome: e.ref.replace(/^\d+ - /, ""), topo: metros(e.cota) })),
      escora: c.escoras?.[0]
        ? { cota: metros(valor(c.escoras[0].descricao[0])), desdeFase: c.escoras[0].inicial }
        : null,
      sobrecarga: c.cargas ? valor(c.cargas.linhas[0][2]) : null,
      fases: c.fases.map((f, i) => {
        const linhas = c.resultados[i].linhas as string[][];
        return {
          ref: f.ref,
          nome: f.nome,
          curto: f.nome.replace(/^Fase \d - /, ""),
          cotaEscavacao: f.cotaEscavacao,
          alturaBerma: f.alturaBerma,
          talude: (() => {
            const t = f.descricao.find((d) => d.startsWith("Ângulo do talude"));
            return t ? parseFloat(valor(t)) : null;
          })(),
          deslocamentos: linhas.map((l) => ({ cota: Number(l[0]), mm: Number(l[1]) })),
          momentos: linhas.map((l) => ({ cota: Number(l[0]), v: Number(l[4]) })),
        };
      }),
      estabilidade: estab.map((k) => ({
        criterio: k.titulo.replace(/:$/, ""),
        curto: nomeCurto(k.titulo),
        minimo: Number(k.minimo.replace(/[^\d.]/g, "")),
        minimoTexto: k.minimo.replace(/[^\d.]/g, "").replace(".", ","),
        fases: k.fases.map(([nome, fs]) => ({
          fase: nome.replace(/:.*$/, "").replace(/^Fase \d - /, ""),
          fs: Number(fs),
          texto: fs.replace(".", ","),
        })),
      })),
      cortante: {
        calculado: cortante?.valores[1]?.replace("Calculado: ", "") ?? "",
        maximo: cortante?.valores[0]?.replace("Máximo: ", "") ?? "",
      },
      armadura: c.armadura,
    };
  }),
};

// ─── Anexo B. Obras executadas ──────────────────────────────────────────────

// As fotos são importadas uma a uma (o Next gera tamanhos e o blur de cada uma).
const FOTOS: Record<string, StaticImageData> = {
  "manakai-01.jpg": manakai01,
  "manakai-02.jpg": manakai02,
  "manakai-03.jpg": manakai03,
  "manakai-04.jpg": manakai04,
  "manakai-05.jpg": manakai05,
  "manakai-06.jpg": manakai06,
  "manakai-07.jpg": manakai07,
  "manakai-08.jpg": manakai08,
  "manakai-09.jpg": manakai09,
  "manakai-10.jpg": manakai10,
  "manakai-11.jpg": manakai11,
  "manakai-12.jpg": manakai12,
  "nouvelle-01.jpg": nouvelle01,
  "nouvelle-02.jpg": nouvelle02,
  "nouvelle-03.jpg": nouvelle03,
  "riserva-01.jpg": riserva01,
  "riserva-02.jpg": riserva02,
  "riserva-03.jpg": riserva03,
  "imbui-01.jpg": imbui01,
  "imbui-02.jpg": imbui02,
};
const foto = (arquivo: string) => {
  const f = FOTOS[arquivo];
  if (!f) throw new Error(`Proposta web: foto ${arquivo} sem import em grand-palladium.ts`);
  return f;
};

/**
 * Na web só aparece o que já foi preenchido em dados/obras.mjs: um campo null
 * some da página (no PDF ele vira placeholder para a revisão).
 */
export const obras = obrasPdf.map((o) => ({
  numero: o.numero,
  nome: o.nome,
  construtora: o.construtora,
  local: [o.bairro, "Salvador – BA"].filter(Boolean).join(", "),
  ano: o.ano,
  /** Todas as fotos da obra, na ordem de dados/obras.mjs (a 1ª é a principal). */
  fotos: o.fotos.map((ft) => ({ src: foto(ft.arquivo), legenda: ft.legenda, foco: "foco" in ft ? (ft.foco as string) : undefined })),
  solucao: o.ficha.solucao,
  complemento: o.ficha.complemento.confirmar ? null : o.ficha.complemento.valor,
  ficha: [
    ["Área de contenção", o.ficha.areaContencao],
    ["Altura de escavação", o.ficha.alturaEscavacao],
    ["Estacas", o.ficha.estacas],
    ["Execução", o.ficha.execucao],
  ].filter((x): x is [string, string] => Boolean(x[1])),
  destaque: o.destaque,
}));
