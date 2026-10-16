"use client";

import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import Placeholder from "@/components/ui/Placeholder";

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

export default function Testimonials() {
  // containScroll não deve ser usado junto de loop: true (conflita com o
  // reordenamento interno do Embla e trava o efeito de loop infinito).
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", duration: 28 },
    [Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })],
  );
  // O Embla é um sistema externo: assina os eventos dele em vez de copiar o
  // estado para dentro de um efeito.
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!embla) return () => {};
      embla.on("select", notify).on("reInit", notify);
      return () => {
        embla.off("select", notify).off("reInit", notify);
      };
    },
    [embla],
  );
  const selected = useSyncExternalStore(
    subscribe,
    () => embla?.selectedScrollSnap() ?? 0,
    () => 0,
  );
  const snapCount = useSyncExternalStore(
    subscribe,
    () => embla?.scrollSnapList().length ?? 0,
    () => 0,
  );

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  return (
    <section className="py-24 sm:py-32 bg-canvas-sunk">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="O que nossos parceiros dizem"
          lead="Mais de 250 clientes corporativos recorrentes confiam na pontualidade e no rigor geotécnico da Geoforte."
        />

        {/* Um depoimento por vez, em tipografia grande: a citação é o conteúdo,
            o autor é a assinatura. */}
        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t) => (
              <figure key={t.name} className="min-w-0 shrink-0 grow-0 basis-full">
                <div className="grid lg:grid-cols-[19rem_minmax(0,1fr)] gap-x-14 gap-y-8 items-stretch">
                  <Placeholder
                    label="Foto do cliente"
                    className="w-full aspect-[4/3] lg:aspect-auto lg:min-h-[22rem] border border-rule"
                  />

                  <div className="flex flex-col justify-between gap-10">
                    <blockquote className="font-display font-medium text-[clamp(1.4rem,2.7vw,2.15rem)] leading-[1.28] tracking-[-0.015em] text-ink text-balance">
                      <span aria-hidden className="text-brand">
                        “
                      </span>
                      {t.text}
                      <span aria-hidden className="text-brand">
                        ”
                      </span>
                    </blockquote>

                    <figcaption className="border-t-2 border-ink pt-5">
                      <span className="min-w-0">
                        <cite className="not-italic font-display font-bold text-base text-ink block">
                          {t.name}
                        </cite>
                        <span className="mt-0.5 block text-ink-2 text-[13px] leading-snug">
                          {t.role}
                          <br />
                          {t.company}
                        </span>
                      </span>
                    </figcaption>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            {snapCount > 1 &&
              Array.from({ length: snapCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para o depoimento ${i + 1}`}
                  aria-current={i === selected}
                  className="group py-3"
                >
                  <span
                    className={`block h-[3px] transition-all duration-300 ${
                      i === selected
                        ? "w-9 bg-brand"
                        : "w-5 bg-rule-strong group-hover:bg-ink-3"
                    }`}
                  />
                </button>
              ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => embla?.scrollPrev()}
              aria-label="Depoimento anterior"
              className="w-12 h-12 flex items-center justify-center bg-card border border-rule-strong text-ink hover:bg-brand hover:border-brand hover:text-graphite transition-colors"
            >
              <ArrowLeft size={19} aria-hidden />
            </button>
            <button
              onClick={() => embla?.scrollNext()}
              aria-label="Próximo depoimento"
              className="w-12 h-12 flex items-center justify-center bg-card border border-rule-strong text-ink hover:bg-brand hover:border-brand hover:text-graphite transition-colors"
            >
              <ArrowRight size={19} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
