"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GeoforteLogo from "./GeoforteLogo";

// A estaca (.geoforte-drive, em globals.css) leva 0,55s de atraso + 1,7s de
// queda = 2,25s até terminar de cravar. HOLD_MS precisa cobrir isso, com uma
// folga para o olho registrar o resultado antes da saída.
const HOLD_MS = 2600;

/**
 * Abertura: a estaca é cravada enquanto a marca se monta sobre a malha
 * técnica do hero. A saída fecha como uma íris centrada no símbolo — o
 * mesmo círculo do "G" abrindo caminho para a página.
 * É o único momento coreografado do site — o resto do movimento é contido.
 */
export default function LoadingScreen() {
  const [showing, setShowing] = useState(true);
  const [pct, setPct] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reducedRef.current ? 0 : HOLD_MS;

    document.body.style.overflow = "hidden";

    let raf = 0;
    if (!reducedRef.current) {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / hold, 1);
        setPct(Math.round(t * 100));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else {
      setPct(100);
    }

    const timer = setTimeout(() => setShowing(false), hold);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => (document.body.style.overflow = "")}>
      {showing && (
        <motion.div
          key="geoforte-intro"
          role="status"
          aria-live="polite"
          initial={false}
          exit={{ clipPath: "circle(0% at 50% 46%)" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          style={{ clipPath: "circle(145% at 50% 46%)" }}
          className="on-graphite fixed inset-0 z-[9999] bg-graphite flex flex-col items-center justify-center overflow-hidden"
        >
          <span className="sr-only">Carregando Geoforte Fundações…</span>

          {/* Malha técnica, como no hero — dá profundidade sem distrair */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(250,250,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,248,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(85% 65% at 50% 46%, #000 30%, transparent 75%)",
            }}
          />
          <div
            aria-hidden
            className="absolute w-[34rem] h-[34rem] rounded-full blur-3xl opacity-25"
            style={{
              background: "radial-gradient(circle, rgba(239,108,26,0.65) 0%, transparent 65%)",
            }}
          />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <GeoforteLogo variant="stacked" size={100} driven />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-11 flex items-center gap-4"
            >
              <div className="w-40 h-px bg-white/15 overflow-hidden">
                <motion.div
                  animate={{ scaleX: pct / 100 }}
                  transition={{ ease: "linear", duration: 0.1 }}
                  className="h-full w-full bg-brand origin-left"
                />
              </div>
              <span className="font-display font-bold text-[11px] text-ink-3 tabular-nums w-7 text-right">
                {pct}%
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
