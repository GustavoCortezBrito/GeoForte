import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { PostMeta } from "./blog-shared";

export { formatDate } from "./blog-shared";
export type { PostMeta } from "./blog-shared";

/**
 * Blog em arquivos: cada post é um `content/blog/<slug>.md` com um cabeçalho
 * (frontmatter) simples e o texto em Markdown. Para publicar, basta criar o
 * arquivo — a lista, a página, o sitemap e o SEO saem dele.
 *
 *   ---
 *   title: Título do post
 *   description: Resumo de uma ou duas frases (aparece no Google).
 *   category: Fundações
 *   date: 2026-10-19
 *   featured: true        (opcional: é o destaque do /blog; sem ele, o mais recente)
 *   seoTitle: Título curto   (opcional: título para o Google, até ~49 caracteres)
 *   ---
 */

const DIR = join(process.cwd(), "content", "blog");

export interface Post extends PostMeta {
  body: string;
  /** Título curto para o Google (até ~49 caracteres); sem ele, vale o título. */
  seoTitle?: string;
}

function parse(slug: string, raw: string): Post {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Post "${slug}" sem cabeçalho (---) no início do arquivo.`);

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }

  for (const key of ["title", "description", "category", "date"]) {
    if (!data[key]) throw new Error(`Post "${slug}": falta "${key}" no cabeçalho.`);
  }
  if (Number.isNaN(Date.parse(data.date))) {
    throw new Error(`Post "${slug}": data inválida "${data.date}" (use AAAA-MM-DD).`);
  }

  const body = match[2].trim();
  const words = body.split(/\s+/).length;

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    date: data.date,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    featured: data.featured === "true",
    seoTitle: data.seoTitle || undefined,
    body,
  };
}

/** Todos os posts, do mais recente para o mais antigo. */
export function getAllPosts(): Post[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parse(f.replace(/\.md$/, ""), readFileSync(join(DIR, f), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "pt-BR"));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

