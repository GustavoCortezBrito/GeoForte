"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import PostCover from "@/components/blog/PostCover";
import { formatDate, normalize, type PostMeta } from "@/lib/blog-shared";

const ALL = "Todos";

function Meta({ post }: { post: PostMeta }) {
  return (
    <p className="text-ink-3 text-[13px]">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden> · </span>
      {post.readingMinutes} min de leitura
    </p>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative">
      <PostCover
        category={post.category}
        seed={post.slug}
        className="aspect-16/9 border border-rule"
      />
      <div className="mt-5">
        <Meta post={post} />
        <h2 className="mt-2.5 font-display font-bold text-[1.3rem] leading-snug tracking-[-0.015em] text-ink text-balance">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 hover:text-brand-ink transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-ink-2 text-[15px] leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>
    </article>
  );
}

/**
 * Página do blog: hero com busca, filtros por categoria e a lista. Busca e
 * filtro rodam no navegador sobre título, resumo e categoria — os textos
 * completos dos posts não vão para o cliente.
 */
export default function BlogExplorer({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts].sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
  }, [posts]);

  const filtered = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return posts.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      const haystack = normalize(`${p.title} ${p.description} ${p.category}`);
      return terms.every((t) => haystack.includes(t));
    });
  }, [posts, query, category]);

  const filtering = query.trim() !== "" || category !== ALL;
  const featured = !filtering ? (posts.find((p) => p.featured) ?? posts[0]) : undefined;
  const rest = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;

  const clear = () => {
    setQuery("");
    setCategory(ALL);
  };

  return (
    <>
      {/* Hero */}
      <section className="on-graphite relative overflow-hidden bg-graphite pt-36 pb-16 sm:pb-20">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,250,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,248,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(90% 120% at 85% 0%, #000 10%, transparent 75%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5">
          <div className="rule-driven max-w-64" aria-hidden />
          <h1 className="mt-7 font-display font-bold text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.035em] text-ink text-balance max-w-[16ch]">
            Fundações, <span className="text-brand">explicadas</span>
          </h1>
          <p className="mt-6 text-ink-2 text-lg leading-relaxed max-w-[52ch]">
            Estacas, sondagem, projeto e execução: o que a engenharia considera antes de cravar a
            primeira estaca, em linguagem direta.
          </p>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 max-w-xl"
          >
            <label htmlFor="blog-busca" className="sr-only">
              Buscar artigos
            </label>
            <div className="relative">
              <Search
                size={19}
                aria-hidden
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
              />
              <input
                id="blog-busca"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar artigos…"
                autoComplete="off"
                className="w-full pl-12 pr-12 py-4 bg-card border border-rule-strong text-ink text-[16px] placeholder:text-ink-3 outline-none transition-colors focus:border-brand [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-ink-3 hover:text-ink transition-colors"
                >
                  <X size={17} aria-hidden />
                </button>
              )}
            </div>
          </form>
          <p className="mt-5 text-ink-3 text-[13px] tabular-nums">
            {posts.length} artigos · {categories.length} temas
          </p>
        </div>
      </section>

      {/* Filtros + lista */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div
            role="group"
            aria-label="Filtrar por tema"
            className="flex flex-wrap gap-2.5"
          >
            {[[ALL, posts.length] as const, ...categories].map(([name, count]) => {
              const active = category === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  aria-pressed={active}
                  className={`px-4 py-2.5 border text-[13.5px] font-display font-medium transition-colors ${
                    active
                      ? "bg-graphite border-graphite text-paper"
                      : "border-rule-strong text-ink-2 hover:border-ink hover:text-ink"
                  }`}
                >
                  {name}
                  <span
                    className={`ml-2 tabular-nums text-[12px] ${active ? "text-paper/70" : "text-ink-3"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p role="status" aria-live="polite" className="mt-6 text-ink-3 text-sm">
            {filtering
              ? `${filtered.length} ${filtered.length === 1 ? "artigo encontrado" : "artigos encontrados"}`
              : "Mais recentes primeiro"}
          </p>

          {featured && (
            <article className="group relative mt-8 grid gap-x-12 gap-y-7 lg:grid-cols-[1.25fr_1fr] lg:items-center">
              <PostCover
                category={featured.category}
                className="aspect-16/9 lg:aspect-4/3 border border-rule"
              />
              <div>
                <Meta post={featured} />
                <h2 className="mt-3 font-display font-bold text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.025em] text-ink text-balance">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="after:absolute after:inset-0 hover:text-brand-ink transition-colors"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 text-ink-2 text-[16px] leading-relaxed">
                  {featured.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-display font-bold text-[15px] text-ink">
                  Ler artigo
                  <ArrowRight
                    size={17}
                    aria-hidden
                    className="text-brand transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </article>
          )}

          {rest.length > 0 && (
            <div
              className={`grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 ${
                featured ? "mt-16 border-t-2 border-ink pt-12" : "mt-8"
              }`}
            >
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="mt-8 border border-rule-strong p-8 sm:p-10 max-w-2xl">
              <p className="font-display font-bold text-xl text-ink">
                Nenhum artigo encontrado
              </p>
              <p className="mt-3 text-ink-2 text-[15.5px] leading-relaxed">
                Não achamos resultados para o que você buscou. Tente outro termo, escolha outro
                tema ou fale direto com a nossa engenharia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={clear}
                  className="px-5 py-3 bg-graphite text-paper text-[14px] font-display font-bold hover:bg-ink transition-colors"
                >
                  Limpar busca e filtros
                </button>
                <Link
                  href="/#contato"
                  className="px-5 py-3 border border-rule-strong text-ink text-[14px] font-display font-medium hover:border-ink transition-colors"
                >
                  Falar com a engenharia
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
