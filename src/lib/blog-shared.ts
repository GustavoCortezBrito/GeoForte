/** Tipos e utilitários do blog que também rodam no navegador (sem `fs`). */

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO, AAAA-MM-DD. */
  date: string;
  readingMinutes: number;
  /** Post em destaque do /blog (campo `featured: true` no cabeçalho). */
  featured: boolean;
}

/** `2026-10-19` → `19 de outubro de 2026` (UTC, para o dia não mudar com o fuso). */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Minúsculas e sem acentos, para a busca ignorar "Fundação" x "fundacao". */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
