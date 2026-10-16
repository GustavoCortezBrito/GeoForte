import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import IntegratedSolution from "@/components/sections/IntegratedSolution";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Timeline from "@/components/sections/Timeline";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { companyInfo } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

// Dados estruturados da empresa (schema.org), todos vindos de companyInfo.
const a = companyInfo.address;
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: companyInfo.fullName,
  alternateName: companyInfo.name,
  slogan: companyInfo.slogan,
  url: SITE_URL,
  telephone: companyInfo.phone,
  email: companyInfo.email,
  foundingDate: "1995",
  areaServed: "BR",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${a.street}, ${a.complement}`,
    addressLocality: a.city,
    addressRegion: a.state,
    postalCode: a.cep,
    addressCountry: "BR",
  },
  sameAs: Object.values(companyInfo.social),
};

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <IntegratedSolution />
        <Projects />
        <About />
        <Timeline />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
