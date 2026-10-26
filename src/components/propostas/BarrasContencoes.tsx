"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Linha {
  n: string;
  nome: string;
  area: string;
  m2: number;
}

const drive = [0.65, 0, 0.35, 1] as const;
const pct = (v: number, total: number) =>
  (v / total).toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Área de contenção por módulo (cláusula 1.3): uma série, uma cor, o valor na
 * ponta de cada barra. As barras são cravadas da base, uma vez, ao entrar na tela.
 * A lista é a própria tabela: nome, cláusula e área ficam legíveis sem hover.
 */
export default function BarrasContencoes({ linhas, total }: { linhas: Linha[]; total: { n: string; valor: string } }) {
  const [foco, setFoco] = useState<number | null>(null);
  const soma = linhas.reduce((s, l) => s + l.m2, 0);
  const maior = Math.max(...linhas.map((l) => l.m2));
  const atual = foco == null ? null : linhas[foco];

  return (
    <figure>
      <ul className="space-y-3.5" onMouseLeave={() => setFoco(null)}>
        {linhas.map((l, i) => (
          <li
            key={l.n}
            tabIndex={0}
            aria-label={`${l.n} ${l.nome}: ${l.area} m², ${pct(l.m2, soma)} da soma das áreas`}
            onMouseEnter={() => setFoco(i)}
            onFocus={() => setFoco(i)}
            onBlur={() => setFoco(null)}
            className="grid grid-cols-1 items-center gap-x-4 gap-y-1.5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
          >
            <span className="min-w-0 text-[15px] leading-tight text-ink">
              <span className="mr-2 font-display text-[13px] font-semibold tabular-nums text-ink-3">{l.n}</span>
              {l.nome}
            </span>
            {/* a trilha reserva o lugar do valor; a barra é a fração dela, então a proporção vale em qualquer largura */}
            <span className="flex items-center">
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.75, delay: i * 0.07, ease: drive }}
                className="block h-[18px] shrink-0 origin-left rounded-r-[4px] bg-[var(--serie)] transition-opacity"
                style={{ width: `calc((100% - 7rem) * ${l.m2 / maior})`, opacity: foco == null || foco === i ? 1 : 0.35 }}
              />
              <span className="ml-3 shrink-0 font-display text-[15px] font-bold tabular-nums text-ink">{l.area} m²</span>
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-4" aria-live="polite">
        <span className="text-[15px] text-ink-2">
          {atual ? (
            <>
              {atual.nome}: <strong className="font-display font-bold text-ink">{pct(atual.m2, soma)}</strong> da soma das
              áreas (cláusula {atual.n})
            </>
          ) : (
            "Total do projeto global (cláusula " + total.n + ")"
          )}
        </span>
        <span className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-none tracking-[-0.02em] text-ink">{total.valor}</span>
      </figcaption>
    </figure>
  );
}
