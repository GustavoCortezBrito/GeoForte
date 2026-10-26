"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface Foto {
  src: StaticImageData;
  legenda: string;
  foco?: string;
}
interface Obra {
  numero: string;
  nome: string;
  construtora: string;
  local: string;
  ano: string | null;
  fotos: Foto[];
  solucao: string;
  complemento: string | null;
  ficha: [string, string][];
  destaque: string | null;
}

const drive = [0.16, 1, 0.3, 1] as const;

/** Miniatura que abre o visor; a imagem tem o mesmo layoutId da foto ampliada. */
function Miniatura({ ft, o, f, abrir, className }: { ft: Foto; o: number; f: number; abrir: (e: React.MouseEvent<HTMLElement>) => void; className: string }) {
  return (
    <button type="button" onClick={abrir} aria-label={`Ampliar: ${ft.legenda}`} className={`group relative block overflow-hidden bg-canvas-sunk ${className}`}>
      <motion.div layoutId={idFoto(o, f)} className="absolute inset-0">
        <Image
          src={ft.src}
          alt=""
          fill
          placeholder="blur"
          sizes="12rem"
          className="object-cover transition-transform duration-500 ease-drive group-hover:scale-105"
          style={ft.foco ? { objectPosition: ft.foco } : undefined}
        />
      </motion.div>
    </button>
  );
}
const idFoto = (o: number, f: number) => `obra-${o}-foto-${f}`;

/**
 * Obras executadas: foto principal, ficha e a tira com todas as fotos reais.
 * Qualquer foto abre o visor: ela cresce do lugar onde estava (layoutId) e o
 * visitante passa as outras por setas, teclado ou arrasto.
 */
