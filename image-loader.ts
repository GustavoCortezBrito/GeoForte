'use client'

/**
 * Carregador de imagens do site (next.config.ts, images.loaderFile).
 *
 * - Imagem de public/ (/images/..., /videos/..., /propostas/...): usa a versão pré-gerada por
 *   scripts/gen-images.mjs em /_img/<largura>/..., servida como arquivo estático. Não passa pelo
 *   otimizador da Vercel, então não depende da cota de transformações.
 * - Imagem importada no código (import foto from "...jpg" vira /_next/static/media/...): já é um
 *   arquivo estático com hash no nome, vai direto, sem redimensionar.
 * - SVG, GIF e qualquer outra coisa: sem mudança.
 *
 * A qualidade é fixa na geração (QUALITY em gen-images.mjs): a prop `quality` não tem efeito aqui.
 */

// Precisa ser igual a WIDTHS em scripts/gen-images.mjs e a images.deviceSizes/imageSizes em next.config.ts
const WIDTHS = [384, 640, 1080, 1920, 3840]

const snap = (width: number) => WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS[WIDTHS.length - 1]

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const [path] = src.split('?')
  const dot = path.lastIndexOf('.')
  const ext = dot === -1 ? '' : path.slice(dot).toLowerCase()

  if (!path.startsWith('/') || path.startsWith('/_next/')) return src
  if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) return src

  return `/_img/${snap(width)}${path.slice(0, dot)}.webp`
}
