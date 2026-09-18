"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FileSearch, Truck, ShieldCheck, type LucideIcon } from "lucide-react";
import { solutionSteps } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";

const icons: LucideIcon[] = [FileSearch, Truck, ShieldCheck];

export default function IntegratedSolution() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 70%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const lineLeft = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="solucao" className="on-graphite bg-graphite py-24 sm:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="Solução Integrada Geoforte"
          lead="Uma abordagem completa que cobre da análise técnica à entrega final, garantindo eficiência, qualidade e economia em cada etapa da obra."
        />

        <div ref={track} className="relative mt-20">
          {/* Espinha horizontal: fio inerte + trecho laranja que cresce com a rolagem (só desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[16.667%] right-[16.667%] top-8 h-[2px] bg-rule"
          >
            <motion.div
              style={{ scaleX: progress }}
              className="absolute inset-0 origin-left bg-brand"
            />
            <motion.span
              style={{ left: lineLeft }}
              className="absolute top-1/2 -translate-y-1/2 -ml-[7px] w-3.5 h-3.5 bg-brand ring-4 ring-graphite"
            />
          </div>

          <ol className="grid md:grid-cols-3 gap-y-14 gap-x-10">
            {solutionSteps.map((step, i) => {
              const Icon = icons[i] ?? ShieldCheck;
              return (
                <motion.li
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Nó sobre a espinha */}
                  <span className="relative z-10 w-16 h-16 flex items-center justify-center bg-graphite border-2 border-brand text-brand shrink-0">
                    <Icon size={26} strokeWidth={1.6} aria-hidden />
                  </span>

                  <span className="mt-6 font-display font-bold text-sm text-brand tabular-nums tracking-[0.08em]">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display font-bold text-xl leading-snug text-ink text-balance">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-ink text-[15px] leading-relaxed">
                    {step.description}
                  </p>
                  <p className="mt-3 text-ink-2 text-[15px] leading-relaxed">
                    {step.details}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
