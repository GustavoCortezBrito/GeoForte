import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";
import GeoforteLogo from "@/components/ui/GeoforteLogo";
import { brand, mark, markSpecs } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Identidade visual",
  description:
    "Manual de aplicação da marca Geoforte Fundações — Conceito 01 “Pilar”: símbolo, versões, paleta, tipografia e regras de uso.",
};

const palette = [
  {
    name: "Laranja Geoforte",
    hex: "#EF6C1A",
    ink: brand.graphite,
    use: "Símbolo, botões de ação, detalhes. Sobre papel, apenas em blocos ou texto grande.",
    note: "Contraste 5,0:1 com grafite",
  },
  {
    name: "Laranja queimado",
    hex: "#B94E0C",
    ink: brand.paper,
    use: "Variante do mesmo matiz para texto pequeno e ícones sobre papel.",
    note: "Contraste 4,8:1 sobre papel",
  },
  {
    name: "Grafite",
    hex: "#22252A",
    ink: brand.paper,
    use: "Tinta principal, a estaca do símbolo e as faixas escuras do site.",
    note: "Contraste 14,7:1 sobre papel",
  },
  {
    name: "Papel",
    hex: "#FAFAF8",
    ink: brand.graphite,
    use: "Fundo padrão de todas as peças e tinta sobre grafite.",
    note: "Base do sistema",
  },
];

const files = [
  { label: "Logotipo horizontal", href: "/marca/geoforte-logo-horizontal.svg", ext: "SVG" },
  {
    label: "Logotipo horizontal (fundo escuro)",
    href: "/marca/geoforte-logo-horizontal-invertido.svg",
    ext: "SVG",
  },
  { label: "Logotipo vertical", href: "/marca/geoforte-logo-vertical.svg", ext: "SVG" },
  {
    label: "Logotipo vertical (fundo escuro)",
    href: "/marca/geoforte-logo-vertical-invertido.svg",
    ext: "SVG",
  },
  { label: "Símbolo", href: "/marca/geoforte-simbolo.svg", ext: "SVG" },
  { label: "Símbolo (fundo escuro)", href: "/marca/geoforte-simbolo-invertido.svg", ext: "SVG" },
  { label: "Símbolo em alta resolução", href: "/marca/geoforte-simbolo.png", ext: "PNG" },
  { label: "Avatar / selo", href: "/marca/geoforte-avatar.svg", ext: "SVG" },
];

const misuse = [
  ["Distorcer", "O logotipo só escala proporcionalmente."],
  ["Recolorir", "Nunca fora da paleta: laranja no anel, grafite ou papel na estaca."],
  ["Girar", "A estaca é cravada na vertical. Sempre."],
  ["Aplicar sobre foto agitada", "Use a faixa grafite ou um recorte calmo da imagem."],
  ["Laranja em texto miúdo", "Sobre papel, texto pequeno usa o laranja queimado."],
  ["Recompor", "Não altere a folga entre símbolo e tipografia."],
];

const sectionTitle =
  "font-display font-bold text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.03em] text-ink";
const microTitle =
  "font-display font-bold text-[11px] uppercase tracking-[0.16em] text-ink-3";

/** Desenho de construção do símbolo, com as circunferências e a cunha de ±32°. */
function ConstructionDrawing() {
  const guide = "rgba(34,37,42,0.35)";
  const wedge = 32 * (Math.PI / 180);
  const ax = 68.7;
  const ex = ax + 60 * Math.cos(wedge);
  const ey = 50 - 60 * Math.sin(wedge);

  return (
    <svg viewBox="-16 -16 132 175" className="w-full max-w-sm" role="img"
      aria-label="Desenho de construção do símbolo: circunferências de raio 50 e 30,5 e cunha de 32 graus">
      <g stroke={guide} strokeWidth="0.4" fill="none">
        <circle cx="50" cy="50" r="50" strokeDasharray="3 2.5" />
        <circle cx="50" cy="50" r="30.5" strokeDasharray="3 2.5" />
        <path d="M-10 50H112M50-10V151" strokeDasharray="6 3" />
        <path d={`M${ax} 50L${ex} ${ey}`} />
        <path d={`M${ax} 50L${ex} ${100 - ey}`} />
        <path d={`M${ax + 26} ${50 - 26 * Math.tan(wedge)}A26 26 0 0 1 ${ax + 26} ${50 + 26 * Math.tan(wedge)}`} />
        <path d="M-8 91H62M-8 141H62" strokeDasharray="3 2.5" />
      </g>
      <g opacity="0.16">
        <path d={mark.ring} fill={brand.orange} />
        <rect {...mark.bar} fill={brand.orange} />
        <path d={mark.pile} fill={brand.graphite} />
      </g>
      <g
        fill={brand.graphite}
        className="font-display"
        fontSize="6"
        fontWeight="700"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <text x="2" y="46">R 50</text>
        <text x="52" y="46">r 30,5</text>
        <text x={ax + 29} y="52">32°</text>
        <text x="-14" y="88">91</text>
        <text x="-14" y="138">141</text>
      </g>
    </svg>
  );
}

