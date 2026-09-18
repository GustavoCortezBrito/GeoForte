"use client";

import { MotionConfig } from "framer-motion";

/**
 * Respeita `prefers-reduced-motion` em todo o movimento do Framer Motion —
 * o CSS sozinho não alcança animações controladas por JS.
 */
export default function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
