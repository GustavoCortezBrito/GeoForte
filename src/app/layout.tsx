import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import Motion from "@/components/ui/Motion";

/** Títulos e números — Space Grotesk (máx. 700). */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/** Texto corrido — Manrope. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.geoforte.com.br"),
  title: {
    default: "Geoforte Fundações — Qualidade do projeto à execução",
    template: "%s — Geoforte Fundações",
  },
  description:
    "Há 30 anos executando fundações profundas em todo o Brasil. +1500 obras, 26 equipamentos, 8 soluções técnicas. Solicite um diagnóstico.",
  applicationName: "Geoforte Fundações",
  keywords: [
    "fundações profundas",
    "estacas hélice contínua",
    "fundações Salvador",
    "Geoforte",
    "engenharia geotécnica",
  ],
  openGraph: {
    title: "Geoforte Fundações — Qualidade do projeto à execução",
    description:
      "+1500 obras executadas. Solução completa em fundações profundas há 30 anos.",
    type: "website",
    locale: "pt_BR",
    url: "https://www.geoforte.com.br",
    siteName: "Geoforte Fundações",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geoforte Fundações — Qualidade do projeto à execução",
    description:
      "+1500 obras executadas. Solução completa em fundações profundas há 30 anos.",
  },
};

export const viewport: Viewport = {
  themeColor: "#22252a",
  colorScheme: "light",
};

// Aplica o tema salvo antes da primeira pintura, para não piscar claro→escuro
// na carga da página. O padrão da marca é claro; o escuro só entra se o
// visitante já escolheu isso antes (ThemeToggle grava em localStorage).
const THEME_INIT_SCRIPT = `
  try {
    if (localStorage.getItem("geoforte-theme") === "dark") {
      document.documentElement.dataset.theme = "dark";
    }
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${manrope.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-canvas text-ink font-body">
        <Motion>{children}</Motion>
      </body>
    </html>
  );
}
