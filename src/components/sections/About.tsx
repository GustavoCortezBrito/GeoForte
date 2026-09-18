"use client";

import { motion } from "framer-motion";
import { companyInfo } from "@/lib/data";
import { Check } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Placeholder from "@/components/ui/Placeholder";

export default function About() {
  return (
    <section id="empresa" className="py-24 sm:py-28 bg-canvas-sunk">
      <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:sticky lg:top-28"
        >
          <Placeholder
            label="Equipe Geoforte em campo"
            className="w-full h-[420px] sm:h-[480px] border border-rule"
          />
          {/* Placa de obra: tinta sólida, numeral laranja — sempre no
              contraste máximo com a página, claro ou escuro. */}
          <div className="absolute -bottom-6 left-0 sm:left-6 bg-ink px-6 py-5 flex items-baseline gap-3.5">
            <span className="font-display font-bold text-4xl text-brand leading-none tabular-nums">
              30
            </span>
            <span className="font-display font-bold text-[11px] uppercase tracking-[0.16em] text-canvas leading-tight">
              Anos
              <br />
              de mercado
            </span>
          </div>
        </motion.div>

        <div className="mt-10 lg:mt-0">
          <SectionHead title="Sobre a Geoforte" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mt-5 text-ink-2 text-[17px] leading-relaxed">
              No mercado desde 1995, a Geoforte é reconhecida por sua excelência
              técnica e confiabilidade operacional. São mais de 1.500 projetos
              executados em todo o Brasil, com mais de 250 clientes recorrentes.
            </p>

            <figure className="mt-10">
              <div className="rule-driven max-w-40" aria-hidden />
              <blockquote className="mt-5 font-display text-[19px] leading-[1.5] text-ink text-balance">
                {companyInfo.mission}
              </blockquote>
              <figcaption className="mt-3 text-[11px] font-display font-bold uppercase tracking-[0.16em] text-ink-3">
                Missão Geoforte
              </figcaption>
            </figure>

            <h3 className="mt-12 font-display font-bold text-[11px] uppercase tracking-[0.16em] text-ink-3">
              Princípios fundamentais
            </h3>
            <ul className="mt-5">
              {companyInfo.principles.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3.5 py-3.5 border-t border-rule text-[15px] leading-relaxed text-ink-2"
                >
                  <Check
                    size={17}
                    strokeWidth={2.25}
                    aria-hidden
                    className="text-brand-ink shrink-0 mt-[3px]"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
