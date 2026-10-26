"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import Rico from "./Rico";
import VideoFundo from "./VideoFundo";

const MIDIA = "/propostas/grand-palladium";
const drive = [0.65, 0, 0.35, 1] as const;

interface Passo {
  titulo: string;
  refs: string[];
  midia: string;
  clausulas: { n: string; t: string }[];
}

/** Vídeo ilustrativo de um passo, com o aviso de que não é registro de obra. */
function Midia({ p, i, total, foco }: { p: Passo; i: number; total: number; foco?: string }) {
  return (
    <>
      <VideoFundo src={`${MIDIA}/${p.midia}.mp4`} poster={`${MIDIA}/${p.midia}.jpg`} sizes="(min-width: 1024px) 36rem, 100vw" foco={foco} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite/80 to-transparent" />
      <p className="absolute bottom-4 left-4 font-display text-[14px] font-semibold text-paper">
        <span className="tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
        <span className="text-paper/60"> / {String(total).padStart(2, "0")}</span> · {p.titulo}
      </p>
      <p className="absolute right-3 top-3 bg-graphite/70 px-2 py-1 font-display text-[12px] font-medium text-paper/80">Imagem ilustrativa</p>
    </>
  );
}

/**
 * Execução em quatro passos. No desktop o palco de vídeo fica parado ao lado e
 * troca de passo conforme a leitura desce: o novo vídeo entra de cima para baixo,
 * como uma estaca cravada, e o fio laranja à esquerda acompanha a rolagem.
 * No celular (ou com "reduzir movimento") vira uma sequência simples.
 */
export default function ExecucaoPassos({ passos }: { passos: Passo[] }) {
  const [ativo, setAtivo] = useState(0);
  const lista = useRef<HTMLOListElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: lista, offset: ["start 65%", "end 65%"] });

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
      <ol ref={lista} className="relative lg:pl-7">
        <span aria-hidden className="absolute bottom-0 left-0 top-0 hidden w-[2px] bg-rule lg:block" />
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 hidden h-full w-[2px] origin-top bg-brand lg:block"
          style={{ scaleY: scrollYProgress }}
        />
        {passos.map((p, i) => (
          <motion.li
            key={p.titulo}
            onViewportEnter={() => setAtivo(i)}
            viewport={{ amount: 0.55 }}
            className="flex flex-col justify-center py-8 lg:min-h-[64vh]"
          >
            <div className="relative mb-6 aspect-[16/10] overflow-hidden bg-graphite lg:hidden">
              <Midia p={p} i={i} total={passos.length} />
            </div>
            {/* o passo em leitura ganha o número laranja; o texto das cláusulas fica sempre legível */}
            <p
              className={`font-display text-[clamp(2rem,3.4vw,2.75rem)] font-bold leading-none tracking-[-0.03em] tabular-nums transition-colors duration-500 ${
                i === ativo ? "text-brand-ink" : "text-brand-ink lg:text-ink-3"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h4 className="mt-3 font-display text-[clamp(1.4rem,2.2vw,1.75rem)] font-bold tracking-[-0.02em] text-ink">{p.titulo}</h4>
            <ul className="mt-4 space-y-3">
              {p.clausulas.map((c) => (
                <li key={c.n} className="text-[15px] leading-relaxed text-ink-2">
                  {/* número da cláusula em linha: o texto usa a largura toda da coluna */}
                  <span className="mr-2 font-display text-[13px] font-semibold tabular-nums text-ink-3">{c.n}</span>
                  <Rico t={c.t} />
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>

      <div className="hidden lg:block">
        {/* palco: ocupa a altura útil da tela enquanto os passos rolam ao lado */}
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center py-6">
          <div className="relative aspect-[4/5] max-h-[calc(100svh-9rem)] overflow-hidden bg-graphite">
            <AnimatePresence initial={false}>
              <motion.div
                key={ativo}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: reduzir ? 0 : 0.75, ease: drive } }}
                exit={{ opacity: 0, transition: { duration: reduzir ? 0 : 0.35, delay: reduzir ? 0 : 0.4 } }}
              >
                {/* os vídeos são 16:9; no quadro vertical o assunto fica à direita do centro */}
                <Midia p={passos[ativo]} i={ativo} total={passos.length} foco="62% 50%" />
              </motion.div>
            </AnimatePresence>
          </div>
          <ol className="mt-4 grid grid-cols-4 gap-2" aria-hidden>
            {passos.map((p, i) => (
              <li key={p.titulo} className="h-[3px] bg-rule">
                <motion.span
                  className="block h-full origin-left bg-brand"
                  initial={false}
                  animate={{ scaleX: i <= ativo ? 1 : 0 }}
                  transition={{ duration: reduzir ? 0 : 0.5, ease: drive }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
