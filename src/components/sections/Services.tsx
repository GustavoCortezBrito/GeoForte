"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { companyInfo, services } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";

/**
 * Índice técnico: oito soluções em linhas separadas por fios, ao lado do
 * título da seção (que fica fixo enquanto a lista rola), no lugar de uma
 * grade de cartões iguais. O título da linha carrega o peso — o ícone só
 * ancora a linha.
 */
export default function Services() {
  return (
    <section id="servicos" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 gap-y-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              title="Serviços & tecnologias"
              lead="Oito soluções em fundações profundas, executadas com 26 equipamentos próprios de última geração em todo o território nacional."
            />

            {/* Painel de decisão: quem não sabe qual técnica escolher tem para onde ir */}
            <div className="on-graphite mt-12 bg-graphite p-7 sm:p-8">
              <p className="font-display font-bold text-xl leading-snug text-ink text-balance">
                Não sabe qual técnica é a ideal para o seu solo?
              </p>
              <p className="mt-3 text-ink-2 text-[15px] leading-relaxed">
                A escolha certa da fundação começa na análise do projeto e do
                subsolo. Nossa engenharia indica a solução.
              </p>
              <a
                href="#contato"
                className="group mt-6 inline-flex items-center gap-2.5 px-6 py-3.5 bg-brand hover:bg-brand-deep text-graphite text-[15px] font-display font-bold transition-colors"
              >
                Solicitar diagnóstico
                <ArrowRight
                  size={17}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href={`tel:+55${companyInfo.phone.replace(/\D/g, "")}`}
                className="mt-5 flex items-center gap-2.5 text-ink text-[15px] font-display font-medium hover:text-brand transition-colors"
              >
                <Phone size={16} strokeWidth={1.75} aria-hidden className="text-brand" />
                {companyInfo.phone}
              </a>
            </div>
          </div>

          <ul className="border-t-2 border-ink">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(i, 3) * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-6 py-6 border-b border-rule transition-colors hover:bg-card"
                >
                  {/* Fio laranja que cresce na base da linha ao passar o mouse */}
                  <span
                    aria-hidden
                    className="absolute left-0 -bottom-px h-[2px] w-full bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />

                  <span className="mt-0.5 w-11 h-11 flex items-center justify-center border border-rule-strong text-ink group-hover:bg-brand group-hover:border-brand group-hover:text-graphite transition-colors duration-300">
                    <Icon size={21} strokeWidth={1.6} aria-hidden />
                  </span>

                  <div className="pr-2">
                    <h3 className="font-display font-bold text-[17px] leading-snug text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-ink-2 text-[15px] leading-relaxed max-w-[62ch]">
                      {s.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
