import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  children: ReactNode;
}

/**
 * Casca compartilhada pelos documentos legais (Termos de Uso, Privacidade).
 * Medida de leitura contida (68ch), hierarquia simples — sem o vocabulário
 * de marketing das seções da home.
 */
export default function LegalPage({ eyebrow, title, updatedAt, intro, children }: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-28">
        <div className="max-w-[68ch] mx-auto px-5">
          <span className="font-display font-bold text-[11px] uppercase tracking-[0.16em] text-brand-ink">
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display font-bold text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.08] tracking-[-0.03em] text-ink">
            {title}
          </h1>
          <p className="mt-4 text-ink-3 text-sm">Última atualização em {updatedAt}</p>
          <p className="mt-6 text-ink-2 text-[17px] leading-relaxed">{intro}</p>

          <div className="mt-14 [&>section]:pt-12 [&>section]:mt-12 [&>section]:border-t [&>section]:border-rule [&>section:first-child]:border-t-0 [&>section:first-child]:mt-0 [&>section:first-child]:pt-0 [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-xl [&_h2]:text-ink [&_h2]:tracking-[-0.02em] [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-[15px] [&_h3]:text-ink [&_h3]:mt-6 [&_p]:mt-4 [&_p]:text-ink-2 [&_p]:text-[15.5px] [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:space-y-2.5 [&_li]:text-ink-2 [&_li]:text-[15.5px] [&_li]:leading-relaxed [&_li]:pl-5 [&_li]:relative [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.65em] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:bg-brand [&_a]:text-brand-ink [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-ink [&_strong]:text-ink [&_strong]:font-semibold">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
