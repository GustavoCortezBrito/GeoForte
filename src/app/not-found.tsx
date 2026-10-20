import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "O endereço que você tentou abrir não existe ou foi movido.",
};

const links = [
  { href: "/", label: "Página inicial" },
  { href: "/#servicos", label: "Serviços e tecnologias" },
  { href: "/blog", label: "Blog" },
  { href: "/#contato", label: "Fale conosco" },
];

/** 404 em português, com saídas úteis. O status 404 e o noindex vêm do Next. */
export default function NotFound() {
  const recent = getAllPosts().slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="pt-36 pb-28">
        <div className="max-w-3xl mx-auto px-5">
          <div className="rule-driven max-w-64" aria-hidden />
          <p className="mt-7 font-display font-bold text-[clamp(3.5rem,10vw,6rem)] leading-none tracking-[-0.04em] text-brand tabular-nums">
            404
          </p>
          <h1 className="mt-4 font-display font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-[-0.025em] text-ink text-balance">
            Página não encontrada
          </h1>
          <p className="mt-4 text-ink-2 text-[17px] leading-relaxed max-w-[52ch]">
            O endereço que você abriu não existe ou foi movido. Veja por onde continuar:
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex px-5 py-3 border border-rule-strong text-ink text-[14px] font-display font-medium hover:border-ink transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {recent.length > 0 && (
            <div className="mt-16">
              <p className="font-display font-bold text-xl text-ink">Artigos recentes</p>
              <ul className="mt-5 border-t-2 border-ink">
                {recent.map((p) => (
                  <li key={p.slug} className="border-b border-rule">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-center justify-between gap-6 py-4 text-ink hover:text-brand-ink transition-colors"
                    >
                      <span className="font-display font-medium text-[16px]">{p.title}</span>
                      <ArrowRight
                        size={17}
                        aria-hidden
                        className="shrink-0 text-brand transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
