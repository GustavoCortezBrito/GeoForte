"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Download } from "lucide-react";
import GeoforteLogo from "@/components/ui/GeoforteLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface Props {
  codigo: string;
  validade: string;
  pdf: string;
  aceite: string;
}

/** Barra da proposta: marca, código e as duas ações, com o progresso da leitura no fio de baixo. */
export default function BarraProposta({ codigo, validade, pdf, aceite }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 });

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-canvas/95 backdrop-blur-md border-b border-rule">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-5 lg:px-8">
        <a href="#capa" aria-label="Geoforte Fundações — voltar ao início da proposta" className="shrink-0 py-2">
          <GeoforteLogo variant="lockup" size={32} />
        </a>
        <span className="hidden h-6 w-px bg-rule-strong sm:block" aria-hidden />
        <p className="hidden min-w-0 truncate font-display text-[14px] font-medium text-ink-2 sm:block">
          <span className="font-bold text-ink">Proposta {codigo}</span>
          <span className="hidden md:inline"> · válida por {validade}</span>
        </p>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <a
            href={pdf}
            download
            rel="nofollow"
            className="inline-flex items-center gap-2 px-3 py-2 font-display text-[14px] font-semibold text-ink hover:text-brand-ink transition-colors"
          >
            <Download size={16} aria-hidden />
            <span className="hidden sm:inline">Baixar PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
          <a
            href={aceite}
            className="inline-flex items-center px-4 py-2.5 font-display text-[14px] font-bold bg-brand text-graphite hover:bg-brand-deep transition-colors"
          >
            Aceitar proposta
          </a>
          <span className="hidden h-5 w-px bg-rule-strong md:block" aria-hidden />
          <ThemeToggle className="hidden md:inline-flex" />
        </div>
      </div>
      <motion.div aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-brand" style={{ scaleX }} />
    </header>
  );
}
