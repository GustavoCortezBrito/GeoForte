"use client";

import { useEffect, useState } from "react";

export interface ItemIndice {
  id: string;
  n: string;
  titulo: string;
}

/**
 * Índice fixo dos capítulos (desktop), com o capítulo em leitura marcado.
 * No celular vira uma linha rolável no começo dos capítulos.
 */
export default function IndiceCapitulos({ itens }: { itens: ItemIndice[] }) {
  const [ativo, setAtivo] = useState(itens[0]?.id);

  useEffect(() => {
    // O observador só avisa o que mudou; o estado de todos fica guardado aqui.
    // Na fronteira entre dois capítulos vale o de baixo (o que está começando).
    const dentro = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => dentro.set(e.target.id, e.isIntersecting));
        const atual = [...itens].reverse().find((i) => dentro.get(i.id));
        if (atual) setAtivo(atual.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    itens.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [itens]);

  return (
    <nav aria-label="Capítulos da proposta" className="lg:sticky lg:top-24">
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:block lg:overflow-visible lg:pb-0">
        {itens.map((i) => {
          const atual = i.id === ativo;
          return (
            <li key={i.id} className="shrink-0">
              <a
                href={`#${i.id}`}
                aria-current={atual ? "location" : undefined}
                className={`group flex items-baseline gap-3 border px-3 py-2 font-display text-[14px] transition-colors lg:border-0 lg:border-l-2 lg:px-0 lg:py-2 lg:pl-4 ${
                  atual
                    ? "border-ink text-ink lg:border-brand"
                    : "border-rule-strong text-ink-3 hover:text-ink lg:border-rule"
                }`}
              >
                <span className={`w-7 shrink-0 font-bold tabular-nums ${atual ? "text-brand-ink" : ""}`}>{i.n}</span>
                <span className={atual ? "font-semibold" : "font-medium"}>{i.titulo}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
