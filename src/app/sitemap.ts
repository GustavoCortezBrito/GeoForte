import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// Só entra aqui o que deve ser indexado. `lastModified` só onde a data é real:
// posts (data do artigo), /blog (post mais recente) e os documentos legais
// (data de atualização escrita na própria página). A home fica sem data,
// porque não há uma que seja confiável. /marca é noindex e não entra.
const LEGAL_UPDATED = "2026-10-19";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0]?.date,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/politica-de-privacidade`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/termos-de-uso`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
