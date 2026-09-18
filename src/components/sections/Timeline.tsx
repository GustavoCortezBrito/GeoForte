"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { Building2, Drill, Award, TrendingUp, ShieldCheck, type LucideIcon } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";

const milestones = [
  {
    year: "1995",
    title: "Fundação da Geoforte",
    subtitle: "Início das operações em Salvador, BA",
    description:
      "A Geoforte nasce com a missão de elevar os padrões da engenharia geotécnica, focada no rigor técnico de projetos e fundações sólidas.",
    icon: Building2,
    badge: "Origem",
  },
  {
    year: "2003",
    title: "Pioneirismo em hélice contínua",
    subtitle: "Inovação tecnológica e telemetria",
    description:
      "Aquisição das primeiras perfuratrizes para execução de estacas hélice contínua com monitoramento eletrônico em tempo real, garantindo máxima produtividade e controle de vibrações.",
    icon: Drill,
    badge: "Tecnologia",
  },
  {
    year: "2012",
    title: "Marco de 500 obras & infraestrutura",
    subtitle: "Expansão para grandes empreendimentos",
    description:
      "Consolidação no atendimento a grandes shopping centers, galpões industriais e condomínios empresariais de alta complexidade em múltiplos estados.",
    icon: TrendingUp,
    badge: "Expansão",
  },
  {
    year: "2018",
    title: "Frota própria e autonomia operacional",
    subtitle: "26 equipamentos pesados",
    description:
      "Ampliação estratégica do parque de máquinas próprias de última geração, assegurando pontualidade logística sem dependência de terceiros.",
    icon: Award,
    badge: "Estrutura",
  },
  {
    year: "Hoje",
    title: "Mais de 1.500 obras em todo o Brasil",
    subtitle: "+3,3 milhões de metros de estacas",
    description:
      "Referência nacional pela entrega da Solução Integrada Geoforte, da análise técnica do solo à execução final, com mais de 250 clientes recorrentes.",
    icon: ShieldCheck,
    badge: "Liderança",
  },
];

function Milestone({
  year,
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  index,
}: (typeof milestones)[number] & { index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reached = useInView(ref, { once: true, margin: "-45% 0px -45% 0px" });

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[2px_1fr] sm:grid-cols-[104px_2px_1fr] gap-x-5 sm:gap-x-7 pb-14 last:pb-0"
    >
      {/* Ano — coluna própria a partir de sm */}
      <span
        className={`hidden sm:block pt-1 text-right font-display font-bold text-2xl tabular-nums transition-colors duration-500 ${
          reached ? "text-brand-ink" : "text-ink-3"
        }`}
      >
        {year}
      </span>

      {/* Marcador na espinha */}
      <div className="relative">
        <motion.span
          aria-hidden
          initial={{ scale: 0 }}
          animate={reached ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -left-[7px] top-1.5 w-4 h-4 bg-brand ring-4 ring-canvas"
        />
      </div>

      <div className="min-w-0">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
          className="group bg-card border border-rule p-6 sm:p-7 transition-[border-color,box-shadow] hover:border-rule-strong hover:shadow-[0_8px_28px_-12px_rgba(34,37,42,0.22)]"
        >
          <div className="flex items-center gap-3.5">
            <span
              className={`shrink-0 w-10 h-10 flex items-center justify-center transition-colors duration-500 ${
                reached ? "bg-brand text-graphite" : "bg-canvas-sunk text-ink-3"
              }`}
            >
              <Icon size={19} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <span className="font-display font-bold text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
                {badge}
              </span>
              <span className="sm:hidden ml-2 font-display font-bold text-[13px] text-brand-ink tabular-nums">
                {year}
              </span>
            </div>
          </div>

          <h3 className="mt-5 font-display font-bold text-xl leading-snug text-ink text-balance">
            {title}
          </h3>
          <p className="mt-1.5 font-display font-medium text-sm text-brand-ink">
            {subtitle}
          </p>
          <p className="mt-3.5 text-ink-2 text-[14.5px] leading-relaxed">{description}</p>
        </motion.article>
      </div>
    </li>
  );
}

export default function Timeline() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const tipTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="historia" className="py-24 sm:py-28">
      <div className="max-w-5xl mx-auto px-5">
        <SectionHead
          title="Nossa trajetória"
          lead="Os principais marcos da Geoforte, da fundação em 1995 à liderança em grandes obras de fundações profundas no Brasil."
        />

        <div ref={track} className="relative mt-16">
          {/* Espinha: fio inerte + estaca laranja que desce com a rolagem */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-0 sm:left-[132px] w-[2px] bg-rule"
          >
            <motion.div
              style={{ scaleY: progress }}
              className="absolute inset-0 origin-top bg-brand"
            />
            {/* Ponta da estaca, no fim do trecho já cravado */}
            <motion.span
              style={{ top: tipTop }}
              className="absolute -left-[4px] w-0 h-0 border-l-[5px] border-r-[5px] border-l-transparent border-r-transparent border-t-[14px] border-t-ink"
            />
          </div>

          <ol>
            {milestones.map((m, i) => (
              <Milestone key={m.year} {...m} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
