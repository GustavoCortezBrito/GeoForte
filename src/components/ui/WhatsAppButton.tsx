"use client";

import { useSyncExternalStore } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { companyInfo } from "@/lib/data";
import { useTheme } from "@/lib/theme";

export default function WhatsAppButton() {
  const theme = useTheme();
  // Só no cliente: o widget depende de window e não deve ir no HTML do servidor.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return (
    <FloatingWhatsApp
      phoneNumber={companyInfo.whatsapp}
      accountName={companyInfo.name}
      avatar="/geoforte-avatar.svg"
      statusMessage="Online | Atendimento Especializado"
      chatMessage="Olá! Como podemos ajudar com sua fundação?"
      placeholder="Digite sua mensagem para nossa equipe..."
      darkMode={theme === "dark"}
      allowClickAway={false}
      allowEsc={true}
      notification={true}
      notificationSound={false}
      buttonClassName="!bottom-6 !right-6 !z-50 shadow-2xl hover:scale-105 transition-transform"
      chatboxClassName="!bottom-24 !right-6 !z-50 shadow-2xl !rounded-2xl overflow-hidden"
    />
  );
}
