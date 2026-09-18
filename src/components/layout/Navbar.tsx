"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import GeoforteLogo from "@/components/ui/GeoforteLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  // O modo "sobre o hero" (transparente, texto claro) só existe na home,
  // onde o topo é o próprio hero escuro. Nas demais páginas o topo é claro,
  // então a barra já nasce sólida.
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sobre o hero a barra é escura e transparente; ao rolar vira papel.
  const overHero = isHome && !scrolled && !open;

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand z-[60] origin-left"
        style={{ scaleX }}
      />

      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          overHero
            ? "on-graphite"
            : "bg-canvas/95 backdrop-blur-md border-b border-rule"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-18">
          <a
            href="/#inicio"
            className="py-2"
            aria-label="Geoforte Fundações — ir para o início"
          >
            <GeoforteLogo variant="lockup" size={42} />
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.slice(1).map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-ink-2 hover:text-ink font-display font-medium text-[13.5px] transition-colors py-1 group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-[width] duration-300" />
              </a>
            ))}
            <a
              href="/#contato"
              className="ml-1 px-5 py-2.5 text-[13.5px] font-display font-bold bg-brand hover:bg-brand-deep text-graphite transition-colors"
            >
              Diagnóstico técnico
            </a>
            <span className="w-px h-5 bg-rule-strong" aria-hidden />
            <ThemeToggle className="-mx-1.5" />
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-ink p-2 -mr-2"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden border-t border-rule bg-canvas overflow-hidden"
            >
              <div className="px-5 py-3">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 border-b border-rule text-ink font-display font-medium text-[15px]"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="/#contato"
                  onClick={() => setOpen(false)}
                  className="block mt-4 mb-2 py-3.5 text-center text-sm font-display font-bold bg-brand text-graphite"
                >
                  Diagnóstico técnico
                </a>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-ink-3 text-xs font-display font-medium">Tema do site</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
