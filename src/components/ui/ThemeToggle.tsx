"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";

/**
 * Alterna entre o tema claro (padrão da marca) e uma versão escura do mesmo
 * sistema de cores. O estado inicial já vem correto do script inline em
 * layout.tsx (evita flash de tema errado); `useTheme` só mantém este botão
 * — e qualquer outro componente que precise saber o tema em JS, como o
 * WhatsAppButton — sincronizado quando o tema muda em outra aba/lugar.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
      className={`w-9 h-9 shrink-0 flex items-center justify-center text-ink-2 hover:text-brand cursor-pointer transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
