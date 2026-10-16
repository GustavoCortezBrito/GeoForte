import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/marca`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/termos-de-uso`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
