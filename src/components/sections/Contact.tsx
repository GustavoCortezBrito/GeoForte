"use client";

import { useState } from "react";
import { useForm, type RegisterOptions } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { companyInfo, googleMapsUrl } from "@/lib/data";
import { Send, MapPin, Phone, Mail, MessageCircle, Check, Clock, AlertCircle } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";

type FormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

const segments = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "outro", label: "Outro" },
];

const fieldLabel =
  "block mb-2 font-display font-bold text-[11px] uppercase tracking-[0.14em] text-ink-3";

function Field({
  id,
  label,
  placeholder,
  register,
  rules,
  error,
  type = "text",
  textarea = false,
}: {
  id: keyof FormValues;
  label: string;
  placeholder?: string;
  register: ReturnType<typeof useForm<FormValues>>["register"];
  rules?: RegisterOptions<FormValues, keyof FormValues>;
  error?: string;
  type?: string;
  textarea?: boolean;
}) {
  const fieldCls = `w-full px-4 py-3.5 bg-canvas-sunk border text-ink text-[15px] placeholder:text-ink-3 outline-none transition-colors focus:bg-canvas ${
    error ? "border-[#dc2626]" : "border-rule-strong focus:border-brand"
  }`;

  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          placeholder={placeholder}
          {...register(id, rules)}
          className={`${fieldCls} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register(id, rules)}
          className={fieldCls}
        />
      )}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[#dc2626] text-xs">
          <AlertCircle size={12} aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { projectType: "" } });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const projectType = watch("projectType");

  const onSubmit = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 6000);
    reset();
  };

  return (
    <section id="contato" className="on-graphite bg-graphite py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          title="Solicite seu diagnóstico técnico"
          lead="Envie os dados da obra e receba uma análise técnica detalhada com o dimensionamento otimizado da sua fundação."
        />

        <div className="mt-14 grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">
          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28"
          >
            <a
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                "Olá! Gostaria de solicitar um diagnóstico técnico com a Geoforte.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#25d366] hover:bg-[#1eb85a] text-graphite text-[15px] font-display font-bold transition-colors"
            >
              <MessageCircle size={18} aria-hidden />
              Falar agora no WhatsApp
            </a>

            <dl className="mt-8">
              <div className="py-5 border-t border-rule flex gap-3.5">
                <MapPin size={17} strokeWidth={1.75} aria-hidden className="text-brand shrink-0 mt-0.5" />
                <div>
                  <dt className="font-display font-bold text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                    Sede administrativa
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={googleMapsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-2 hover:text-brand-ink transition-colors text-sm leading-relaxed"
                    >
                      {companyInfo.address.street}
                      <br />
                      {companyInfo.address.complement}
                      <br />
                      {companyInfo.address.neighborhood}, {companyInfo.address.city} –{" "}
                      {companyInfo.address.state}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="py-5 border-t border-rule flex gap-3.5">
                <Phone size={17} strokeWidth={1.75} aria-hidden className="text-brand shrink-0 mt-0.5" />
                <div>
                  <dt className="font-display font-bold text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                    Central telefônica
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={`tel:+55${companyInfo.phone.replace(/\D/g, "")}`}
                      className="text-ink text-[15px] font-display font-medium hover:text-brand transition-colors tabular-nums"
                    >
                      {companyInfo.phone}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="py-5 border-t border-b border-rule flex gap-3.5">
                <Mail size={17} strokeWidth={1.75} aria-hidden className="text-brand shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <dt className="font-display font-bold text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
                    E-mail comercial
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-ink text-[15px] font-display font-medium hover:text-brand transition-colors break-words"
                    >
                      {companyInfo.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </motion.aside>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-card p-7 sm:p-10 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.35)]"
          >
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <Field
                id="name"
                label="Nome completo *"
                placeholder="Ex.: João Silva"
                register={register}
                rules={{ required: "Informe seu nome" }}
                error={errors.name?.message}
              />
              <Field
                id="company"
                label="Empresa / construtora *"
                placeholder="Ex.: Construtora Alfa"
                register={register}
                rules={{ required: "Informe a empresa" }}
                error={errors.company?.message}
              />
              <Field
                id="email"
                label="E-mail corporativo *"
                placeholder="voce@empresa.com.br"
                type="email"
                register={register}
                rules={{
                  required: "Informe um e-mail",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "E-mail inválido" },
                }}
                error={errors.email?.message}
              />
              <Field
                id="phone"
                label="Telefone / WhatsApp *"
                placeholder="(71) 99999-9999"
                type="tel"
                register={register}
                rules={{ required: "Informe um telefone" }}
                error={errors.phone?.message}
              />
            </div>

            <div className="mt-6">
              <span className={fieldLabel}>Tipo de empreendimento</span>
              <RadioGroup.Root
                value={projectType}
                onValueChange={(v) => setValue("projectType", v)}
                className="flex flex-wrap gap-2.5"
              >
                {segments.map((s) => (
                  <RadioGroup.Item
                    key={s.value}
                    value={s.value}
                    className="px-4 py-2.5 border border-rule-strong text-ink-2 text-[13.5px] font-display font-medium
                      transition-colors outline-none hover:border-ink hover:text-ink
                      focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2
                      data-[state=checked]:bg-graphite data-[state=checked]:border-graphite data-[state=checked]:text-paper"
                  >
                    {s.label}
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>

            <div className="mt-6">
              <Field
                id="message"
                label="Detalhes do projeto / sondagem"
                placeholder="Localização da obra, diâmetros pretendidos, características do solo…"
                register={register}
                textarea
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="submit"
                disabled={sending || sent}
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-brand hover:bg-brand-deep disabled:bg-ink-3 disabled:cursor-not-allowed text-graphite text-[15px] font-display font-bold transition-colors"
              >
                {sending ? (
                  <>
                    <span
                      aria-hidden
                      className="w-4 h-4 border-2 border-graphite/30 border-t-graphite rounded-full animate-spin"
                    />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Send size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                    Enviar para diagnóstico
                  </>
                )}
              </button>

              <p className="flex items-center gap-2 text-ink-3 text-[13px]">
                <Clock size={14} strokeWidth={1.75} aria-hidden />
                Resposta da engenharia em até 1 dia útil
              </p>
            </div>

            <div aria-live="polite">
              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 flex items-center gap-2.5 bg-graphite text-paper px-5 py-4 text-sm font-display font-medium"
                  >
                    <Check size={17} aria-hidden className="text-[#4ade80] shrink-0" />
                    Solicitação registrada. Entraremos em contato pelo e-mail informado.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
