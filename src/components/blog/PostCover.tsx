import { mark } from "@/lib/brand";

/**
 * Capa dos posts enquanto não há foto: faixa grafite com a malha técnica da
 * marca e o símbolo cravado no canto. A categoria é o único texto.
 */
export default function PostCover({
  category,
  className = "",
}: {
  category: string;
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
        className="absolute -right-6 -top-10 h-[130%] w-auto opacity-[0.16]"
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
