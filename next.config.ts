import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 só serve as qualidades listadas aqui. 85 é a do hero do blog (4K).
    qualities: [75, 85],
  },
  // Propostas comerciais são links privados: fora do Google, inclusive o PDF
  // e os vídeos servidos de public/propostas (que não têm <meta robots>).
  async headers() {
    return [
      {
        source: "/propostas/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
