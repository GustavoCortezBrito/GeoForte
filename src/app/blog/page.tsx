import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostCover from "@/components/blog/PostCover";
import { formatDate, getAllPosts, type PostMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos da Geoforte Fundações sobre estacas, sondagem, projeto e execução de fundações profundas, explicados de forma direta.",
  alternates: { canonical: "/blog" },
};

function Meta({ post }: { post: PostMeta }) {
  return (
    <p className="text-ink-3 text-[13px]">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden> · </span>
      {post.readingMinutes} min de leitura
    </p>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-5">
          <div className="rule-driven max-w-64" aria-hidden />
          <h1 className="mt-7 font-display font-bold text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.035em] text-ink text-balance">
            Fundações, explicadas
          </h1>
          <p className="mt-5 text-ink-2 text-[17px] leading-relaxed max-w-[58ch]">
            Estacas, sondagem, projeto e execução: o que a engenharia considera antes de cravar a
            primeira estaca, em linguagem direta.
          </p>

          {featured && (
            <article className="group relative mt-14 grid gap-x-12 gap-y-7 lg:grid-cols-[1.25fr_1fr] lg:items-center">
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
            <div className="mt-20 grid gap-x-8 gap-y-14 border-t-2 border-ink pt-12 md:grid-cols-2">
              {rest.map((post) => (
                <article key={post.slug} className="group relative">
                  <PostCover
                    category={post.category}
                    className="aspect-16/9 border border-rule"
                  />
                  <div className="mt-5">
                    <Meta post={post} />
                    <h2 className="mt-2.5 font-display font-bold text-[1.35rem] leading-snug tracking-[-0.015em] text-ink text-balance">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="after:absolute after:inset-0 hover:text-brand-ink transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-ink-2 text-[15px] leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
