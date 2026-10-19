"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SoilSection from "@/components/ui/SoilSection";

const drive = [0.16, 1, 0.3, 1] as const;

// A abertura (LoadingScreen) cobre os primeiros ~1,6 s; o hero começa a
// entrar já por baixo dela para que, quando a íris abre, ele esteja pronto.
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.1, ease: drive },
  }),
};

const heroStats = [
  { value: 1995, decimals: 0, plain: true, label: "Fundação" },
  { value: 1500, decimals: 0, prefix: "+", label: "Obras executadas" },
  { value: 3.3, decimals: 1, prefix: "+", suffix: " mi", label: "Metros de estacas" },
  { value: 26, decimals: 0, label: "Equipamentos" },
];

const statsParent = {
  hidden: {},
  show: { transition: { delayChildren: 0.55, staggerChildren: 0.12 } },
};
const statItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: drive } },
};

/** Conta de 0 até `value` assim que entra na tela — o único número que se
 * move no hero, para não competir com o vídeo quando ele existir.
 * `plain` desliga o separador de milhar (anos não levam ponto: 1995). */
function AnimatedStat({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  plain = false,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  plain?: boolean;
}) {
  const [n, setN] = useState(0);
  const started = useRef(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (started.current) return;
        started.current = true;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setN(value);
          return;
        }
        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setN(eased * value);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
    >
      {prefix}
      {decimals > 0
        ? n.toFixed(decimals).replace(".", ",")
        : Math.round(n).toLocaleString("pt-BR", { useGrouping: !plain })}
      {suffix}
    </motion.span>
  );
}

export default function Hero() {
  const [videoOk, setVideoOk] = useState(true);

  return (
    <section
      id="inicio"
      className="on-graphite relative min-h-[100dvh] flex flex-col bg-graphite overflow-hidden"
    >
      {/* Vídeo de fundo — obra em execução. Cai para a malha técnica se
          ausente: o erro de carga dispara nos <source>, não no <video>. */}
      {videoOk && (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/videos/hero.mp4"
            type="video/mp4"
            onError={() => setVideoOk(false)}
          />
        </video>
      )}

      {/* Malha técnica — fundo permanente atrás do vídeo/overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,250,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,248,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(110% 90% at 70% 45%, #000 20%, transparent 78%)",
        }}
      />
      {/* Calor atrás do corte: um halo fixo, sem blur nem animação */}
      <div
        aria-hidden
        className="absolute -right-40 top-1/4 w-[46rem] h-[46rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(239,108,26,0.16) 0%, transparent 62%)",
        }}
      />
      {videoOk && (
        <div className="absolute inset-0 bg-gradient-to-b from-graphite/80 via-graphite/68 to-graphite/88" />
      )}

      <div className="relative z-10 flex-1 flex items-center w-full max-w-6xl mx-auto px-5 pt-32 pb-12 lg:pt-28">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div>
            <motion.h1
              variants={rise}
              custom={0}
              initial="hidden"
              animate="show"
              className="font-display font-bold text-[clamp(2.6rem,6vw,4.9rem)] leading-[1.02] tracking-[-0.035em] text-balance"
            >
              Qualidade do projeto <span className="text-brand">à execução.</span>
            </motion.h1>

            <motion.p
              variants={rise}
              custom={1}
              initial="hidden"
              animate="show"
              className="mt-7 text-ink-2 text-lg leading-relaxed max-w-[44ch]"
            >
              Solução ponta a ponta em fundações profundas. Mais de 1.500 obras
              executadas e 30 anos de excelência técnica em todo o Brasil.
            </motion.p>

            <motion.div
              variants={rise}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="#contato"
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-brand hover:bg-brand-deep text-graphite text-[15px] font-display font-bold transition-colors"
              >
                Solicitar diagnóstico técnico
                <ArrowRight
                  size={17}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center px-7 py-4 text-ink text-[15px] font-display font-medium border border-white/25 hover:border-white/60 hover:bg-white/5 transition-colors"
              >
                Ver soluções técnicas
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="w-full max-w-[34rem] mx-auto lg:max-w-none"
          >
            <SoilSection className="w-full h-auto" />
          </motion.div>
        </div>
      </div>

      <motion.dl
        variants={statsParent}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-6xl mx-auto px-5 pb-10"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-rule-strong">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={statItem}
              className={`pt-6 pb-2 ${
                i > 0 ? "sm:pl-7 sm:border-l sm:border-rule" : ""
              } ${i % 2 === 1 ? "pl-5 border-l border-rule sm:pl-7" : ""}`}
            >
              <dt className="font-display font-bold text-[clamp(1.6rem,3vw,2.25rem)] leading-none text-ink tabular-nums tracking-[-0.02em]">
                <AnimatedStat
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  plain={s.plain}
                />
              </dt>
              <dd className="mt-2.5 text-[12px] text-ink-3 font-display font-medium leading-snug">
                {s.label}
              </dd>
            </motion.div>
          ))}
        </div>
      </motion.dl>
    </section>
  );
}
