"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

// O vídeo só carrega onde compensa: tela larga, sem "reduzir movimento" e sem
// "economia de dados" (a mesma regra do hero da home). No servidor o valor é
// falso, então o HTML inicial traz só o poster, que é a imagem principal.
const assinar = (avisar: () => void) => {
  const qs = [window.matchMedia("(min-width: 768px)"), window.matchMedia("(prefers-reduced-motion: reduce)")];
  qs.forEach((q) => q.addEventListener("change", avisar));
  return () => qs.forEach((q) => q.removeEventListener("change", avisar));
};
const podeTocar = () => {
  const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return (
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !economia
  );
};

interface Props {
  src: string;
  poster: string;
  /** A capa carrega o poster com prioridade (é o LCP); os demais esperam. */
  prioridade?: boolean;
  sizes?: string;
  className?: string;
  /** Ponto que não pode sair do recorte (object-position), para quadros mais estreitos que o vídeo. */
  foco?: string;
}

/** Vídeo de fundo, mudo e em loop. Fora da tela ele pausa. */
export default function VideoFundo({ src, poster, prioridade = false, sizes = "100vw", className = "", foco }: Props) {
  const tocar = useSyncExternalStore(assinar, podeTocar, () => false);
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.15,
    });
    io.observe(v);
    return () => io.disconnect();
  }, [tocar, ok]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Image src={poster} alt="" fill priority={prioridade} sizes={sizes} className="object-cover" style={foco ? { objectPosition: foco } : undefined} />
      {tocar && ok && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload={prioridade ? "auto" : "metadata"}
          poster={poster}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={foco ? { objectPosition: foco } : undefined}
        >
          <source src={src} type="video/mp4" onError={() => setOk(false)} />
        </video>
      )}
    </div>
  );
}
