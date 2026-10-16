"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { MapPin } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Placeholder from "@/components/ui/Placeholder";

export default function Projects() {
  return (
    <section id="projetos" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="Projetos de referência"
          lead="Alguns dos mais de 1.500 projetos executados em obras comerciais, industriais e residenciais em todo o Brasil."
        />

        {/* Primeiro projeto em destaque na largura toda, os demais lado a lado */}
        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.figure
              key={p.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`group flex flex-col ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <Placeholder
                label="Foto da obra"
                className={`w-full border border-rule transition-colors group-hover:border-rule-strong ${
                  i === 0 ? "aspect-4/3 md:aspect-21/9" : "aspect-16/10"
                }`}
              />
              <figcaption className="mt-5 pt-4 border-t-2 border-ink flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
                <p
                  className={`font-display font-bold leading-snug text-ink ${
                    i === 0 ? "text-2xl" : "text-lg"
                  }`}
                >
                  {p.title}
                </p>
                <p className="flex items-center gap-1.5 text-ink-2 text-sm">
                  <MapPin size={14} strokeWidth={1.75} aria-hidden className="shrink-0" />
                  {p.location}
                  <span aria-hidden className="text-ink-3">
                    ·
                  </span>
                  <span className="text-brand-ink font-medium">{p.type}</span>
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
