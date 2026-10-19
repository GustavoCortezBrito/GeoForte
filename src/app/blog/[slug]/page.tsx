import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Markdown from "@/components/blog/Markdown";
import PostCover from "@/components/blog/PostCover";
import { companyInfo } from "@/lib/data";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Só os posts que existem em content/blog; qualquer outro endereço é 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      locale: "pt_BR",
      siteName: companyInfo.name,
      url: `/blog/${post.slug}`,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

const articleBody =
  "mt-12 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-[1.65rem] [&_h2]:leading-tight [&_h2]:tracking-[-0.025em] [&_h2]:text-ink [&_h2]:text-balance [&_h3]:mt-9 [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-[1.15rem] [&_h3]:text-ink [&_p]:mt-5 [&_p]:text-ink-2 [&_p]:text-[17px] [&_p]:leading-[1.75] [&_ul]:mt-5 [&_ul]:space-y-3 [&_ol]:mt-5 [&_ol]:space-y-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:marker:text-brand-ink [&_ol]:marker:font-bold [&_li]:text-ink-2 [&_li]:text-[17px] [&_li]:leading-[1.7] [&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.7em] [&_ul>li]:before:w-2 [&_ul>li]:before:h-2 [&_ul>li]:before:bg-brand [&_a]:text-brand-ink [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:text-ink [&_strong]:text-ink [&_strong]:font-semibold [&_blockquote]:mt-8 [&_blockquote]:border-t-2 [&_blockquote]:border-ink [&_blockquote]:pt-5 [&_blockquote]:font-display [&_blockquote]:text-xl [&_blockquote]:text-ink";

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: companyInfo.name, url: SITE_URL },
    publisher: { "@type": "Organization", name: companyInfo.fullName, url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main className="pt-32 pb-28">
        <article className="max-w-[68ch] mx-auto px-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-display font-medium text-sm text-ink-2 hover:text-ink transition-colors"
          >
            <ArrowLeft size={15} aria-hidden />
            Todos os artigos
          </Link>

          <h1 className="mt-8 font-display font-bold text-[clamp(2rem,4.8vw,3.1rem)] leading-[1.06] tracking-[-0.03em] text-ink text-balance">
            {post.title}
          </h1>
          <p className="mt-5 text-ink-2 text-[19px] leading-relaxed">{post.description}</p>
          <p className="mt-6 pt-5 border-t border-rule text-ink-3 text-[13px]">
            {post.category}
            <span aria-hidden> · </span>
            Por {companyInfo.name}
            <span aria-hidden> · </span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden> · </span>
            {post.readingMinutes} min de leitura
          </p>

          <PostCover
            category={post.category}
            seed={post.slug}
            className="mt-10 aspect-16/7 border border-rule"
          />

          <div className={articleBody}>
            <Markdown source={post.body} />
          </div>

          <aside className="on-graphite mt-16 bg-graphite p-7 sm:p-9">
            <p className="font-display font-bold text-2xl leading-snug text-ink text-balance">
              Quer uma recomendação para a sua obra?
            </p>
            <p className="mt-3 text-ink-2 text-[15.5px] leading-relaxed">
              Envie os dados do projeto e a sondagem. A engenharia da Geoforte indica a solução de
              fundação mais adequada.
            </p>
            <Link
              href="/#contato"
              className="group mt-6 inline-flex items-center gap-2.5 px-7 py-4 bg-brand hover:bg-brand-deep text-graphite text-[15px] font-display font-bold transition-colors"
            >
              Solicitar diagnóstico técnico
              <ArrowRight
                size={17}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </aside>
        </article>

        {more.length > 0 && (
          <section className="max-w-6xl mx-auto px-5 mt-24" aria-labelledby="mais-artigos">
            <p id="mais-artigos" className="font-display font-bold text-xl text-ink">
              Continue lendo
            </p>
            <div className="mt-6 grid gap-x-8 gap-y-10 border-t-2 border-ink pt-8 md:grid-cols-2">
              {more.map((p) => (
                <article key={p.slug} className="group relative">
                  <p className="text-ink-3 text-[13px]">
                    {p.category}
                    <span aria-hidden> · </span>
                    {p.readingMinutes} min de leitura
                  </p>
                  <h2 className="mt-2 font-display font-bold text-xl leading-snug text-ink text-balance">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="after:absolute after:inset-0 hover:text-brand-ink transition-colors"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-2.5 text-ink-2 text-[15px] leading-relaxed">{p.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
