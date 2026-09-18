import Link from "next/link";
import { companyInfo, googleMapsUrl, navLinks } from "@/lib/data";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import GeoforteLogo from "@/components/ui/GeoforteLogo";

function LinkedinIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.183 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.77-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.757 8.437-4.92 8.437-9.94z" />
    </svg>
  );
}

// Rótulos curtos para o rodapé — os títulos completos vivem em Services.
const footerServices = [
  { id: "helice-continua", label: "Hélice Contínua Monitorada" },
  { id: "escavadas", label: "Estacas Escavadas" },
  { id: "franki", label: "Estacas Franki" },
  { id: "metalicas", label: "Estacas Metálicas" },
  { id: "pre-moldadas", label: "Estacas Pré-Moldadas" },
];

const columnTitle =
  "font-display font-bold text-[11px] uppercase tracking-[0.16em] text-ink-3";

export default function Footer() {
  return (
    <footer className="on-graphite bg-graphite">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <GeoforteLogo variant="lockup" size={44} />
            <p className="mt-6 text-ink-2 text-sm leading-relaxed max-w-[30ch]">
              Solução completa em fundações profundas, do projeto à execução, há
              mais de 30 anos.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={companyInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-3 hover:text-brand transition-colors"
                aria-label="Geoforte no LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href={companyInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-3 hover:text-brand transition-colors"
                aria-label="Geoforte no Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={companyInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-3 hover:text-brand transition-colors"
                aria-label="Geoforte no Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className={columnTitle}>
              Navegação
            </h2>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-ink-2 text-sm hover:text-ink transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={columnTitle}>Serviços</h2>
            <ul className="mt-5 space-y-2.5">
              {footerServices.map((s) => (
                <li key={s.id}>
                  <a
                    href="/#servicos"
                    className="text-ink-2 text-sm leading-snug hover:text-ink transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={columnTitle}>Contato</h2>
            <address className="mt-5 not-italic space-y-4 text-sm">
              <p className="flex items-start gap-2.5">
                <MapPin size={15} strokeWidth={1.75} aria-hidden className="text-brand mt-0.5 shrink-0" />
                <a
                  href={googleMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-2 hover:text-ink transition-colors leading-relaxed"
                >
                  {companyInfo.address.street}
                  <br />
                  {companyInfo.address.city} – {companyInfo.address.state}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} strokeWidth={1.75} aria-hidden className="text-brand shrink-0" />
                <a
                  href={`tel:+55${companyInfo.phone.replace(/\D/g, "")}`}
                  className="text-ink-2 hover:text-ink transition-colors tabular-nums"
                >
                  {companyInfo.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} strokeWidth={1.75} aria-hidden className="text-brand shrink-0" />
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="text-ink-2 hover:text-ink transition-colors break-all"
                >
                  {companyInfo.email}
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-ink-3 text-xs">
            © {new Date().getFullYear()} {companyInfo.fullName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/marca"
              className="text-ink-3 hover:text-brand text-xs font-display font-medium transition-colors"
            >
              Identidade visual
            </Link>
            <Link
              href="/termos-de-uso"
              className="text-ink-3 hover:text-brand text-xs font-display font-medium transition-colors"
            >
              Termos de uso
            </Link>
            <Link
              href="/politica-de-privacidade"
              className="text-ink-3 hover:text-brand text-xs font-display font-medium transition-colors"
            >
              Política de privacidade
            </Link>
            <a
              href="/#inicio"
              className="text-ink-3 hover:text-brand transition-colors"
              aria-label="Voltar ao topo"
            >
              <ArrowUp size={17} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
