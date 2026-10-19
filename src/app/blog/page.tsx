import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogExplorer from "@/components/blog/BlogExplorer";
import { companyInfo } from "@/lib/data";
import { getAllPosts, type PostMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos da Geoforte Fundações sobre estacas, sondagem, projeto e execução de fundações profundas, explicados de forma direta.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  // Só os metadados vão para o navegador; o texto dos posts fica no servidor.
  const posts: PostMeta[] = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    readingMinutes: p.readingMinutes,
  }));

  return (
    <>
      <Navbar />
      <main>
        {/* 1 · Hero */}
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
              Estacas, sondagem, projeto e execução: o que a engenharia considera antes de cravar
              a primeira estaca, em linguagem direta.
            </p>
            <p className="mt-6 text-ink-3 text-[13px] tabular-nums">
              {posts.length} artigos · {new Set(posts.map((p) => p.category)).size} temas
            </p>
          </div>
        </section>

        {/* 2 · Busca e filtros  +  3 · Posts e paginação */}
        <BlogExplorer posts={posts} />

        {/* 4 · CTA */}
        <section className="on-graphite relative overflow-hidden bg-graphite py-20 sm:py-28">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(250,250,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,248,0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(80% 140% at 0% 100%, #000 10%, transparent 70%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-5">
            <div className="rule-driven max-w-64" aria-hidden />
            <h2 className="mt-7 font-display font-bold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-ink text-balance max-w-[20ch]">
              Tem uma obra em planejamento?
            </h2>
            <p className="mt-5 text-ink-2 text-lg leading-relaxed max-w-[52ch]">
              Envie os dados do projeto e a sondagem. A engenharia da Geoforte analisa e indica a
              solução de fundação mais adequada para o seu caso.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/#contato"
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-brand hover:bg-brand-deep text-graphite text-[15px] font-display font-bold transition-colors"
              >
                Solicitar diagnóstico técnico
                <ArrowRight
                  size={17}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                  "Olá! Li o blog da Geoforte e gostaria de falar sobre a fundação da minha obra.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 text-ink text-[15px] font-display font-medium border border-white/25 hover:border-white/60 hover:bg-white/5 transition-colors"
              >
                <MessageCircle size={17} aria-hidden />
                Conversar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
