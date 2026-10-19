import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 só serve as qualidades listadas aqui. 85 é a do hero do blog (4K).
    qualities: [75, 85],
  },
};

export default nextConfig;
