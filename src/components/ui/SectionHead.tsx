"use client";

import { motion } from "framer-motion";

interface SectionHeadProps {
  title: string;
  lead?: string;
  align?: "start" | "center";
  className?: string;
}

/**
 * Abertura de seção da marca: fio de 2px que começa laranja e some num fio
 * fino — o traço técnico do manual, no lugar de um rótulo acima do título.
 */
export default function SectionHead({
  title,
  lead,
  align = "start",
  className = "",
}: SectionHeadProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`${align === "center" ? "text-center mx-auto" : ""} ${className}`}
    >
      <div
        className={`rule-driven ${align === "center" ? "max-w-40 mx-auto" : "max-w-64"}`}
        aria-hidden
      />
      <h2 className="mt-7 font-display font-bold text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.06] tracking-[-0.03em] text-ink text-balance">
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-4 text-ink-2 text-[17px] leading-relaxed max-w-[58ch] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      )}
    </motion.div>
  );
}
