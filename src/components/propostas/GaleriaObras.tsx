"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, MapPin, X } from "lucide-react";

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
const crava = [0.65, 0, 0.35, 1] as const;
// `v` separa as versões da mesma foto (tira do celular × tira do desktop): dois elementos com o
// mesmo layoutId fazem o framer-motion esconder um deles.
const idFoto = (o: number, f: number, v = "") => `obra-${o}-foto-${f}${v}`;
const semAssinatura = () => () => {};

/**
 * Moldura que revela a foto de cima para baixo (o gesto da estaca cravada).
 * O lado de fora percebe a entrada na tela e passa a revelação para dentro (um
 * alvo todo recortado nunca "aparece" para o IntersectionObserver). No servidor e
 * sem JS a foto já vem visível; o recorte só existe depois da hidratação.
 */
function Revela({
  cliente,
  reduzir,
  atraso = 0,
  className,
  children,
}: {
  cliente: boolean;
  reduzir: boolean | null;
  atraso?: number;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={cliente ? "js" : "ssr"}
      className={`relative ${className}`}
      initial={cliente ? "oculto" : false}
      whileInView="visivel"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-canvas-sunk"
        variants={{ oculto: { clipPath: "inset(0% 0% 100% 0%)" }, visivel: { clipPath: "inset(0% 0% 0% 0%)" } }}
        transition={{ duration: reduzir ? 0 : 0.8, delay: reduzir ? 0 : atraso, ease: crava }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Foto clicável: a imagem leva o layoutId que o visor usa para crescer a partir dela. */
function FotoBotao({
  ft,
  o,
  f,
  abrir,
  sizes,
  rotulo,
  children,
  v = "",
}: {
  ft: Foto;
  o: number;
  f: number;
  v?: string;
  abrir: (e: React.MouseEvent<HTMLElement>) => void;
  sizes: string;
  rotulo: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={abrir} aria-label={rotulo} className="group/foto absolute inset-0 block text-left">
      <motion.div layoutId={idFoto(o, f, v)} className="absolute inset-0">
        <Image
          src={ft.src}
          alt=""
          fill
          placeholder="blur"
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-drive group-hover/foto:scale-[1.03]"
          style={ft.foco ? { objectPosition: ft.foco } : undefined}
        />
      </motion.div>
      {children}
    </button>
  );
}

/** Miniaturas da obra em destaque; a última vira "+N" quando há mais fotos do que lugares. */
function Tira({
  obra,
  o,
  lugares,
  abrir,
  cliente,
  reduzir,
  className,
  v,
}: {
  obra: Obra;
  o: number;
  lugares: number;
  v: string;
  abrir: (o: number, f: number, v?: string) => (e: React.MouseEvent<HTMLElement>) => void;
  cliente: boolean;
  reduzir: boolean | null;
  className: string;
}) {
  const extras = obra.fotos.slice(1);
  const mostradas = extras.slice(0, lugares);
  const resto = extras.length - mostradas.length;
  return (
    <ul className={`mt-2 gap-2 ${className}`} aria-label={`Mais fotos de ${obra.nome}`}>
      {mostradas.map((ft, i) => {
        const mais = i === mostradas.length - 1 && resto > 0;
        return (
          <li key={ft.legenda + i}>
            <Revela cliente={cliente} reduzir={reduzir} atraso={0.25 + i * 0.06} className="aspect-[4/3]">
              <FotoBotao
                ft={ft}
                o={o}
                f={i + 1}
                v={v}
                abrir={abrir(o, i + 1, v)}
                sizes="10rem"
                rotulo={mais ? `Ver todas as ${obra.fotos.length} fotos de ${obra.nome}` : `Ampliar: ${ft.legenda}`}
              >
                {mais && (
                  <span className="absolute inset-0 flex items-center justify-center bg-graphite/70 font-display text-[17px] font-bold text-paper transition-colors group-hover/foto:bg-graphite/55">
                    +{resto + 1}
                  </span>
                )}
              </FotoBotao>
            </Revela>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Obras executadas na gramática dos projetos do site: a primeira em destaque na
 * largura toda (com a tira das outras fotos), as demais lado a lado; legenda
 * embaixo, aberta pelo fio de 2px em tinta. Qualquer foto abre o visor.
 */
export default function GaleriaObras({ obras }: { obras: Obra[] }) {
  const [aberta, setAberta] = useState<{ o: number; f: number; inicial: number; v: string } | null>(null);
  const gatilho = useRef<HTMLElement | null>(null);
  const reduzir = useReducedMotion();
  const cliente = useSyncExternalStore(semAssinatura, () => true, () => false);

  const abrir = (o: number, f: number, v = "") => (e: React.MouseEvent<HTMLElement>) => {
    gatilho.current = e.currentTarget;
    setAberta({ o, f, inicial: f, v });
  };
  const fechar = useCallback(() => {
    setAberta(null);
    gatilho.current?.focus();
  }, []);

  return (
    <>
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
        {obras.map((o, oi) => {
          const destaque = oi === 0;
          const principal = o.fotos[0];
          return (
            <figure key={o.numero} className={`group flex flex-col ${destaque ? "md:col-span-3" : ""}`}>
              <Revela
                cliente={cliente}
                reduzir={reduzir}
                atraso={destaque ? 0 : oi * 0.08}
                className={`border border-rule transition-colors group-hover:border-rule-strong ${destaque ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]"}`}
              >
                <FotoBotao
                  ft={principal}
                  o={oi}
                  f={0}
                  abrir={abrir(oi, 0)}
                  sizes={destaque ? "(min-width: 1024px) 58rem, 100vw" : "(min-width: 768px) 19rem, 100vw"}
                  rotulo={`Ver as ${o.fotos.length} fotos de ${o.nome}`}
                >
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-graphite/70 px-2 py-1 font-display text-[12px] font-medium text-paper/85">
                    <Images size={13} strokeWidth={1.75} aria-hidden />
                    {o.fotos.length} fotos
                  </span>
                </FotoBotao>
              </Revela>

              {destaque && (
                <>
                  <Tira obra={o} o={oi} lugares={3} v="-m" abrir={abrir} cliente={cliente} reduzir={reduzir} className="grid grid-cols-3 md:hidden" />
                  <Tira obra={o} o={oi} lugares={6} v="-d" abrir={abrir} cliente={cliente} reduzir={reduzir} className="hidden md:grid md:grid-cols-6" />
                </>
              )}

              <figcaption className="mt-5 border-t-2 border-ink pt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
                  <p className={`font-display font-bold leading-snug text-ink ${destaque ? "text-2xl" : "text-lg"}`}>
                    <span className="mr-2 tabular-nums text-brand-ink">{o.numero}</span>
                    {o.nome}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-ink-2">
                    <MapPin size={14} strokeWidth={1.75} aria-hidden className="shrink-0" />
                    {o.local}
                    {o.ano ? ` · ${o.ano}` : ""}
                    <span aria-hidden className="text-ink-3">
                      ·
                    </span>
                    <span className="font-medium text-brand-ink">{o.construtora}</span>
                  </p>
                </div>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
                  {o.solucao}
                  {o.complemento ? ` com ${o.complemento.toLowerCase()}` : ""}. <span className="text-ink-3">{principal.legenda}.</span>
                </p>
                {o.ficha.length > 0 && (
                  <dl className="mt-3 text-[14px]">
                    {o.ficha.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-t border-rule py-2">
                        <dt className="text-ink-2">{k}</dt>
                        <dd className="font-display font-semibold text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {o.destaque && <p className="mt-3 text-[15px] leading-relaxed text-ink">{o.destaque}</p>}
              </figcaption>
            </figure>
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
            v={aberta.v}
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
  v,
  ir,
  fechar,
}: {
  obra: Obra;
  o: number;
  f: number;
  inicial: number;
  v: string;
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

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-5 sm:px-20"
        onClick={(e) => e.target === e.currentTarget && fechar()}
      >
        <AnimatePresence initial={false} custom={direcao} mode="popLayout">
          <motion.div
            key={f}
            layoutId={f === inicial ? idFoto(o, f, v) : undefined}
            custom={direcao}
            initial={
              f === inicial
                ? false
                : { opacity: 0, x: reduzir ? 0 : direcao * 60 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: reduzir ? 0 : direcao * -60,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.45, ease: drive }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) passar(1);
              else if (info.offset.x > 70) passar(-1);
            }}
            className="relative max-h-full cursor-grab active:cursor-grabbing"
            style={{
              aspectRatio: proporcao,
              width: `min(100%, calc((100svh - 13rem) * ${proporcao}))`,
            }}
          >
            <Image
              src={foto.src}
              alt={`${obra.nome}: ${foto.legenda}`}
              fill
              sizes="92vw"
              className="pointer-events-none object-cover"
              draggable={false}
            />
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
        <p className="mt-1 text-[13px] text-ink-3">
          Foto real da obra
          {total > 1 ? " · use as setas ou arraste para o lado" : ""}
        </p>
      </div>
    </motion.div>
  );
}
