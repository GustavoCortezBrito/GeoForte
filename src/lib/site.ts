/**
 * Endereço público do site, na ordem:
 *  1. NEXT_PUBLIC_SITE_URL, se definida (sobrescreve tudo);
 *  2. VERCEL_PROJECT_PRODUCTION_URL, que a Vercel preenche sozinha com o
 *     domínio de produção do projeto — o *.vercel.app hoje e o domínio
 *     oficial assim que ele for adicionado em Settings → Domains;
 *  3. o domínio oficial, para rodar fora da Vercel.
 * Alimenta canonical, Open Graph, sitemap, robots e os dados estruturados.
 */
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  fromVercel ??
  "https://www.geoforte.com.br"
).replace(/\/$/, "");
