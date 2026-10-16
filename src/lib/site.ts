/**
 * Endereço público do site. Em produção definido por NEXT_PUBLIC_SITE_URL
 * (na Vercel, enquanto o domínio oficial não aponta para o projeto, use o
 * endereço *.vercel.app); sem a variável vale o domínio oficial.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.geoforte.com.br"
).replace(/\/$/, "");
