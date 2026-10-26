"use client";

import { motion } from "framer-motion";
import Rico from "./Rico";

const drive = [0.65, 0, 0.35, 1] as const;

/**
 * Faturamento 60/40 (cláusula 6.3): uma barra, duas partes separadas por um
 * vão de 2px, cada parte rotulada por dentro. A identidade vem do rótulo, não da cor.
 */
export function DivisaoFaturamento({ partes }: { partes: { pct: string; valor: number; t: string }[] }) {
  return (
    <figure>
      <div className="flex h-14 gap-[2px]" aria-hidden>
        {partes.map((p, i) => (
          <motion.div
            key={p.pct}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ duration: 0.7, delay: i * 0.18, ease: drive }}
            className={`flex origin-left items-center px-4 font-display text-[22px] font-bold ${
              i ? "rounded-r-[4px] bg-ink text-canvas" : "bg-[var(--serie)] text-paper"
            }`}
            style={{ width: `${p.valor}%` }}
          >
            {p.pct}
          </motion.div>
        ))}
      </div>
      <figcaption className="mt-5 grid gap-6 sm:grid-cols-2">
        {partes.map((p) => (
          <p key={p.pct} className="text-[15px] leading-relaxed text-ink-2">
            <strong className="mr-1 font-display font-bold text-ink">{p.pct}</strong>
            <Rico t={p.t.replace(/^Faturamento dos serviços em \d+% do valor /, "")} />
          </p>
        ))}
      </figcaption>
    </figure>
  );
}

/**
 * Prazos (cláusulas 8.1 a 8.3) numa régua de dias úteis. A mobilização não tem
 * duração na proposta ("a combinar"), então fica fora da escala, como um marco.
 */
export function CronogramaPrazos({
  dias,
  equipamentos,
  mobilizacao,
  instalacao,
}: {
  dias: number;
  equipamentos: number;
  mobilizacao: string;
  instalacao: string;
}) {
  const totalDias = dias + 1;
  const marcas = [0, 20, 40, 60, 80].filter((m) => m < totalDias);
  return (
    <figure>
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <div className="flex flex-col justify-end pb-[2px]">
          <p className="font-display text-[13px] font-semibold text-ink">Mobilização</p>
          <p className="text-[13px] text-ink-3">{mobilizacao.replace(/^.*?:\s*/, "").replace(/\.$/, "")}</p>
          <div className="mt-2 h-10 border-2 border-rule-strong" aria-hidden />
        </div>
        <div>
          <div className="flex items-end justify-between gap-3">
            <p className="font-display text-[13px] font-semibold text-ink">
              Instalação · {instalacao.replace(/^.*?:\s*/, "").replace(/\.$/, "").replace(/^0/, "")}
            </p>
            <p className="text-right font-display text-[13px] font-semibold text-ink">
              Execução · {dias} dias úteis com {equipamentos} perfuratrizes
            </p>
          </div>
          <div className="relative mt-2 h-10" aria-hidden>
            {marcas.map((m) => (
              <span key={m} className="absolute inset-y-0 w-px bg-rule" style={{ left: `${(m / totalDias) * 100}%` }} />
            ))}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.9 }}
              transition={{ duration: 1.1, ease: drive }}
              className="absolute inset-y-0 left-0 flex origin-left gap-[2px]"
              style={{ width: "100%" }}
            >
              <span className="h-full bg-ink" style={{ width: `${(1 / totalDias) * 100}%`, minWidth: 6 }} />
              <span className="h-full flex-1 rounded-r-[4px] bg-[var(--serie)]" />
            </motion.div>
          </div>
          <div className="relative mt-2 h-5 text-[12px] tabular-nums text-ink-3" aria-hidden>
            {marcas.map((m) => (
              <span key={m} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${(m / totalDias) * 100}%` }}>
                {m}
              </span>
            ))}
            <span className="absolute right-0">{totalDias}</span>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        {`Mobilização ${mobilizacao}; instalação ${instalacao}; execução estimada em ${dias} dias úteis com ${equipamentos} equipamentos.`}
      </figcaption>
    </figure>
  );
}
