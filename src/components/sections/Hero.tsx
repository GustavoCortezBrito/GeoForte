"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const drive = [0.16, 1, 0.3, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.1, ease: drive },
  }),
};

const heroStats = [
  { value: 1995, decimals: 0, label: "Fundação" },
  { value: 1500, decimals: 0, prefix: "+", label: "Obras" },
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
 * move no hero, para não competir com o vídeo quando ele existir. */
function AnimatedStat({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
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
        : Math.round(n).toLocaleString("pt-BR")}
      {suffix}
    </motion.span>
  );
}

export default function Hero() {
  const [videoOk, setVideoOk] = useState(true);

  return (
    <section
      id="inicio"
      className="on-graphite relative min-h-[100dvh] flex items-center justify-center bg-graphite overflow-hidden"
    >
      {/* Vídeo de fundo — obra em execução. Cai para a malha técnica se ausente. */}
      {videoOk && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoOk(false)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Malha técnica — fundo permanente atrás do vídeo/overlay, e único fundo se o vídeo faltar */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,250,248,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,248,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(120% 90% at 50% 40%, #000 30%, transparent 75%)",
        }}
      />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.26, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(239,108,26,0.55) 0%, transparent 65%)",
        }}
      />

      {/* Escurece o vídeo o bastante para o texto respirar */}
      <div className="absolute inset-0 bg-gradient-to-b from-graphite/75 via-graphite/55 to-graphite/85" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 text-center">
        <motion.h1
          variants={rise}
          custom={0}
          initial="hidden"
          animate="show"
          className="font-display font-bold text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.04] tracking-[-0.035em] text-balance"
        >
          Qualidade do projeto
          <br />
          <span className="text-brand">à execução.</span>
        </motion.h1>

        <motion.p
          variants={rise}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-7 text-ink-2 text-lg leading-relaxed max-w-[42ch] mx-auto"
        >
          Solução ponta a ponta em fundações profundas. Mais de 1.500 obras
          executadas e 30 anos de excelência técnica em todo o Brasil.
        </motion.p>

        <motion.div
          variants={rise}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
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

        <motion.dl
          variants={statsParent}
          initial="hidden"
          animate="show"
          className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {heroStats.map((s) => (
            <motion.div key={s.label} variants={statItem} className="flex items-baseline gap-2">
              <dt className="font-display font-bold text-lg text-ink tabular-nums">
                <AnimatedStat
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </dt>
              <dd className="text-[11.5px] uppercase tracking-[0.12em] text-ink-3 font-display font-medium">
                {s.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>

      <motion.a
        href="#servicos"
        aria-label="Rolar para o conteúdo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 0.9, duration: 0.6 }, y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-ink-3 hover:text-brand transition-colors"
      >
        <ChevronDown size={22} aria-hidden />
      </motion.a>
    </section>
  );
}
