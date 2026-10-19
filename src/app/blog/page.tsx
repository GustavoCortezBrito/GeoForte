import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogExplorer from "@/components/blog/BlogExplorer";
import { companyInfo } from "@/lib/data";
import { mark } from "@/lib/brand";
import { getAllPosts, type PostMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos da Geoforte Fundações sobre estacas, sondagem, projeto e execução de fundações profundas, explicados de forma direta.",
  alternates: { canonical: "/blog" },
};

const gridBg =
  "linear-gradient(rgba(250,250,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,248,0.05) 1px, transparent 1px)";

export default function BlogPage() {
  // Só os metadados vão para o navegador; o texto dos posts fica no servidor.
  const posts: PostMeta[] = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    readingMinutes: p.readingMinutes,
    featured: p.featured,
  }));

  return (
    <>
      <Navbar />
      <main>
        {/* 1 · Hero */}
        <section className="on-graphite relative overflow-hidden bg-graphite pt-40 pb-24 sm:pt-44 sm:pb-32">
          <Image
            src="/images/blog-hero-obra.jpg"
            alt=""
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-[80%_58%] md:object-[60%_58%]"
          />
          {/* Escurece da esquerda (texto) para a direita (trado e pôr do sol) */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/80 to-graphite/10"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-graphite to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: gridBg,
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(70% 120% at 0% 0%, #000 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-5">
            <div className="rule-driven max-w-64" aria-hidden />
            <h1 className="mt-7 font-display font-bold text-[clamp(2.6rem,6.2vw,4.9rem)] leading-[1.0] tracking-[-0.035em] text-ink text-balance max-w-[13ch]">
              Fundações, <span className="text-brand">explicadas</span>
            </h1>
            <p className="mt-7 text-ink-2 text-lg leading-relaxed max-w-[46ch]">
              Estacas, sondagem, projeto e execução: o que a engenharia considera antes de cravar
              a primeira estaca, em linguagem direta.
            </p>
            <p className="mt-8 flex items-center gap-3 text-ink-3 text-[13px] tabular-nums">
              <span aria-hidden className="w-8 h-[2px] bg-brand" />
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
              backgroundImage: gridBg,
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(80% 140% at 0% 100%, #000 10%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="absolute -right-24 top-0 w-[44rem] h-[44rem] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(239,108,26,0.14) 0%, transparent 62%)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-5 grid gap-x-16 gap-y-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <div className="rule-driven max-w-64" aria-hidden />
              <h2 className="mt-7 font-display font-bold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-ink text-balance max-w-[18ch]">
                Tem uma obra em planejamento?
              </h2>
              <p className="mt-5 text-ink-2 text-lg leading-relaxed max-w-[48ch]">
                Envie os dados do projeto. A engenharia da Geoforte analisa o seu caso e indica a
                solução de fundação mais adequada.
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

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px]">
                <p className="flex items-center gap-2 text-ink-3">
                  <Clock size={15} strokeWidth={1.75} aria-hidden />
                  Resposta da engenharia em até 1 dia útil
                </p>
                <a
                  href={`tel:+55${companyInfo.phone.replace(/D/g, "")}`}
                  className="flex items-center gap-2 font-display font-medium text-ink hover:text-brand transition-colors tabular-nums"
                >
                  <Phone size={15} strokeWidth={1.75} aria-hidden className="text-brand" />
                  {companyInfo.phone}
                </a>
              </div>
            </div>

            {/* O símbolo da marca em escala de obra, cravado no canto direito */}
            <div aria-hidden className="relative hidden lg:block self-stretch min-h-[22rem]">
              <svg
                viewBox={mark.viewBox}
                className="absolute right-0 -top-24 -bottom-24 h-[calc(100%+12rem)] w-auto"
                fill="none"
              >
                <g fill="#ef6c1a" opacity="0.2">
                  <path d={mark.ring} />
                  <rect {...mark.bar} />
                  <path d={mark.pile} />
                </g>
              </svg>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
