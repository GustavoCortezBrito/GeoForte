import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Download, MessageCircle } from "lucide-react";
import BarraProposta from "@/components/propostas/BarraProposta";
import VideoFundo from "@/components/propostas/VideoFundo";
import IndiceCapitulos, { type ItemIndice } from "@/components/propostas/IndiceCapitulos";
import BarrasContencoes from "@/components/propostas/BarrasContencoes";
import CorteCortina from "@/components/propostas/CorteCortina";
import ExecucaoPassos from "@/components/propostas/ExecucaoPassos";
import GaleriaObras from "@/components/propostas/GaleriaObras";
import { CronogramaPrazos, DivisaoFaturamento } from "@/components/propostas/Graficos";
import Rico from "@/components/propostas/Rico";
import {
  PDF_URL,
  assinatura,
  cabecalho,
  condicoes,
  empresa,
  escopo,
  execucao,
  memorialWeb,
  obras,
  precos,
  regras,
  responsabilidades,
} from "@/lib/propostas/grand-palladium";
import logoAbef from "@proposta/assets/logos/logo-abef.png";
import seloGeoselos from "@proposta/assets/logos/geoselos-medalha.png";

const MIDIA = "/propostas/grand-palladium";

export const metadata: Metadata = {
  title: `Proposta ${cabecalho.codigo} · ${cabecalho.cliente}`,
  description: `Proposta técnica e comercial da Geoforte para as contenções em estacas justapostas da ${cabecalho.obra}.`,
  // Link privado: fora do Google (o cabeçalho X-Robots-Tag em next.config cobre também o PDF e os vídeos).
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    title: `Proposta ${cabecalho.codigo} · ${cabecalho.cliente}`,
    description: "Contenções em estacas justapostas: projeto executivo geotécnico e execução global.",
    images: [{ url: `${MIDIA}/hero.jpg`, width: 1920, height: 1080 }],
    locale: "pt_BR",
    type: "website",
  },
};

const telefone = empresa.telefones[0];
const whatsapp = `https://wa.me/55${telefone.replace(/\D/g, "")}?text=${encodeURIComponent(
  `Olá! Tenho uma pergunta sobre a proposta ${cabecalho.codigo} (${cabecalho.cliente}).`,
)}`;
const aceite = `mailto:${empresa.email}?subject=${encodeURIComponent(
  `Aceite da proposta ${cabecalho.codigo} · ${cabecalho.cliente}`,
)}&body=${encodeURIComponent(
  `Olá, equipe Geoforte.\n\nQueremos seguir com a proposta ${cabecalho.codigo} (contenções em estacas justapostas, ${cabecalho.obra}). Por favor, enviem os próximos passos para o aceite formal.\n\nNome:\nEmpresa:\nTelefone:\n`,
)}`;

const capitulos: ItemIndice[] = [
  { id: "escopo", n: "1", titulo: "Escopo" },
  { id: "responsabilidades", n: "2·3", titulo: "Quem faz o quê" },
  { id: "riscos", n: "4", titulo: "Engenharia e riscos" },
  { id: "preco", n: "5·6", titulo: "Preço e pagamento" },
  { id: "condicoes", n: "7", titulo: "Condições gerais" },
  { id: "prazos", n: "8", titulo: "Prazos" },
  { id: "aceite", n: "9·10", titulo: "Aceite e validade" },
  { id: "memorial", n: "11", titulo: "Memorial de cálculo" },
  { id: "obras", n: "B", titulo: "Obras executadas" },
];

const semPrefixo = (t: string) => t.replace(/^[^:]+:\s*/, "").replace(/\.$/, "");
const contDoca = memorialWeb.contencoes[0];

