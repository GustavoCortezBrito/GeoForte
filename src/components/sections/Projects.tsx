"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { MapPin } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Placeholder from "@/components/ui/Placeholder";

export default function Projects() {
  return (
    <section id="projetos" className="py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="Projetos de referência"
          lead="Alguns dos mais de 1.500 projetos executados em obras comerciais, industriais e residenciais em todo o Brasil."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.figure
              key={p.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <Placeholder
                label="Foto da obra"
                className="aspect-4/3 border border-rule transition-colors group-hover:border-rule-strong"
              />
              <figcaption className="mt-5 pt-5 border-t-2 border-ink">
                <span className="block font-display font-bold text-[11px] uppercase tracking-[0.16em] text-brand-ink">
                  {p.type}
                </span>
                <h3 className="mt-2.5 font-display font-bold text-lg leading-snug text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-ink-2 text-sm">
                  <MapPin size={14} strokeWidth={1.75} aria-hidden className="shrink-0" />
                  {p.location}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
