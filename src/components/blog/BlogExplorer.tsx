"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import PostCover from "@/components/blog/PostCover";
import { formatDate, normalize, type PostMeta } from "@/lib/blog-shared";

const ALL = "Todos";
/** Posts por página: 3 colunas × 2 linhas. */
const PAGE_SIZE = 6;

function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative">
      <PostCover
        category={post.category}
        seed={post.slug}
        className="aspect-16/9 border border-rule"
      />
      <div className="mt-5">
        <p className="text-ink-3 text-[13px]">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden> · </span>
          {post.readingMinutes} min de leitura
        </p>
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
        <span className="mt-4 inline-flex items-center gap-2 font-display font-bold text-sm text-ink">
          Ler artigo
          <ArrowRight
            size={16}
            aria-hidden
            className="text-brand transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  );
}

const pagerButton =
  "w-11 h-11 flex items-center justify-center border border-rule-strong text-ink hover:bg-brand hover:border-brand hover:text-graphite disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:border-rule-strong disabled:hover:text-ink disabled:cursor-not-allowed transition-colors";

/**
 * Busca + filtros, lista de posts e paginação. Busca e filtro rodam no
 * navegador sobre título, resumo e categoria — o texto completo dos posts
 * não vai para o cliente.
 */
export default function BlogExplorer({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [page, setPage] = useState(1);
  const listTop = useRef<HTMLDivElement>(null);

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
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // Mudou a busca ou o filtro: volta para a primeira página.
  const search = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const pickCategory = (name: string) => {
    setCategory(name);
    setPage(1);
  };
  const clear = () => {
    setQuery("");
    setCategory(ALL);
    setPage(1);
  };
  const goTo = (n: number) => {
    setPage(n);
    // Leva o leitor de volta ao topo da lista, abaixo da barra fixa.
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Busca + filtros */}
      <section className="bg-canvas-sunk border-b border-rule py-9 sm:py-10">
        <div className="max-w-6xl mx-auto px-5">
          <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-xl">
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
                onChange={(e) => search(e.target.value)}
                placeholder="Buscar artigos…"
                autoComplete="off"
                className="w-full pl-12 pr-12 py-4 bg-card border border-rule-strong text-ink text-[16px] placeholder:text-ink-3 outline-none transition-colors focus:border-brand [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => search("")}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-ink-3 hover:text-ink transition-colors"
                >
                  <X size={17} aria-hidden />
                </button>
              )}
            </div>
          </form>

          <div role="group" aria-label="Filtrar por tema" className="mt-5 flex flex-wrap gap-2.5">
            {[[ALL, posts.length] as const, ...categories].map(([name, count]) => {
              const active = category === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => pickCategory(name)}
                  aria-pressed={active}
                  className={`px-4 py-2.5 border text-[13.5px] font-display font-medium transition-colors ${
                    active
                      ? "bg-graphite border-graphite text-paper"
                      : "border-rule-strong bg-card text-ink-2 hover:border-ink hover:text-ink"
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
        </div>
      </section>

      {/* Posts + paginação */}
      <section className="py-14 sm:py-20">
        <div ref={listTop} className="max-w-6xl mx-auto px-5 scroll-mt-28">
          <p role="status" aria-live="polite" className="text-ink-3 text-sm">
            {filtered.length === 0
              ? "Nenhum artigo encontrado"
              : filtering
                ? `${filtered.length} ${filtered.length === 1 ? "artigo encontrado" : "artigos encontrados"}`
                : `${filtered.length} artigos, do mais recente ao mais antigo`}
          </p>

          {visible.length > 0 && (
            <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="mt-8 border border-rule-strong p-8 sm:p-10 max-w-2xl">
              <p className="font-display font-bold text-xl text-ink">Nenhum artigo encontrado</p>
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

          {pageCount > 1 && (
            <nav
              aria-label="Paginação"
              className="mt-16 pt-10 border-t-2 border-ink flex flex-col items-center gap-5"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(current - 1)}
                  disabled={current === 1}
                  aria-label="Página anterior"
                  className={pagerButton}
                >
                  <ArrowLeft size={18} aria-hidden />
                </button>

                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goTo(n)}
                    aria-label={`Página ${n}`}
                    aria-current={n === current ? "page" : undefined}
                    className={`w-11 h-11 border font-display font-bold text-[15px] tabular-nums transition-colors ${
                      n === current
                        ? "bg-graphite border-graphite text-paper"
                        : "border-rule-strong text-ink-2 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goTo(current + 1)}
                  disabled={current === pageCount}
                  aria-label="Próxima página"
                  className={pagerButton}
                >
                  <ArrowRight size={18} aria-hidden />
                </button>
              </div>

              <p className="text-ink-3 text-sm tabular-nums">
                Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} de{" "}
                {filtered.length}
              </p>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