export default function GaleriaObras({ obras }: { obras: Obra[] }) {
  const [aberta, setAberta] = useState<{ o: number; f: number; inicial: number } | null>(null);
  const gatilho = useRef<HTMLElement | null>(null);

  const abrir = (o: number, f: number) => (e: React.MouseEvent<HTMLElement>) => {
    gatilho.current = e.currentTarget;
    setAberta({ o, f, inicial: f });
  };
  const fechar = useCallback(() => {
    setAberta(null);
    gatilho.current?.focus();
  }, []);

  return (
    <>
      <div className="space-y-20">
        {obras.map((o, oi) => {
          const [principal, ...demais] = o.fotos;
          const inverter = oi % 2 === 1;
          // até 2 fotos extras: ficam em par na coluna do texto; mais que isso, numa faixa abaixo
          const poucas = demais.length <= 2;
          return (
            <article key={o.numero} className="grid gap-x-6 gap-y-5 md:grid-cols-12">
              <button
                type="button"
                onClick={abrir(oi, 0)}
                aria-label={`Ampliar: ${o.nome}, ${principal.legenda.toLowerCase()}`}
                className={`group relative aspect-[4/3] overflow-hidden bg-canvas-sunk text-left md:col-span-8 ${inverter ? "md:order-2" : ""}`}
              >
                <motion.div layoutId={idFoto(oi, 0)} className="absolute inset-0">
                  <Image
                    src={principal.src}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 38rem, 100vw"
                    className="object-cover transition-transform duration-700 ease-drive group-hover:scale-[1.03]"
                    style={principal.foco ? { objectPosition: principal.foco } : undefined}
                  />
                </motion.div>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite/85 to-transparent" />
                <span className="absolute bottom-4 left-4 right-4 flex items-center gap-2.5 font-display text-[14px] font-medium text-paper">
                  <span aria-hidden className="h-[2px] w-5 shrink-0 bg-brand" />
                  {principal.legenda}
                </span>
                <span aria-hidden className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-graphite/70 text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand size={16} />
                </span>
              </button>

              <div className={`flex flex-col md:col-span-4 ${inverter ? "md:order-1" : ""}`}>
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,1.9rem)] font-bold leading-tight tracking-[-0.02em] text-ink">{o.nome}</h3>
                <p className="mt-1.5 text-[15px] text-ink-2">
                  {o.construtora} · {o.local}
                  {o.ano ? ` · ${o.ano}` : ""}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink">
                  {o.solucao}
                  {o.complemento ? ` com ${o.complemento.toLowerCase()}` : ""}.
                </p>
                {o.ficha.length > 0 && (
                  <dl className="mt-4 text-[14px]">
                    {o.ficha.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-t border-rule py-2">
                        <dt className="text-ink-2">{k}</dt>
                        <dd className="font-display font-semibold text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {o.destaque && <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{o.destaque}</p>}
                <button
                  type="button"
                  onClick={abrir(oi, 0)}
                  className="mt-6 inline-flex items-center gap-2 self-start border-b-2 border-brand pb-1 font-display text-[14px] font-semibold text-ink transition-colors hover:text-brand-ink"
                >
                  Ver as {o.fotos.length} fotos da obra
                </button>
                {poucas && demais.length > 0 && (
                  <ul className="mt-5 grid grid-cols-2 gap-2" aria-label={`Mais fotos de ${o.nome}`}>
                    {demais.map((ft, i) => (
                      <li key={ft.legenda + i}>
                        <Miniatura ft={ft} o={oi} f={i + 1} abrir={abrir(oi, i + 1)} className="aspect-[4/3] w-full" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {!poucas && (
                <ul
                  className="-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 md:order-3 md:col-span-12 md:mx-0 md:grid md:grid-cols-6 md:overflow-visible md:px-0"
                  aria-label={`Mais fotos de ${o.nome}`}
                >
                  {demais.map((ft, i) => (
                    <li key={ft.legenda + i} className="shrink-0 snap-start">
                      <Miniatura ft={ft} o={oi} f={i + 1} abrir={abrir(oi, i + 1)} className="h-28 w-36 sm:h-32 sm:w-44 md:aspect-[4/3] md:h-auto md:w-full" />
                    </li>
                  ))}
                  {/* fecha a grade de 6 colunas quando sobra um lugar (11 fotos + este) */}
                  {demais.length % 6 === 5 && (
                    <li className="hidden md:block">
                      <button
                        type="button"
                        onClick={abrir(oi, 0)}
                        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 border border-rule-strong font-display text-ink transition-colors hover:border-ink hover:text-brand-ink"
                      >
                        <span className="text-[22px] font-bold leading-none tabular-nums">{o.fotos.length}</span>
                        <span className="text-[13px] font-semibold">ver todas</span>
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      <AnimatePresence>
        {aberta && (
          <Visor
            obra={obras[aberta.o]}
            o={aberta.o}
            f={aberta.f}
            inicial={aberta.inicial}
            ir={(f) => setAberta((a) => (a ? { ...a, f } : a))}
            fechar={fechar}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Visor({
  obra,
  o,
  f,
  inicial,
  ir,
  fechar,
}: {
  obra: Obra;
  o: number;
  f: number;
  inicial: number;
  ir: (f: number) => void;
  fechar: () => void;
}) {
  const total = obra.fotos.length;
  const foto = obra.fotos[f];
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const reduzir = useReducedMotion();
  const [direcao, setDirecao] = useState(0);
  const passar = useCallback(
    (d: number) => {
      setDirecao(d);
      ir((f + d + total) % total);
    },
    [f, total, ir],
  );

  useEffect(() => {
    botaoFechar.current?.focus();
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    return () => {
      raiz.style.overflow = antes;
    };
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") passar(1);
      if (e.key === "ArrowLeft") passar(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [fechar, passar]);

  const proporcao = foto.src.width / foto.src.height;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos da obra ${obra.nome}`}
      className="on-graphite fixed inset-0 z-[70] flex flex-col bg-graphite/96"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p className="font-display text-[15px] font-semibold text-ink">
          {obra.nome}
          <span className="ml-3 font-medium tabular-nums text-ink-2">
            {f + 1} / {total}
          </span>
        </p>
        <button
          ref={botaoFechar}
          type="button"
          onClick={fechar}
          aria-label="Fechar as fotos"
          className="flex h-11 w-11 items-center justify-center border border-rule-strong text-ink transition-colors hover:border-ink"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 sm:px-20" onClick={(e) => e.target === e.currentTarget && fechar()}>
        <AnimatePresence initial={false} custom={direcao} mode="popLayout">
          <motion.div
            key={f}
            layoutId={f === inicial ? idFoto(o, f) : undefined}
            custom={direcao}
            initial={f === inicial ? false : { opacity: 0, x: reduzir ? 0 : direcao * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduzir ? 0 : direcao * -60, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: drive }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) passar(1);
              else if (info.offset.x > 70) passar(-1);
            }}
            className="relative max-h-full cursor-grab active:cursor-grabbing"
            style={{ aspectRatio: proporcao, width: `min(100%, calc((100svh - 13rem) * ${proporcao}))` }}
          >
            <Image src={foto.src} alt={`${obra.nome}: ${foto.legenda}`} fill sizes="92vw" className="pointer-events-none object-cover" draggable={false} />
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => passar(-1)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-rule-strong bg-graphite/60 text-ink transition-colors hover:border-ink sm:flex"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => passar(1)}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-rule-strong bg-graphite/60 text-ink transition-colors hover:border-ink sm:flex"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      <div className="px-5 pb-5 pt-4 sm:px-8" aria-live="polite">
        <p className="flex items-center gap-2.5 font-display text-[15px] font-medium text-ink">
          <span aria-hidden className="h-[2px] w-5 bg-brand" />
          {foto.legenda}
        </p>
        <p className="mt-1 text-[13px] text-ink-3">Foto real da obra{total > 1 ? " · use as setas ou arraste para o lado" : ""}</p>
      </div>
    </motion.div>
  );
}
