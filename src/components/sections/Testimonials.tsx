"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";

const testimonials = [
  {
    name: "Roberto Mendes",
    role: "Diretor de Engenharia",
    company: "Construtora Atlântico",
    text: "A Geoforte entregou a fundação do nosso empreendimento com qualidade impecável e dentro do prazo. A equipe técnica demonstrou total domínio das soluções aplicadas.",
  },
  {
    name: "Patrícia Santos",
    role: "Gerente de Projetos",
    company: "MRV Engenharia",
    text: "Trabalhamos com a Geoforte em múltiplos projetos na Bahia. A solução integrada deles simplifica toda a gestão da etapa de fundação, do projeto à execução final.",
  },
  {
    name: "Carlos Oliveira",
    role: "Engenheiro Civil",
    company: "OAS Construtora",
    text: "O monitoramento em tempo real das estacas hélice contínua e os relatórios diários de produtividade nos dão total controle e transparência sobre a execução.",
  },
  {
    name: "Juliana Prado",
    role: "Coordenadora de Obras",
    company: "Grupo Conquista",
    text: "Cronograma cumprido sem uma única parada por insumo. A logística completa da Geoforte tirou da nossa mesa o risco mais caro da obra.",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export default function Testimonials() {
  // containScroll não deve ser usado junto de loop: true (conflita com o
  // reordenamento interno do Embla e trava o efeito de loop infinito).
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!embla) return;
    const sync = () => setSelected(embla.selectedScrollSnap());
    setSnaps(embla.scrollSnapList());
    sync();
    embla.on("select", sync).on("reInit", () => {
      setSnaps(embla.scrollSnapList());
      sync();
    });
  }, [embla]);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  return (
    <section className="py-24 sm:py-28 bg-canvas-sunk">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="O que nossos parceiros dizem"
          lead="Mais de 250 clientes corporativos recorrentes confiam na pontualidade e no rigor geotécnico da Geoforte."
        />

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="min-w-0 shrink-0 grow-0 basis-full sm:basis-[calc(50%-10px)] lg:basis-[calc(33.333%-14px)]"
                >
                  <div className="h-full flex flex-col bg-card border border-rule p-7">
                    <div className="flex items-start justify-between">
                      <Quote size={26} strokeWidth={1.5} aria-hidden className="text-brand" />
                      <div className="flex gap-1" role="img" aria-label="Avaliação 5 de 5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            size={13}
                            aria-hidden
                            className="fill-brand-ink text-brand-ink"
                          />
                        ))}
                      </div>
                    </div>

                    <blockquote className="mt-6 flex-1 text-ink text-[15.5px] leading-relaxed">
                      {t.text}
                    </blockquote>

                    <figcaption className="mt-7 pt-5 border-t border-rule flex items-center gap-3.5">
                      <span
                        aria-hidden
                        className="shrink-0 w-11 h-11 bg-ink text-canvas font-display font-bold text-[13px] flex items-center justify-center tracking-wide"
                      >
                        {initials(t.name)}
                      </span>
                      <span className="min-w-0">
                        <cite className="not-italic font-display font-bold text-[15px] text-ink block">
                          {t.name}
                        </cite>
                        <span className="mt-0.5 block text-ink-3 text-[12.5px] leading-snug">
                          {t.role} · {t.company}
                        </span>
                      </span>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          <button
            onClick={() => embla?.scrollPrev()}
            aria-label="Depoimento anterior"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 -translate-x-full z-10 w-12 h-12 items-center justify-center bg-card border border-rule-strong text-ink hover:bg-brand hover:border-brand hover:text-graphite shadow-sm transition-colors"
          >
            <ArrowLeft size={19} aria-hidden />
          </button>
          <button
            onClick={() => embla?.scrollNext()}
            aria-label="Próximo depoimento"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 translate-x-full z-10 w-12 h-12 items-center justify-center bg-card border border-rule-strong text-ink hover:bg-brand hover:border-brand hover:text-graphite shadow-sm transition-colors"
          >
            <ArrowRight size={19} aria-hidden />
          </button>
        </div>

        {snaps.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Ir para o depoimento ${i + 1}`}
                aria-current={i === selected}
                className={`h-[3px] transition-all duration-300 ${
                  i === selected ? "w-9 bg-brand" : "w-4 bg-rule-strong hover:bg-ink-3"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
