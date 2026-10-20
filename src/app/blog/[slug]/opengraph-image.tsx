import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";
import { brand, mark } from "@/lib/brand";

export const alt = "Artigo do blog da Geoforte Fundações";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Cartão social do post (WhatsApp, LinkedIn, X): título, tema e o símbolo da
 * marca em escala grande. Usa a fonte padrão do `next/og`.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Blog Geoforte";
  const category = post?.category ?? "Fundações";
  const fontSize = title.length > 62 ? 54 : title.length > 46 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.graphite,
          color: brand.paper,
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <svg
          viewBox={mark.viewBox}
          width="560"
          height="790"
          style={{ position: "absolute", right: -90, top: -120, opacity: 0.16 }}
        >
          <g fill={brand.orange}>
            <path d={mark.ring} />
            <rect x={mark.bar.x} y={mark.bar.y} width={mark.bar.width} height={mark.bar.height} />
            <path d={mark.pile} />
          </g>
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ width: 120, height: 6, background: brand.orange }} />
          <div
            style={{
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: brand.orange,
              fontWeight: 700,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.08, maxWidth: 920 }}
        >
          {title}
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#a8adb6" }}>
          Geoforte Fundações · Blog
        </div>
      </div>
    ),
    { ...size },
  );
}
