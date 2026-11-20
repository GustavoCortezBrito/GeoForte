"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { MapPin } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";

// Só entram as obras que já têm foto (ver `image` em lib/data.ts).
const withPhoto = projects.filter((p) => p.image);

export default function Projects() {
  return (
    <section id="projetos" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="Projetos de referência"
          lead="Alguns dos mais de 1.500 projetos executados em obras comerciais, industriais e residenciais em todo o Brasil."
        />

        {/* Primeiro projeto em destaque na largura toda, os demais lado a lado;
            se sobrar um sozinho na última fileira, ele também ocupa a largura toda. */}
        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {withPhoto.map((p, i) => {
            const wide = i === 0 || (i === withPhoto.length - 1 && i % 2 === 1);
            return (
              <motion.figure
                key={p.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: (i % 2) * 0.1,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group flex flex-col ${wide ? "md:col-span-2" : ""}`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-canvas-sunk border border-rule transition-colors group-hover:border-rule-strong ${
                    wide ? "aspect-4/3 md:aspect-21/9" : "aspect-4/3"
                  }`}
                >
                  <Image
                    src={p.image!}
                    alt={p.alt ?? ""}
                    fill
                    sizes={
                      wide
                        ? "(min-width: 1200px) 1152px, 100vw"
                        : "(min-width: 768px) 50vw, 100vw"
                    }
                    className="object-cover"
                    style={{ objectPosition: p.focus }}
                  />
                </div>
                <figcaption className="mt-5 pt-4 border-t-2 border-ink flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
                  <p
                    className={`font-display font-bold leading-snug text-ink ${
                      wide ? "text-2xl" : "text-lg"
                    }`}
                  >
                    {p.title}
                  </p>
                  <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-ink-2 text-sm">
                    {p.location && (
                      <>
                        <MapPin size={14} strokeWidth={1.75} aria-hidden className="shrink-0" />
                        <span className="whitespace-nowrap">{p.location}</span>
                        <span aria-hidden className="text-ink-3">
                          ·
                        </span>
                      </>
                    )}
                    <span className="text-brand-ink font-medium">{p.type}</span>
                  </p>
                </figcaption>
                {p.credit && (
                  <p className="mt-2 text-[12px] leading-snug text-ink-3">
                    Foto:{" "}
                    <a
                      href={p.credit.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-ink-2"
                    >
                      {p.credit.text}
                    </a>
                  </p>
                )}
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