function Capitulo({
  id,
  n,
  titulo,
  lead,
  children,
}: {
  id: string;
  n: string;
  titulo: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="scroll-mt-24 pt-20 pb-6 lg:pt-28">
      <div className="rule-driven max-w-64" aria-hidden />
      <div className="mt-7 flex items-baseline gap-5">
        <span className="shrink-0 font-display text-[clamp(2.1rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-brand-ink tabular-nums">
          {n}
        </span>
        <h2
          id={`${id}-t`}
          className="font-display text-[clamp(1.8rem,3.3vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.03em] text-ink text-balance"
        >
          {titulo}
        </h2>
      </div>
      {lead && <div className="mt-6 max-w-[64ch] text-[17px] leading-relaxed text-ink-2">{lead}</div>}
      <div className="mt-12">{children}</div>
    </section>
  );
}

/** Lista de cláusulas: número miúdo à esquerda, texto da proposta à direita. */
function ListaClausulas({ itens, colunas = false }: { itens: { n: string; t: string }[]; colunas?: boolean }) {
  return (
    <ol className={colunas ? "md:columns-2 md:gap-12" : ""}>
      {itens.map((c) => (
        <li key={c.n} className="grid break-inside-avoid grid-cols-[3rem_minmax(0,1fr)] gap-x-2 border-t border-rule py-3 text-[15px] leading-relaxed text-ink">
          <span className="pt-px font-display text-[13px] font-semibold tabular-nums text-ink-3">{c.n}</span>
          <span>
            <Rico t={c.t} />
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Cláusulas longas com título em negrito: título à esquerda, texto à direita. */
function RegrasTitulo({
  itens,
}: {
  itens: { n: string; titulo: string; texto: string; lista?: string[]; complemento?: string; continuacao?: string }[];
}) {
  return (
    <dl className="border-b border-rule">
      {itens.map((r) => (
        <div key={r.n} className="grid gap-x-10 gap-y-3 border-t border-rule py-7 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <dt className="font-display text-[17px] font-bold leading-snug text-ink">
            <span className="mr-2.5 text-[14px] font-semibold tabular-nums text-ink-3">{r.n}</span>
            {r.titulo || "—"}
          </dt>
          <dd className="max-w-[66ch] text-[15.5px] leading-relaxed text-ink-2">
            <Rico t={r.texto} />
            {r.complemento && <p className="mt-3">{r.complemento}</p>}
            {r.lista && (
              <ul className="mt-3 space-y-1.5">
                {r.lista.map((l) => (
                  <li key={l} className="grid grid-cols-[1rem_minmax(0,1fr)]">
                    <span className="mt-[0.6em] h-[6px] w-[6px] bg-ink-3" aria-hidden />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            )}
            {r.continuacao && (
              <p className="mt-3">
                <Rico t={r.continuacao} />
              </p>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function PropostaGrandPalladium() {
  const precoGlobalPendente = !precos.tabela01.linhas;

  return (
    <>
      <BarraProposta codigo={cabecalho.codigo} validade={cabecalho.validade} pdf={PDF_URL} aceite={aceite} />

      <main id="conteudo">
        {/* ─── Capa: a obra à esquerda, a proposta em um minuto à direita ─── */}
        <section id="capa" className="grid pt-16 lg:min-h-[100svh] lg:grid-cols-12">
          <div className="on-graphite relative flex min-h-[64svh] flex-col justify-end overflow-hidden bg-graphite lg:col-span-7 lg:min-h-0">
            <VideoFundo src={`${MIDIA}/hero.mp4`} poster={`${MIDIA}/hero.jpg`} prioridade sizes="(min-width: 1024px) 58vw, 100vw" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/55 to-graphite/5" />
            <p className="absolute right-4 top-4 bg-graphite/70 px-2 py-1 text-[12px] font-display font-medium text-paper/80">Imagem ilustrativa</p>
            <div className="relative px-5 pb-10 pt-32 sm:px-8 lg:px-12 lg:pb-14">
              <h1
                aria-label="Contenções em estacas justapostas"
                className="font-display text-[clamp(2.6rem,5.4vw,5rem)] font-bold leading-[0.98] tracking-[-0.035em] text-ink"
              >
                {["Contenções", "em estacas", "justapostas"].map((linha, i) => (
                  <span key={linha} className="proposta-linha" aria-hidden>
                    <span style={{ animationDelay: `${0.15 + i * 0.09}s` }}>{linha}</span>
                  </span>
                ))}
              </h1>
              <span aria-hidden className="proposta-fio mt-6 block h-[3px] w-24 bg-brand" />
              <p className="proposta-surge mt-5 max-w-[34ch] font-display text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-snug text-ink">
                Projeto executivo geotécnico e execução global para a {cabecalho.obra}
              </p>
              <p className="proposta-surge mt-3 text-[15px] text-ink-2">{cabecalho.localObra}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:col-span-5 lg:px-12 lg:py-10 xl:px-16">
            <p className="text-[14px] leading-relaxed text-ink-2">
              Para <strong className="font-semibold text-ink">{cabecalho.cliente}</strong> · At. {cabecalho.atencao}
              <br />
              Emitida em {cabecalho.emissao} · <span className="whitespace-nowrap">válida por {cabecalho.validade}</span>
            </p>
            <h2 className="mt-8 font-display text-[clamp(1.5rem,2.2vw,1.9rem)] font-bold tracking-[-0.02em] text-ink">
              A proposta em um minuto
            </h2>
            <dl className="mt-5 border-b border-rule">
              {[
                {
                  dt: "O quê",
                  dd: (
                    <>
                      {escopo.contencoes.length} contenções em estacas justapostas ({escopo.subsolos} subsolos e{" "}
                      {escopo.docas} doca), {escopo.total.valor} no total, do projeto executivo à execução.
                    </>
                  ),
                  href: "#escopo",
                  ref: "cláusula 1",
                },
                {
                  dt: "Quanto",
                  dd: precoGlobalPendente ? (
                    <>
                      <span className="bg-brand-wash px-1.5 font-semibold text-brand-ink">[preço global: inserir a Tabela 01]</span>{" "}
                      Sinal de <span className="whitespace-nowrap">{precos.sinal.valor}</span> na assinatura e medições quinzenais.
                    </>
                  ) : (
                    <>
                      Sinal de <span className="whitespace-nowrap">{precos.sinal.valor}</span> na assinatura e medições quinzenais.
                    </>
                  ),
                  href: "#preco",
                  ref: "cláusulas 5 e 6",
                },
                {
                  dt: "Quando",
                  dd: (
                    <>
                      {execucao.prazo.dias} dias úteis de execução com {execucao.prazo.equipamentos} perfuratrizes, instalação em 1 dia e
                      mobilização {semPrefixo(execucao.mobilizacao.texto)}.
                    </>
                  ),
                  href: "#prazos",
                  ref: "cláusula 8",
                },
                {
                  dt: "Riscos",
                  dd: <>Desvios de execução, redes enterradas, perda de concreto e lama do canteiro: quatro regras dizem quem responde por cada um.</>,
                  href: "#riscos",
                  ref: "cláusula 4",
                },
              ].map((r) => (
                <div key={r.dt} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 border-t border-rule py-4">
                  <dt className="pt-0.5 font-display text-[15px] font-bold text-ink">{r.dt}</dt>
                  <dd className="text-[15.5px] leading-relaxed text-ink-2">
                    {r.dd}{" "}
                    <a href={r.href} className="whitespace-nowrap font-display text-[13px] font-semibold text-brand-ink hover:underline">
                      {r.ref}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={aceite}
                className="inline-flex items-center px-6 py-4 font-display text-[15px] font-bold bg-brand text-graphite hover:bg-brand-deep transition-colors"
              >
                Aceitar proposta
              </a>
              <a
                href={PDF_URL}
                download
                rel="nofollow"
                className="inline-flex items-center gap-2 border border-rule-strong px-5 py-4 font-display text-[15px] font-semibold text-ink hover:border-ink transition-colors"
              >
                <Download size={17} aria-hidden />
                Baixar PDF completo
              </a>
            </div>
            <a href="#capitulos" className="mt-8 inline-flex items-center gap-2 font-display text-[14px] font-semibold text-ink-2 hover:text-ink">
              <ArrowDown size={16} aria-hidden />
              Ler a proposta inteira
            </a>
          </div>
        </section>

        {/* ─── Capítulos, na numeração do PDF ─── */}
        <div id="capitulos" className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 lg:px-8 xl:gap-24">
          <aside className="pt-12 lg:pt-28">
            <IndiceCapitulos itens={capitulos} />
          </aside>

          <div className="min-w-0 max-w-[58rem] pb-24">
            <Capitulo id="escopo" n="1" titulo="Escopo e quantitativos" lead={<Rico t={escopo.objeto} />}>
              <h3 className="sr-only">Área de contenção por módulo</h3>
              <BarrasContencoes linhas={escopo.contencoes} total={escopo.total} />

              <div className="mt-14 grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-[17px] font-bold text-ink">Documentos de referência</h3>
                  <ul className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-2">
                    {escopo.documentos.map((d) => (
                      <li key={d.n}>
                        <Rico t={d.t} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-display text-[17px] font-bold text-ink">Premissa</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                    <Rico t={escopo.premissa} />
                  </p>
                </div>
              </div>
            </Capitulo>

            <Capitulo
              id="responsabilidades"
              n="2·3"
              titulo="Quem faz o quê"
              lead={`A Geoforte responde por ${responsabilidades.geoforte.itens.length} itens, do projeto ao concreto; o ${cabecalho.cliente} responde por ${responsabilidades.cliente.itens.length}.`}
            >
              <h3 className="font-display text-[19px] font-bold text-ink">{responsabilidades.geoforte.titulo}</h3>
              <div className="mt-4">
                <ListaClausulas itens={responsabilidades.geoforte.itens} colunas />
              </div>


              <h3 className="mt-14 font-display text-[19px] font-bold text-ink">{responsabilidades.cliente.titulo}</h3>
              <div className="mt-4">
                <ListaClausulas itens={responsabilidades.cliente.itens} />
              </div>

              <div className="mt-20">
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
                  Como a cortina é executada
                </h3>
                <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-2">
                  Do furo à estaca pronta: os itens do escopo da Geoforte na ordem em que acontecem no canteiro.
                </p>
                <div className="mt-8">
                  <ExecucaoPassos passos={execucao.passos} />
                </div>
              </div>
            </Capitulo>

            <Capitulo id="riscos" n="4" titulo={regras.titulo} lead={regras.intro}>
              <RegrasTitulo itens={regras.itens} />
            </Capitulo>

            <Capitulo id="preco" n="5·6" titulo="Preço e pagamento" lead={precos.intro}>
              {precoGlobalPendente ? (
                <div className="border-2 border-dashed border-brand-ink bg-brand-wash px-6 py-8 text-center">
                  <p className="font-display text-[18px] font-bold text-brand-ink">[Preço global: inserir a Tabela 01 antes do envio]</p>
                  <p className="mt-2 text-[14px] text-ink-2">{precos.tabela01.legenda} A tabela não consta no arquivo original da proposta.</p>
                </div>
              ) : (
                <table className="w-full text-[15px]">
                  <caption className="mb-3 text-left font-display text-[15px] font-bold text-ink">{precos.tabela01.legenda}</caption>
                  <tbody>
                    {precos.tabela01.linhas!.map(([a, v]) => (
                      <tr key={a} className="border-t border-rule">
                        <td className="py-3 pr-4 text-ink">
                          <Rico t={a} />
                        </td>
                        <td className="py-3 text-right font-display font-bold text-ink tabular-nums">
                          <Rico t={v} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="mt-14 max-w-[46rem] space-y-12">
                <div>
                  <h3 className="font-display text-[17px] font-bold text-ink">
                    <span className="mr-2 text-[14px] font-semibold text-ink-3">5.1</span>
                    {precos.unitarios.titulo}
                  </h3>
                  <table className="mt-4 w-full text-[15px]">
                    <tbody>
                      {precos.unitarios.insumos.map(([insumo, valor]) => (
                        <tr key={insumo} className="border-t border-rule">
                          <th scope="row" className="py-3 pr-4 text-left font-normal text-ink">
                            {insumo}
                          </th>
                          <td className="py-3 text-right font-display font-bold text-ink">
                            <Rico t={valor} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
                    <Rico t={precos.unitarios.texto} />
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-[17px] font-bold text-ink">
                    <span className="mr-2 text-[14px] font-semibold text-ink-3">5.2</span>
                    {precos.reajuste.titulo}
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
                    <Rico t={precos.reajuste.texto} />
                  </p>
                </div>
              </div>

              <h3 className="mt-16 font-display text-[19px] font-bold text-ink">Pagamento</h3>
              <p className="mt-3 max-w-[64ch] text-[15.5px] leading-relaxed text-ink-2">
                <Rico t={precos.sinal.texto} /> <span className="font-display text-[13px] font-semibold text-ink-3">{precos.sinal.n}</span>{" "}
                <Rico t={precos.medicoes.texto} /> <span className="font-display text-[13px] font-semibold text-ink-3">{precos.medicoes.n}</span>
              </p>
              <div className="mt-8">
                <DivisaoFaturamento partes={precos.faturamento.partes} />
              </div>
              <ul className="mt-10 space-y-3 border-t border-rule pt-6 text-[14px] leading-relaxed text-ink-2">
                {precos.observacoes.map((o, i) => (
                  <li key={o} className="grid grid-cols-[3.5rem_minmax(0,1fr)]">
                    <span className="font-display font-semibold text-ink">Obs. {i + 1}</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Capitulo>

            <Capitulo id="condicoes" n="7" titulo="Condições gerais">
              <ListaClausulas itens={condicoes.diversos} />
            </Capitulo>

            <Capitulo id="prazos" n="8" titulo="Prazos" lead={<Rico t={execucao.prazo.texto} />}>
              <CronogramaPrazos
                dias={execucao.prazo.dias}
                equipamentos={execucao.prazo.equipamentos}
                mobilizacao={execucao.mobilizacao.texto}
                instalacao={execucao.instalacao.texto}
              />
              <div className="mt-12">
                <RegrasTitulo itens={condicoes.prazo} />
              </div>
            </Capitulo>

            <Capitulo id="aceite" n="9·10" titulo="Aceite e validade">
              <div className="grid gap-10 md:grid-cols-2">
                <p className="text-[16px] leading-relaxed text-ink">{condicoes.aceite}</p>
                <div className="space-y-4 text-[16px] leading-relaxed text-ink-2">
                  {condicoes.validade.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              </div>
            </Capitulo>

            <Capitulo
              id="memorial"
              n="11"
              titulo="Memorial de cálculo"
              lead={`Duas contenções foram calculadas: estacas de ${contDoca.estaca.comprimento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} m, Ø ${Math.round(contDoca.estaca.diametro * 100)} cm a cada ${contDoca.estaca.eixos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} m, em areia, com nível d'água a ${Math.abs(contDoca.nivelAgua).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} m. Escolha a contenção e a fase; toque no desenho ou passe o ponteiro para ler cada cota.`}
            >
              <CorteCortina contencoes={memorialWeb.contencoes} />
              <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-ink pt-5">
                <p className="font-display text-[17px] font-bold text-ink">Todas as verificações foram cumpridas.</p>
                <a href={PDF_URL} download rel="nofollow" className="inline-flex items-center gap-2 font-display text-[14px] font-semibold text-brand-ink hover:underline">
                  <Download size={15} aria-hidden />
                  Memorial completo no PDF, págs. 9 a 24
                </a>
              </div>
            </Capitulo>

            <Capitulo
              id="obras"
              n="B"
              titulo="Obras executadas"
              lead={`Contenções executadas pela Geoforte em Salvador com a mesma solução prevista para o ${cabecalho.cliente}: cortinas de estacas justapostas, em terrenos litorâneos e junto a edificações existentes.`}
            >
              <GaleriaObras obras={obras} />

              <div className="mt-20 grid items-center gap-8 border-t border-rule pt-10 sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
                <Image src={seloGeoselos} alt="Selo GeoSelos" className="h-20 w-auto" />
                <p className="text-[14px] leading-relaxed text-ink-2">
                  Selo GeoSelos de capacitação técnica em engenharia de fundações especiais e geotecnia. O certificado está na última página do PDF.
                </p>
                <Image src={logoAbef} alt="ABEF" className="h-12 w-auto" />
                <p className="text-[14px] leading-relaxed text-ink-2">Associação Brasileira de Empresas de Engenharia de Fundações e Geotecnia.</p>
              </div>
            </Capitulo>
          </div>
        </div>

        {/* ─── Fechamento ─── */}
        <section id="fechamento" aria-labelledby="fechamento-t" className="on-graphite relative overflow-hidden bg-graphite">
          <VideoFundo src={`${MIDIA}/parede.mp4`} poster={`${MIDIA}/parede.jpg`} className="opacity-50" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/92 to-graphite/45" />
          <div className="relative mx-auto grid max-w-[90rem] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-8 lg:py-32">
            <div className="lg:col-span-7">
              <div className="rule-driven max-w-64" aria-hidden />
              <h2 id="fechamento-t" className="mt-7 max-w-[18ch] font-display text-[clamp(2.1rem,4.4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em] text-ink text-balance">
                Para começar, basta autorizar a mobilização
              </h2>
              <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-ink-2">{condicoes.aceite}</p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href={aceite} className="inline-flex items-center px-7 py-4 font-display text-[15px] font-bold bg-brand text-graphite hover:bg-brand-deep transition-colors">
                  Aceitar proposta
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-rule-strong px-6 py-4 font-display text-[15px] font-semibold text-ink hover:border-ink hover:bg-white/5 transition-colors"
                >
                  <MessageCircle size={17} aria-hidden />
                  Conversar com a engenharia
                </a>
                <a href={PDF_URL} download rel="nofollow" className="inline-flex items-center gap-2 px-4 py-4 font-display text-[15px] font-semibold text-ink-2 hover:text-ink">
                  <Download size={17} aria-hidden />
                  PDF
                </a>
              </div>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="text-[15px] text-ink-2">Atenciosamente,</p>
              <p className="mt-4 font-display text-[18px] font-bold text-ink">{assinatura.nome}</p>
              <p className="text-[15px] text-ink-2">{assinatura.registro}</p>
              <address className="mt-8 border-t border-rule pt-6 text-[14px] not-italic leading-relaxed text-ink-2">
                <strong className="font-display font-semibold text-ink">{empresa.razaoSocial}</strong> · CNPJ {empresa.cnpj}
                <br />
                {empresa.endereco}
                <br />
                {empresa.cidade}
                <br />
                {empresa.telefones.join(" · ")}
                <br />
                <a href={`mailto:${empresa.email}`} className="text-ink hover:underline">
                  {empresa.email}
                </a>
              </address>
            </div>
          </div>
          <div className="relative mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-4 border-t border-rule px-5 py-6 text-[12px] text-ink-3 sm:px-8 lg:px-8">
            <p>Os vídeos da abertura, da execução e deste fechamento são ilustrativos, gerados por IA. As fotos das obras executadas são reais.</p>
            <Link href="/" className="font-display font-semibold text-ink-2 hover:text-ink">
              geoforte.com.br
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
