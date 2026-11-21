// Gera as versões menores das imagens de public/ (WebP em 384, 640, 1080, 1920 e 3840 px de largura).
// O carregador de imagens do site (image-loader.ts) aponta para esses arquivos, então a Vercel não
// precisa otimizar nada e não depende da cota de "Image Optimization – Transformations" (sem ela, o
// otimizador responde 402 e nenhuma foto aparece).
//
// Mesmo desenho do grupo Venda Forte. Roda sozinho antes do build (npm run build) e antes do dev.
// Só refaz o que mudou. Saída: public/_img/<largura>/<caminho sem extensão>.webp (ignorada pelo git).
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// Precisa ser igual a WIDTHS em image-loader.ts e a images.deviceSizes/imageSizes em next.config.ts
const WIDTHS = [384, 640, 1080, 1920, 3840]
const QUALITY = 78
const ROOT = path.resolve('public')
const OUT = path.join(ROOT, '_img')
const EXT = new Set(['.webp', '.png', '.jpg', '.jpeg'])

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (full === OUT) continue
      yield* walk(full)
    } else if (EXT.has(path.extname(entry.name).toLowerCase())) {
      yield full
    }
  }
}

async function build(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/')
  const base = rel.slice(0, rel.length - path.extname(rel).length)
  const sourceTime = (await fs.stat(file)).mtimeMs
  let made = 0
  for (const width of WIDTHS) {
    const out = path.join(OUT, String(width), `${base}.webp`)
    try {
      if ((await fs.stat(out)).mtimeMs >= sourceTime) continue
    } catch {}
    await fs.mkdir(path.dirname(out), { recursive: true })
    // Sem ampliar: imagem menor que a largura sai no tamanho original
    await sharp(file).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 4 }).toFile(out)
    made++
  }
  return made
}

const files = []
for await (const file of walk(ROOT)) files.push(file)

const started = Date.now()
let made = 0
let failed = 0
for (let i = 0; i < files.length; i += 8) {
  const results = await Promise.allSettled(files.slice(i, i + 8).map(build))
  for (const result of results) {
    if (result.status === 'fulfilled') made += result.value
    else {
      failed++
      console.warn('gen-images: falhou:', result.reason?.message ?? result.reason)
    }
  }
}
console.log(`gen-images: ${files.length} imagens, ${made} arquivos novos, ${failed} falhas, ${((Date.now() - started) / 1000).toFixed(1)}s`)
if (failed) process.exitCode = 1
