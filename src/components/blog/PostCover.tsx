import { mark } from "@/lib/brand";

// O símbolo muda de posição e escala conforme o post, para a grade de capas
// ter ritmo. Determinístico: o mesmo slug sempre gera a mesma capa.
const placements = [
  "-right-6 -top-10 h-[130%] opacity-[0.16]",
  "-left-10 -bottom-20 h-[160%] opacity-[0.13]",
  "right-12 -top-8 h-[118%] opacity-[0.16]",
  "left-1/2 -translate-x-1/2 -bottom-24 h-[175%] opacity-[0.12]",
  "-right-16 -bottom-14 h-[150%] opacity-[0.15]",
];

const pick = (seed: string) =>
  placements[[...seed].reduce((n, c) => n + c.charCodeAt(0), 0) % placements.length];

/**
 * Capa dos posts enquanto não há foto: faixa grafite com a malha técnica da
 * marca e o símbolo cravado no canto. A categoria é o único texto.
 */
export default function PostCover({
  category,
  seed = category,
  className = "",
}: {
  category: string;
  /** Qualquer texto estável (use o slug) que escolhe a posição do símbolo. */
  seed?: string;
  className?: string;
}) {
  return (
    <div
      className={`on-graphite relative overflow-hidden bg-graphite ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,250,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,248,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(110% 100% at 100% 0%, #000 10%, transparent 80%)",
        }}
      />
      <svg
        viewBox={mark.viewBox}
        className={`absolute w-auto ${pick(seed)}`}
        fill="#ef6c1a"
      >
        <path d={mark.ring} />
        <rect {...mark.bar} />
        <path d={mark.pile} />
      </svg>
      <span className="absolute bottom-5 left-5 font-display font-bold text-[11px] uppercase tracking-[0.16em] text-brand">
        {category}
      </span>
    </div>
  );
}
