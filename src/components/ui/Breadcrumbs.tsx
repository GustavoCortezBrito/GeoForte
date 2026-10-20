import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/site";

export interface Crumb {
  name: string;
  /** Sem `href` é a página atual. */
  href?: string;
}

/**
 * Trilha de navegação visível + dados estruturados `BreadcrumbList`.
 * A última migalha (página atual) é truncada em uma linha.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${SITE_URL}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <nav aria-label="Trilha de navegação">
        <ol className="flex items-center gap-1.5 text-[13px] text-ink-3">
          {items.map((c, i) => (
            <li
              key={c.name}
              className={`flex items-center gap-1.5 ${c.href ? "shrink-0" : "min-w-0"}`}
            >
              {i > 0 && <ChevronRight size={13} aria-hidden className="shrink-0" />}
              {c.href ? (
                <Link
                  href={c.href}
                  className="font-display font-medium text-ink-2 hover:text-ink transition-colors"
                >
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="truncate">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
