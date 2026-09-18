"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "geoforte-theme";
const THEME_CHANGE_EVENT = "geoforte-theme-change";

/** Lê o tema atual direto do DOM — sempre a fonte da verdade. */
export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Aplica o tema, persiste e avisa quem estiver com `useTheme()` montado. */
export function setTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Modo privado ou storage bloqueado — o tema só não persiste entre visitas.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/**
 * Componentes puramente CSS (a maioria do site) não precisam disso — eles
 * leem `var(--ink)` etc. e já se adaptam sozinhos. Use este hook só quando o
 * componente precisa saber o tema em JS, como o widget do WhatsApp, que tem
 * seu próprio prop `darkMode` booleano.
 */
export function useTheme(): Theme {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const sync = () => setThemeState(getTheme());
    sync();
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  return theme;
}
