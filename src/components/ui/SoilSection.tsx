"use client";

import { motion } from "framer-motion";

/**
 * Corte geotécnico esquemático: três estacas atravessam as camadas do solo
 * até a camada resistente, com a carga descendo do pilar à ponta cravada.
 * É a ideia da marca ("a letra e a fundação na mesma forma") desenhada como
 * o engenheiro a lê — uma seção com escala de profundidade.
 *
 * Só usa tokens de tinta (`--ink`, `--rule`) e o laranja da marca, então
 * funciona dentro de qualquer faixa `.on-graphite`. Ilustração esquemática:
 * as camadas e profundidades não representam uma obra específica.
 */

const GROUND = 84;
const PX_PER_M = 15;
const y = (m: number) => GROUND + m * PX_PER_M;

const strata = [
  { from: 0, to: 8, label: "Aterro / areia", pattern: "soil-dots" },
  { from: 8, to: 18, label: "Argila mole", pattern: "soil-lines" },
  { from: 18, to: 27, label: "Areia compacta", pattern: "soil-cross" },
  { from: 27, to: 34, label: "Rocha alterada", pattern: "soil-rock" },
] as const;

const piles = [
  { x: 212, depth: 21, tip: false },
  { x: 302, depth: 30.5, tip: true },
  { x: 392, depth: 25, tip: false },
];

const SHAFT = 24;
const ease = [0.65, 0, 0.35, 1] as const;

export default function SoilSection({ className = "" }: { className?: string }) {
  const bottom = y(34);

  return (
    <svg
      viewBox={`0 0 540 ${bottom + 8}`}
      role="img"
      aria-label="Corte esquemático de solo com três estacas atravessando as camadas até a camada resistente"
      className={className}
    >
      <defs>
        <pattern id="soil-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="4" r="1" fill="var(--ink)" opacity="0.28" />
          <circle cx="10" cy="10" r="1" fill="var(--ink)" opacity="0.28" />
        </pattern>
        <pattern id="soil-lines" width="16" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 4.5H16" stroke="var(--ink)" strokeWidth="1" opacity="0.2" />
        </pattern>
        <pattern id="soil-cross" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M2 2l3 3M5 2L2 5M9 9l3 3M12 9l-3 3" stroke="var(--ink)" strokeWidth="1" opacity="0.26" />
        </pattern>
        <pattern id="soil-rock" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M-2 14L14 -2M4 20L20 4" stroke="var(--ink)" strokeWidth="1" opacity="0.3" />
        </pattern>
        <clipPath id="soil-clip">
          <rect x="64" y={GROUND} width="476" height={bottom - GROUND} />
        </clipPath>
      </defs>

      {/* Camadas */}
      <g clipPath="url(#soil-clip)">
        {strata.map((s, i) => (
          <g key={s.label}>
            <rect
              x="64"
              y={y(s.from)}
              width="476"
              height={(s.to - s.from) * PX_PER_M}
              fill="var(--ink)"
              opacity={0.035 + i * 0.03}
            />
            <rect
              x="64"
              y={y(s.from)}
              width="476"
              height={(s.to - s.from) * PX_PER_M}
              fill={`url(#${s.pattern})`}
            />
          </g>
        ))}
      </g>

      {/* Limites de camada + rótulos */}
      {strata.map((s, i) => (
        <g key={`${s.label}-edge`}>
          {i > 0 && (
            <path
              d={`M64 ${y(s.from)}H540`}
              stroke="var(--rule-strong)"
              strokeWidth="1"
              strokeDasharray="5 5"
            />
          )}
          <text
            x="532"
            y={y(s.from) + 20}
            textAnchor="end"
            className="font-display max-sm:hidden"
            fontSize="10.5"
            fontWeight="700"
            letterSpacing="1.3"
            fill="var(--ink-2)"
            stroke="var(--canvas)"
            strokeWidth="4"
            paintOrder="stroke"
          >
            {s.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Escala de profundidade */}
      <path d={`M56 ${GROUND}V${bottom}`} stroke="var(--rule-strong)" strokeWidth="1" />
      {[0, 10, 20, 30].map((m) => (
        <g key={m}>
          <path d={`M50 ${y(m)}H62`} stroke="var(--ink-3)" strokeWidth="1" />
          <text
            x="42"
            y={y(m) + 4}
            textAnchor="end"
            className="font-display"
            fontSize="14"
            fontWeight="700"
            fill="var(--ink-2)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {m}
          </text>
        </g>
      ))}
      <text
        x="42"
        y={GROUND - 26}
        textAnchor="end"
        className="font-display"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="1.3"
        fill="var(--ink-3)"
      >
        M
      </text>

      {/* Superestrutura: laje, pilares e blocos de coroamento */}
      <path
        d={`M150 ${GROUND - 54}H454`}
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="square"
        opacity="0.9"
      />
      {piles.map((p) => (
        <g key={`col-${p.x}`}>
          <path
            d={`M${p.x} ${GROUND - 54}V${GROUND - 12}`}
            stroke="var(--ink)"
            strokeWidth="2"
            opacity="0.55"
          />
          <rect
            x={p.x - 24}
            y={GROUND - 14}
            width={SHAFT + 24}
            height="14"
            fill="var(--ink)"
            opacity="0.9"
          />
        </g>
      ))}

      {/* Linha do terreno */}
      <path d={`M64 ${GROUND}H540`} stroke="var(--ink)" strokeWidth="2" />

      {/* Estacas: descem do bloco até a ponta, uma vez, ao entrar na tela */}
      {piles.map((p, i) => {
        const h = p.depth * PX_PER_M;
        const x0 = p.x - 24 + (SHAFT + 24) / 2 - SHAFT / 2;
        const shaft = p.tip ? h - 22 : h;
        return (
          <motion.g
            key={p.x}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 3.1 + i * 0.28, ease }}
            style={{ transformOrigin: `0px ${GROUND}px`, transformBox: "view-box" }}
          >
            <rect x={x0} y={GROUND} width={SHAFT} height={shaft} fill="#ef6c1a" />
            {p.tip && (
              <path
                d={`M${x0} ${GROUND + shaft}H${x0 + SHAFT}L${x0 + SHAFT / 2} ${GROUND + h}Z`}
                fill="#ef6c1a"
              />
            )}
          </motion.g>
        );
      })}

      {/* Cota da estaca central */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.9, duration: 0.6 }}
      >
        <path
          d={`M${piles[1].x + 36} ${GROUND}V${GROUND + piles[1].depth * PX_PER_M}`}
          stroke="var(--ink)"
          strokeWidth="1"
        />
        <path d={`M${piles[1].x + 31} ${GROUND}h10M${piles[1].x + 31} ${GROUND + piles[1].depth * PX_PER_M}h10`} stroke="var(--ink)" strokeWidth="1" />
        <text
          x={piles[1].x + 46}
          y={GROUND + piles[1].depth * PX_PER_M + 2}
          className="font-display max-sm:hidden"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1.2"
          fill="var(--ink)"
          stroke="var(--canvas)"
          strokeWidth="4"
          paintOrder="stroke"
        >
          <tspan x={piles[1].x + 46}>CRAVAÇÃO ATÉ A</tspan>
          <tspan x={piles[1].x + 46} dy="15">
            CAMADA RESISTENTE
          </tspan>
        </text>
      </motion.g>
    </svg>
  );
}
