"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/lib/data";

function AnimatedCounter({
  value,
  suffix,
  prefix,
  duration = 2,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!isInView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(value);
      return;
    }

    const startTime = Date.now();
    const durationMs = duration * 1000;
    let frame = 0;

    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / durationMs, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(eased * value);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="on-graphite bg-graphite py-16">
      <div className="max-w-6xl mx-auto px-5">
        <dl className="grid grid-cols-2 md:grid-cols-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="py-5 pr-5 md:pl-6 md:first:pl-0 md:border-l md:first:border-l-0 border-rule"
            >
              <dt className="font-display font-bold text-3xl text-ink leading-none">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </dt>
              <dd className="mt-2.5 text-[11.5px] uppercase tracking-[0.14em] text-ink-3 font-display font-medium">
                {stat.label}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