export default function MarcaPage() {
  return (
    <main className="pb-28">
      {/* Capa */}
      <header className="on-graphite bg-graphite">
        <div className="max-w-5xl mx-auto px-5 pt-10 pb-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink-3 hover:text-brand text-[13px] font-display font-medium transition-colors"
          >
            <ArrowLeft size={15} aria-hidden />
            Voltar ao site
          </Link>

          <div className="mt-16 grid md:grid-cols-[auto_1fr] gap-12 md:gap-16 items-center">
            <GeoforteLogo variant="stacked" tone="onGraphite" size={150} />
            <div>
              <div className="rule-driven max-w-40" aria-hidden />
              <h1 className="mt-7 font-display font-bold text-[clamp(2rem,5vw,3.25rem)] leading-[1.03] tracking-[-0.035em] text-ink">
                Identidade visual
              </h1>
              <p className="mt-5 text-ink-2 text-[17px] leading-relaxed max-w-[52ch]">
                Conceito 01 — <strong className="text-ink font-medium">Pilar</strong>. O
                “G” da marca redesenhado com precisão geométrica e prolongado numa
                ponta cravada no chão: a letra e a fundação na mesma forma. Preserva
                a herança visual (o círculo, o laranja) com um traço mais técnico.
              </p>
              <a
                href="/docs/geoforte-identidade-visual-conceitos.pdf"
                className="mt-7 inline-flex items-center gap-2.5 px-5 py-3 border border-rule-strong hover:border-ink text-ink text-sm font-display font-bold transition-colors"
              >
                <FileText size={16} aria-hidden />
                Estudo completo dos conceitos (PDF)
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5">
        {/* Construção */}
        <section className="pt-20">
          <div className="rule-driven max-w-40" aria-hidden />
          <h2 className={`mt-7 ${sectionTitle}`}>Construção do símbolo</h2>
          <p className="mt-4 text-ink-2 leading-relaxed max-w-[58ch]">
            Toda a marca deriva de um único valor: o diâmetro externo do anel. As
            proporções abaixo são fixas — redesenhar o símbolo significa apenas
            reescalar esse diâmetro.
          </p>

          <div className="mt-10 grid md:grid-cols-[1fr_1.1fr] gap-12 items-start">
            <div className="bg-card border border-rule p-8 flex justify-center">
              <ConstructionDrawing />
            </div>
            <dl>
              {markSpecs.map(([label, value, note]) => (
                <div key={label} className="py-4 border-t border-rule last:border-b">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-display font-bold text-[15px] text-ink">{label}</dt>
                    <span className="font-display font-bold text-[15px] text-brand-ink tabular-nums shrink-0">
                      {value}
                    </span>
                  </div>
                  <dd className="mt-1 text-ink-2 text-sm leading-relaxed">{note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Versões */}
        <section className="pt-20">
          <div className="rule-driven max-w-40" aria-hidden />
          <h2 className={`mt-7 ${sectionTitle}`}>Versões</h2>
          <p className="mt-4 text-ink-2 leading-relaxed max-w-[58ch]">
            A versão horizontal é a padrão para cabeçalhos e assinaturas. A vertical
            é a do manual e funciona melhor em peças centradas. O símbolo isolado
            serve como selo, favicon e marca em equipamentos.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            <div className="bg-card border border-rule p-10 flex items-center justify-center min-h-44">
              <GeoforteLogo variant="lockup" tone="onPaper" size={72} />
            </div>
            <div className="on-graphite bg-graphite p-10 flex items-center justify-center min-h-44">
              <GeoforteLogo variant="lockup" tone="onGraphite" size={72} />
            </div>
            <div className="bg-card border border-rule p-10 flex items-center justify-center min-h-56">
              <GeoforteLogo variant="stacked" tone="onPaper" size={96} />
            </div>
            <div className="on-graphite bg-graphite p-10 flex items-center justify-center min-h-56">
              <GeoforteLogo variant="stacked" tone="onGraphite" size={96} />
            </div>
          </div>

          {/* Redução */}
          <h3 className={`mt-14 ${microTitle}`}>Tamanho mínimo</h3>
          <div className="mt-5 bg-card border border-rule p-8 flex flex-wrap items-end gap-10">
            {[16, 24, 32, 48, 72].map((s) => (
              <div key={s} className="text-center">
                <GeoforteLogo variant="symbol" tone="onPaper" size={s} className="mx-auto" />
                <span className="mt-3 block text-[11px] text-ink-3 font-display font-medium tabular-nums">
                  {s} px
                </span>
              </div>
            ))}
            <p className="text-ink-2 text-sm leading-relaxed max-w-[34ch]">
              O símbolo se mantém legível a partir de <strong className="text-ink font-medium">16 px</strong> de
              altura. O logotipo horizontal não deve ser usado abaixo de 110 px de
              largura; abaixo disso, use só o símbolo.
            </p>
          </div>
        </section>

        {/* Paleta */}
        <section className="pt-20">
          <div className="rule-driven max-w-40" aria-hidden />
          <h2 className={`mt-7 ${sectionTitle}`}>Paleta</h2>
          <p className="mt-4 text-ink-2 leading-relaxed max-w-[58ch]">
            Três cores e uma variante de acessibilidade. O laranja é escasso por
            regra: ele marca a ação, nunca o ambiente.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {palette.map((c) => (
              <div key={c.hex} className="border border-rule">
                <div
                  className="h-32 flex items-end p-4"
                  style={{ background: c.hex, color: c.ink }}
                >
                  <span className="font-display font-bold text-sm tabular-nums">
                    {c.hex}
                  </span>
                </div>
                <div className="p-4 bg-card">
                  <h3 className="font-display font-bold text-[15px] text-ink">{c.name}</h3>
                  <p className="mt-2 text-ink-2 text-[13.5px] leading-relaxed">{c.use}</p>
                  <p className="mt-3 text-[11px] font-display font-bold uppercase tracking-[0.12em] text-ink-3">
                    {c.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tipografia */}
        <section className="pt-20">
          <div className="rule-driven max-w-40" aria-hidden />
          <h2 className={`mt-7 ${sectionTitle}`}>Tipografia</h2>
          <p className="mt-4 text-ink-2 leading-relaxed max-w-[58ch]">
            Space Grotesk nos títulos, números e no próprio logotipo. Manrope no
            texto corrido. Ambas no Google Fonts, licença SIL Open Font.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="bg-card border border-rule p-8">
              <h3 className={microTitle}>Space Grotesk · títulos</h3>
              <p className="mt-6 font-display font-bold text-4xl tracking-[-0.03em] text-ink">
                Aa Gg 1995
              </p>
              <p className="mt-5 font-display text-[17px] text-ink-2 leading-snug">
                Qualidade do projeto à execução
              </p>
              <p className="mt-6 pt-5 border-t border-rule text-[13px] text-ink-3">
                Pesos 300–700. O logotipo usa o peso 700 vetorizado — nunca redigite
                a marca com a fonte viva.
              </p>
            </div>
            <div className="bg-card border border-rule p-8">
              <h3 className={microTitle}>Manrope · texto</h3>
              <p className="mt-6 text-4xl text-ink">Aa Gg 1995</p>
              <p className="mt-5 text-[15px] text-ink-2 leading-relaxed">
                Estacas hélice contínua monitoradas, escavadas, Franki, metálicas e
                pré-moldadas, executadas em todo o território nacional.
              </p>
              <p className="mt-6 pt-5 border-t border-rule text-[13px] text-ink-3">
                Pesos 200–800. Corpo de texto entre 15 e 17 px, medida de 58 a 70
                caracteres.
              </p>
            </div>
          </div>
        </section>

        {/* Usos indevidos */}
        <section className="pt-20">
          <div className="rule-driven max-w-40" aria-hidden />
          <h2 className={`mt-7 ${sectionTitle}`}>O que não fazer</h2>
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
            {misuse.map(([title, detail]) => (
              <li key={title} className="py-5 border-t border-rule">
                <h3 className="font-display font-bold text-[15px] text-ink">{title}</h3>
                <p className="mt-1.5 text-ink-2 text-sm leading-relaxed">{detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Arquivos */}
        <section className="pt-20">
          <div className="rule-driven max-w-40" aria-hidden />
          <h2 className={`mt-7 ${sectionTitle}`}>Arquivos</h2>
          <p className="mt-4 text-ink-2 leading-relaxed max-w-[58ch]">
            Vetores prontos para fachada, veículos, papelaria, uniformes e
            equipamentos. Todos com a tipografia já convertida em curvas.
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-x-10">
            {files.map((f) => (
              <li key={f.href}>
                <a
                  href={f.href}
                  download
                  className="group flex items-center justify-between gap-4 py-4 border-t border-rule text-ink hover:text-brand-ink transition-colors"
                >
                  <span className="font-display font-medium text-[15px]">{f.label}</span>
                  <span className="flex items-center gap-2.5 shrink-0 text-ink-3 group-hover:text-brand-ink transition-colors">
                    <span className="text-[11px] font-display font-bold tracking-[0.1em]">
                      {f.ext}
                    </span>
                    <Download size={15} aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
