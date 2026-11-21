import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Lembra de upgrades de segurança do Next (política "security").
    agentUpgrade: "security",
  },
  images: {
    // As imagens de public/ são pré-geradas por scripts/gen-images.mjs e servidas como arquivo
    // (image-loader.ts), sem passar pelo otimizador da Vercel: ele respondia 402 (cota do plano) e
    // nenhuma foto aparecia. A qualidade é fixa na geração, então não há `qualities` aqui.
    loader: "custom",
    loaderFile: "./image-loader.ts",
    // Iguais a WIDTHS em image-loader.ts e scripts/gen-images.mjs. 3840 é para o hero do blog (4K).
    deviceSizes: [640, 1080, 1920, 3840],
    imageSizes: [384],
  },
  // Propostas comerciais são links privados: fora do Google, inclusive o PDF
  // e os vídeos servidos de public/propostas (que não têm <meta robots>) e as
  // versões geradas das fotos delas em /_img/<largura>/propostas.
  async headers() {
    const privado = [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];
    return [
      { source: "/propostas/:path*", headers: privado },
      { source: "/_img/:largura/propostas/:path*", headers: privado },
    ];
  },
};

export default nextConfig;
