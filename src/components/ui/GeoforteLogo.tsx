import { brand, mark } from "@/lib/brand";
import { lockupMetrics, wordmark } from "@/lib/wordmark";

type Tone = "auto" | "onPaper" | "onGraphite" | "mono";
type Variant = "lockup" | "stacked" | "symbol";

interface GeoforteLogoProps {
  variant?: Variant;
  /**
   * "auto" (padrão) lê `var(--ink)` / `var(--brand-ink)` — as mesmas
   * variáveis que o resto do site usa — então a marca se adapta sozinha ao
   * fundo em que for colocada: tema claro, tema escuro ou dentro de uma
   * faixa `.on-graphite`. Use "onPaper"/"onGraphite" só quando precisar de
   * uma cor fixa independente do tema (ex.: comparar as duas versões lado a
   * lado na página /marca).
   */
  tone?: Tone;
  /** Altura do símbolo (anel + estaca) em px. Todo o resto escala a partir dela. */
  size?: number;
  /** Anima a estaca sendo cravada na montagem. */
  driven?: boolean;
  className?: string;
}

const palettes: Record<Tone, { ring: string; pile: string; word: string; tag: string }> = {
  auto: {
    ring: brand.orange,
    pile: "var(--ink)",
    word: "var(--ink)",
    tag: "var(--brand-ink)",
  },
  onPaper: {
    ring: brand.orange,
    pile: brand.graphite,
    word: brand.graphite,
    tag: brand.orangeInk,
  },
  onGraphite: {
    ring: brand.orange,
    pile: brand.paper,
    word: brand.paper,
    tag: brand.orange,
  },
  mono: {
    ring: "currentColor",
    pile: "currentColor",
    word: "currentColor",
    tag: "currentColor",
  },
};

const SYMBOL_RATIO = mark.width / mark.height;

function Mark({
  ring,
  pile,
  driven,
  transform,
}: {
  ring: string;
  pile: string;
  driven?: boolean;
  transform?: string;
}) {
  return (
    <g transform={transform}>
      {/* A estaca cresce a partir do topo do fuste — o gesto da marca. */}
      <path
        d={mark.pile}
        fill={pile}
        className={driven ? "geoforte-drive" : undefined}
        style={driven ? { transformOrigin: "50px 91px" } : undefined}
      />
      <path d={mark.ring} fill={ring} />
      <rect
        x={mark.bar.x}
        y={mark.bar.y}
        width={mark.bar.width}
        height={mark.bar.height}
        fill={ring}
      />
    </g>
  );
}

export default function GeoforteLogo({
  variant = "lockup",
  tone = "auto",
  size = 42,
  driven = false,
  className = "",
}: GeoforteLogoProps) {
  const p = palettes[tone];
  const shared = {
    role: "img" as const,
    "aria-label": "Geoforte Fundações",
    className: `select-none shrink-0 ${className}`,
  };

  if (variant === "symbol") {
    return (
      <svg
        {...shared}
        viewBox={mark.viewBox}
        width={size * SYMBOL_RATIO}
        height={size}
      >
        <Mark ring={p.ring} pile={p.pile} driven={driven} />
      </svg>
    );
  }

  // Todo o desenho é feito em unidades de cap height (C = 100).
  const m = variant === "stacked" ? lockupMetrics.stacked : lockupMetrics.lockup;
  const symH = m.symbolHeight * 100;
  const symW = symH * SYMBOL_RATIO;
  const scale = symH / mark.height;
  const tagW = wordmark.tag.width * m.tagCap;

  if (variant === "stacked") {
    const boxW = wordmark.word.width;
    const wordBase = symH + m.gap * 100 + 100;
    const tagBase = wordBase + m.tagGap * 100 + m.tagCap * 100;
    const boxH = tagBase + wordmark.tag.bottom * m.tagCap;
    return (
      <svg {...shared} viewBox={`0 0 ${boxW} ${boxH}`} height={(size * boxH) / symH}>
        <Mark
          ring={p.ring}
          pile={p.pile}
          driven={driven}
          transform={`translate(${(boxW - symW) / 2} 0) scale(${scale})`}
        />
        <path transform={`translate(0 ${wordBase})`} d={wordmark.word.d} fill={p.word} />
        <path
          transform={`translate(${(boxW - tagW) / 2} ${tagBase}) scale(${m.tagCap})`}
          d={wordmark.tag.d}
          fill={p.tag}
        />
      </svg>
    );
  }

  const textX = symW + m.gap * 100;
  const blockH = 100 + m.tagGap * 100 + m.tagCap * 100;
  const wordBase = (symH - blockH) / 2 + 100;
  const tagBase = wordBase + m.tagGap * 100 + m.tagCap * 100;
  const boxW = textX + wordmark.word.width;

  return (
    <svg {...shared} viewBox={`0 0 ${boxW} ${symH}`} height={size}>
      <Mark ring={p.ring} pile={p.pile} driven={driven} transform={`scale(${scale})`} />
      <path transform={`translate(${textX} ${wordBase})`} d={wordmark.word.d} fill={p.word} />
      <path
        transform={`translate(${textX} ${tagBase}) scale(${m.tagCap})`}
        d={wordmark.tag.d}
        fill={p.tag}
      />
    </svg>
  );
}
