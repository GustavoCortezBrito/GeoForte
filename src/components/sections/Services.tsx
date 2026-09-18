"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";

export default function Services() {
  return (
    <section id="servicos" className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="Serviços & tecnologias"
          lead="Oito soluções em fundações profundas, executadas com 26 equipamentos próprios de última geração em todo o território nacional."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: (i % 4) * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative bg-canvas p-7 flex flex-col overflow-hidden"
              >
                {/* Malha técnica revelada no hover, como no hero */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    backgroundImage:
                      "linear-gradient(color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                    maskImage: "radial-gradient(120% 100% at 0% 0%, #000 0%, transparent 70%)",
                  }}
                />

                {/* Barra de acento que cresce da esquerda */}
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

                <div className="relative flex items-start justify-between">
                  <span className="w-12 h-12 flex items-center justify-center bg-ink text-canvas group-hover:bg-brand group-hover:text-graphite transition-colors duration-300">
                    <Icon size={22} strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="font-display font-bold text-3xl text-rule-strong group-hover:text-brand-ink tabular-nums leading-none transition-colors duration-300 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-6 font-display font-bold text-[16px] leading-snug text-ink">
                  {s.title}
                </h3>
                <p className="relative mt-3 text-ink-2 text-[14px] leading-relaxed">
                  {s.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
