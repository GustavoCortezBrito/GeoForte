import { mark } from "@/lib/brand";

interface PlaceholderProps {
  /** Texto curto que descreve a imagem que entrará aqui. */
  label?: string;
  className?: string;
}

/**
 * Espaço reservado para imagem: hachura técnica + símbolo em marca d'água.
 * Todo em tokens (`--ink`, `bg-canvas-sunk`) — se adapta sozinho a qualquer
 * fundo em que for colocado: tema claro, escuro, ou dentro de uma faixa
 * `.on-graphite` como o Hero. Substituir por <Image> quando as fotos
 * definitivas chegarem.
 */
export default function Placeholder({ label, className = "" }: PlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center bg-canvas-sunk ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, color-mix(in srgb, var(--ink) 7%, transparent) 0 1px, transparent 1px 11px)",
      }}
      aria-hidden
    >
      <svg viewBox={mark.viewBox} className="h-1/3 max-h-28 opacity-25" fill="var(--ink)">
        <path d={mark.ring} />
        <rect {...mark.bar} />
        <path d={mark.pile} />
      </svg>

      {label && (
        <span className="absolute bottom-3 left-3 px-2.5 py-1.5 bg-ink/10 text-ink-2 font-display font-bold text-[10px] uppercase tracking-[0.14em]">
          {label}
        </span>
      )}
    </div>
  );
}
