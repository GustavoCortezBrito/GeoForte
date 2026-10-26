"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type { ContencaoMemorial } from "@/lib/propostas/grand-palladium";

const drive = [0.16, 1, 0.3, 1] as const;

/*
 * Corte da cortina desenhado em metros, na escala real do memorial de cálculo:
 * x < 0 é o lado escavado (intradorso), x > 0 o terreno contido (tardoz),
 * y é a cota (0,00 no térreo, negativa para baixo).
 */
const X0 = -7.4;
const X1 = 4.2;
const YTOP = 1.45;
const YBOT = -9.15;
const K = 100;
const W = (X1 - X0) * K;
const H = (YTOP - YBOT) * K;
const sx = (m: number) => (m - X0) * K;
const sy = (cota: number) => (YTOP - cota) * K;

/* Painel de deslocamentos: mesma escala vertical; 0 mm à direita (a cortina
   indeformada), deslocamento para o lado escavado à esquerda. A escala é a
   mesma nas duas contenções, para a diferença entre elas aparecer. */
const PW = 470;
const PL = 64;
const PR = 36;
const DMAX = 20;
const px = (mm: number) => PW - PR + (mm / DMAX) * (PW - PR - PL);

const menos = (s: string) => s.replace("-", "−");
const num = (n: number, casas = 2) =>
  menos(n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }));
const cotaTxt = (c: number) => `${num(c)} m`;

type Fase = ContencaoMemorial["fases"][number];

/** Contorno do vazio da escavação. Sempre 6 vértices, para a forma se transformar entre as fases. */
function vazio(c: ContencaoMemorial, f: Fase) {
  const face = -c.estaca.diametro / 2;
  const berma = f.alturaBerma ?? 0;
  const topo = f.cotaEscavacao + berma;
  const crista = berma; // o software usa a mesma medida para a distância ao coroamento do talude
  const rampa = berma && f.talude ? berma / Math.tan((f.talude * Math.PI) / 180) : 0;
  const pts: [number, number][] = [
    [X0, 0],
    [face, 0],
    [face, topo],
    [face - crista, topo],
    [face - crista - rampa, f.cotaEscavacao],
    [X0, f.cotaEscavacao],
  ];
  return `M${pts.map(([x, y]) => `${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`).join(" L")} Z`;
}

/** Só a linha entre o vazio e o solo (berma, talude e fundo), sem a borda do terreno. */
function contorno(c: ContencaoMemorial, f: Fase) {
  const face = -c.estaca.diametro / 2;
  const berma = f.alturaBerma ?? 0;
  const topo = f.cotaEscavacao + berma;
  const rampa = berma && f.talude ? berma / Math.tan((f.talude * Math.PI) / 180) : 0;
  const pts: [number, number][] = [
    [face, topo],
    [face - berma, topo],
    [face - berma - rampa, f.cotaEscavacao],
    [X0, f.cotaEscavacao],
  ];
  return `M${pts.map(([x, y]) => `${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`).join(" L")}`;
}

/* Rótulos do desenho: no celular o SVG encolhe, então o corpo do texto cresce. */
const T = {
  rotulo: "font-display font-medium text-[26px] max-lg:text-[36px] max-sm:text-[52px]",
  forte: "font-display font-semibold text-[26px] max-lg:text-[36px] max-sm:text-[52px]",
  cota: "font-display font-bold text-[28px] max-lg:text-[38px] max-sm:text-[54px]",
  camada: "font-display font-bold text-[30px] max-lg:text-[40px] max-sm:text-[56px]",
};

const linha = (f: Fase) =>
  `M${f.deslocamentos.map((d) => `${px(d.mm).toFixed(1)} ${sy(d.cota).toFixed(1)}`).join(" L")}`;
const area = (f: Fase) => {
  const a = f.deslocamentos;
  return `${linha(f)} L${px(0)} ${sy(a[a.length - 1].cota)} L${px(0)} ${sy(a[0].cota)} Z`;
};

function descricaoFase(c: ContencaoMemorial, f: Fase, i: number) {
  const escora = c.escora && i >= c.fases.findIndex((x) => x.nome === c.escora!.desdeFase);
  const partes = [];
  if (escora) partes.push(`escora na cota ${cotaTxt(c.escora!.cota)}`);
  partes.push(`escavação até ${cotaTxt(f.cotaEscavacao)}`);
  if (f.alturaBerma) partes.push(`berma de ${num(f.alturaBerma)} m junto à cortina${f.talude ? `, talude a ${num(f.talude, 0)}°` : ""}`);
  else partes.push("sem berma");
  const t = partes.join(", ");
  return t.charAt(0).toUpperCase() + t.slice(1) + ".";
}

export default function CorteCortina({ contencoes }: { contencoes: ContencaoMemorial[] }) {
  const id = useId().replace(/:/g, "");
  const [ci, setCi] = useState(0);
  const [fi, setFi] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const tocou = useRef(false);
  // A sequência começa quando o desenho (não o bloco inteiro, que é alto no celular) está na tela.
  const desenho = useRef<HTMLElement>(null);
  const visivel = useInView(desenho, { once: true, amount: 0.55 });
  const reduzir = useReducedMotion();

  // Ao entrar na tela pela primeira vez, a obra acontece sozinha: fase 1 → 2 → 3.
  // Para assim que o visitante mexe em qualquer controle.
  useEffect(() => {
    if (!visivel || reduzir) return;
    const timers = [1, 2].map((n) =>
      window.setTimeout(() => {
        if (!tocou.current) setFi(n);
      }, n * 2300),
    );
    return () => timers.forEach(clearTimeout);
  }, [visivel, reduzir]);

  const c = contencoes[ci];
  const f = c.fases[fi];
  const comEscora = c.escora ? fi >= c.fases.findIndex((x) => x.nome === c.escora!.desdeFase) : false;
  const maximo = f.deslocamentos.reduce((a, b) => (Math.abs(b.mm) > Math.abs(a.mm) ? b : a));
  const naCota = hover == null ? null : f.deslocamentos.find((d) => d.cota === hover);
  const momentoNaCota = hover == null ? null : f.momentos.find((m) => m.cota === hover);
  const d = c.estaca.diametro;

  const escolher = (fn: () => void) => {
    tocou.current = true;
    fn();
  };

  /** Ponteiro sobre qualquer um dos dois desenhos → cota mais próxima dos resultados. */
  const mover = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cota = YTOP - ((e.clientY - r.top) / r.height) * (H / K);
    const pontos = f.deslocamentos;
    if (cota > pontos[0].cota + 0.4 || cota < pontos[pontos.length - 1].cota - 0.4) return setHover(null);
    setHover(pontos.reduce((a, b) => (Math.abs(b.cota - cota) < Math.abs(a.cota - cota) ? b : a)).cota);
  };

  const botao = (ativo: boolean) =>
    `px-4 py-2.5 text-[14px] font-display font-medium border transition-colors ${
      ativo
        ? "bg-ink text-canvas border-ink"
        : "border-rule-strong text-ink-2 hover:text-ink hover:border-ink"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Contenção do memorial">
          {contencoes.map((x, i) => (
            <button
              key={x.n}
              type="button"
              aria-pressed={i === ci}
              onClick={() => escolher(() => setCi(i))}
              className={botao(i === ci)}
            >
              <span className="tabular-nums opacity-60 mr-2">{x.n}</span>
              {x.titulo.replace(/^Contenção (da |de )?/, "")}
            </button>
          ))}
        </div>
        <ol className="flex flex-wrap gap-2" aria-label="Fases da escavação">
          {c.fases.map((x, i) => (
            <li key={x.ref}>
              <button
                type="button"
                aria-pressed={i === fi}
                onClick={() => escolher(() => setFi(i))}
                className={botao(i === fi)}
              >
                <span className="tabular-nums mr-1.5">{i + 1}</span>
                {x.curto}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* O corte e os deslocamentos ficam lado a lado em qualquer largura, na mesma escala de
          profundidade: a cota tocada aparece nos dois ao mesmo tempo. */}
      <figure ref={desenho} className="mt-6">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] items-start gap-3 sm:gap-6 lg:gap-8">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-labelledby={`${id}-t ${id}-d`}
            className="block w-full h-auto select-none"
            onPointerDown={mover}
            onPointerMove={mover}
            onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
          >
            <title id={`${id}-t`}>{`Corte da ${c.titulo.toLowerCase()} na ${f.nome.toLowerCase()}`}</title>
            <desc id={`${id}-d`}>
              {`Estacas de ${num(c.estaca.comprimento)} m e ${num(d * 100, 0)} cm de diâmetro, a cada ${num(c.estaca.eixos)} m. ${descricaoFase(c, f, fi)} Nível d'água a ${cotaTxt(c.nivelAgua)}.`}
            </desc>
            <defs>
              <pattern id={`${id}-a1`} width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="5" r="1.5" fill="var(--ink)" opacity="0.2" />
                <circle cx="13" cy="13" r="1.5" fill="var(--ink)" opacity="0.2" />
              </pattern>
              <pattern id={`${id}-a2`} width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="4" r="1.6" fill="var(--ink)" opacity="0.26" />
                <circle cx="10" cy="10" r="1.6" fill="var(--ink)" opacity="0.26" />
                <circle cx="10" cy="3" r="0.9" fill="var(--ink)" opacity="0.2" />
              </pattern>
            </defs>

            {/* camadas do terreno */}
            {c.camadas.map((cam, i) => {
              const base = c.camadas[i + 1]?.topo ?? YBOT;
              return (
                <g key={cam.nome}>
                  <rect x={0} y={sy(cam.topo)} width={W} height={sy(base) - sy(cam.topo)} fill={i ? "var(--solo-2)" : "var(--solo-1)"} />
                  <rect x={0} y={sy(cam.topo)} width={W} height={sy(base) - sy(cam.topo)} fill={`url(#${id}-a${i ? 2 : 1})`} />
                  <text x={W - 24} y={sy(cam.topo) + (i ? 150 : 120)} textAnchor="end" className={`fill-ink ${T.camada}`}>
                    {cam.nome}
                  </text>
                </g>
              );
            })}
            <line x1={0} x2={W} y1={sy(c.camadas[1]?.topo ?? 0)} y2={sy(c.camadas[1]?.topo ?? 0)} stroke="var(--rule-strong)" strokeWidth="2" />

            {/* nível d'água */}
            <line x1={0} x2={W} y1={sy(c.nivelAgua)} y2={sy(c.nivelAgua)} stroke="var(--agua)" strokeWidth="3" />
            <path d={`M${sx(-4.1)} ${sy(c.nivelAgua) - 34} h30 l-15 26 z`} fill="var(--agua)" />
            <text x={sx(-4.1) + 40} y={sy(c.nivelAgua) - 12} className={`fill-ink ${T.forte}`}>
              {`NA ${cotaTxt(c.nivelAgua)}`}
            </text>

            {/* vazio da escavação */}
            <motion.path
              initial={false}
              animate={{ d: vazio(c, f) }}
              transition={{ duration: reduzir ? 0 : 1.1, ease: drive }}
              fill="var(--canvas)"
            />
            <motion.path
              initial={false}
              animate={{ d: contorno(c, f) }}
              transition={{ duration: reduzir ? 0 : 1.1, ease: drive }}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* sobrecarga no terreno contido */}
            {c.sobrecarga && (
              <g aria-hidden>
                {Array.from({ length: 7 }, (_, i) => sx(0.75 + i * 0.5)).map((x) => (
                  <g key={x}>
                    <line x1={x} x2={x} y1={sy(0.62)} y2={sy(0.14)} stroke="var(--ink)" strokeWidth="2" />
                    <path d={`M${x - 7} ${sy(0.2)} L${x} ${sy(0.06)} L${x + 7} ${sy(0.2)} Z`} fill="var(--ink)" />
                  </g>
                ))}
                <line x1={sx(0.75)} x2={sx(3.75)} y1={sy(0.62)} y2={sy(0.62)} stroke="var(--ink)" strokeWidth="2" />
                <text x={W - 20} y={sy(0.62) - 14} textAnchor="end" className={`fill-ink-2 ${T.rotulo}`}>
                  {`q = ${c.sobrecarga}`}
                </text>
              </g>
            )}

            {/* estaca */}
            <rect x={sx(-d / 2)} y={sy(0)} width={d * K} height={c.estaca.comprimento * K} fill="var(--ink)" />

            {/* escora */}
            {c.escora && (
              <motion.g
                initial={false}
                animate={{ opacity: comEscora ? 1 : 0 }}
                transition={{ duration: reduzir ? 0 : 0.5 }}
                aria-hidden
              >
                <motion.rect
                  initial={false}
                  animate={{ width: comEscora ? sx(-d / 2) - sx(X0 + 0.35) : 0, x: comEscora ? sx(X0 + 0.35) : sx(-d / 2) }}
                  transition={{ duration: reduzir ? 0 : 0.9, ease: drive }}
                  y={sy(c.escora.cota) - 2}
                  height="20"
                  fill="var(--serie)"
                />
                <text x={sx(X0 + 0.35)} y={sy(c.escora.cota) - 18} className={`fill-ink ${T.forte}`}>
                  {`Escora · cota ${cotaTxt(c.escora.cota)}`}
                </text>
              </motion.g>
            )}

            {/* cota de escavação */}
            <motion.g initial={false} animate={{ y: sy(f.cotaEscavacao) }} transition={{ duration: reduzir ? 0 : 1.1, ease: drive }}>
              <path d={`M${sx(X0 + 0.35)} -24 h30 l-15 24 z`} fill="var(--ink)" />
              <text x={sx(X0 + 0.35) + 42} y={-4} className={`fill-ink ${T.cota}`}>
                {cotaTxt(f.cotaEscavacao)}
              </text>
            </motion.g>
            <text x={sx(0.75)} y={sy(0) + 44} className={`fill-ink-2 ${T.rotulo}`}>
              Térreo 0,00
            </text>

            {/* comprimento e diâmetro da estaca */}
            <g aria-hidden className="text-ink">
              <line x1={sx(0.55)} x2={sx(0.55)} y1={sy(-0.9)} y2={sy(-c.estaca.comprimento)} stroke="currentColor" strokeWidth="1.5" />
              <line x1={sx(0.45)} x2={sx(0.65)} y1={sy(-c.estaca.comprimento)} y2={sy(-c.estaca.comprimento)} stroke="currentColor" strokeWidth="1.5" />
              <text
                x={sx(0.55) + 30}
                y={sy(-c.estaca.comprimento * 0.78)}
                className={`fill-ink ${T.cota} max-sm:hidden`}
                transform={`rotate(-90 ${sx(0.55) + 30} ${sy(-c.estaca.comprimento * 0.78)})`}
                textAnchor="middle"
              >
                {`${num(c.estaca.comprimento)} m · Ø ${num(d * 100, 0)} cm`}
              </text>
              <text
                x={sx(0.55) + 34}
                y={sy(-c.estaca.comprimento * 0.78)}
                className={`fill-ink ${T.cota} sm:hidden`}
                transform={`rotate(-90 ${sx(0.55) + 34} ${sy(-c.estaca.comprimento * 0.78)})`}
                textAnchor="middle"
              >
                {`${num(c.estaca.comprimento)} m`}
              </text>
            </g>

            {hover != null && (
              <line x1={0} x2={W} y1={sy(hover)} y2={sy(hover)} stroke="var(--serie)" strokeWidth="2" />
            )}
          </svg>

            <svg
              viewBox={`0 0 ${PW} ${H}`}
              role="img"
              aria-label={`Deslocamento horizontal da cortina ao longo da profundidade, ${c.titulo.toLowerCase()}; a fase selecionada em laranja e as outras em cinza`}
              className="block w-full h-auto select-none"
              onPointerDown={mover}
              onPointerMove={mover}
              onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
            >
              {[0, 5, 10, 15, 20].map((v) => (
                <g key={v}>
                  <line x1={px(-v)} x2={px(-v)} y1={sy(0)} y2={sy(-c.estaca.comprimento)} stroke="var(--rule)" strokeWidth="1.5" />
                  <text
                    x={px(-v)}
                    y={sy(-c.estaca.comprimento) + 44}
                    textAnchor="middle"
                    className={`fill-ink-3 tabular-nums text-[24px] max-lg:text-[34px] max-sm:text-[54px] ${v % 10 ? "max-sm:hidden" : ""}`}
                  >
                    {v ? `−${v}` : "0"}
                  </text>
                </g>
              ))}
              <text x={px(-DMAX / 2)} y={sy(-c.estaca.comprimento) + 84} textAnchor="middle" className="fill-ink-2 font-display font-medium text-[24px] max-lg:text-[30px] max-sm:hidden">
                deslocamento (mm)
              </text>
              <text x={px(-DMAX / 2)} y={sy(-c.estaca.comprimento) + 104} textAnchor="middle" className="fill-ink-2 font-display font-medium text-[54px] sm:hidden">
                mm
              </text>
              <line x1={px(0)} x2={px(0)} y1={sy(0)} y2={sy(-c.estaca.comprimento)} stroke="var(--ink)" strokeWidth="3" />

              {c.fases.map((g, i) =>
                i === fi ? null : (
                  <motion.path
                    key={g.ref}
                    initial={false}
                    animate={{ d: linha(g) }}
                    transition={{ duration: reduzir ? 0 : 0.9, ease: drive }}
                    fill="none"
                    stroke="var(--ink-3)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                ),
              )}
              <motion.path
                initial={false}
                animate={{ d: area(f) }}
                transition={{ duration: reduzir ? 0 : 0.9, ease: drive }}
                fill="var(--serie)"
                fillOpacity="0.12"
              />
              <motion.path
                initial={false}
                animate={{ d: linha(f) }}
                transition={{ duration: reduzir ? 0 : 0.9, ease: drive }}
                fill="none"
                stroke="var(--serie)"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <motion.circle
                initial={false}
                animate={{ cx: px(maximo.mm), cy: sy(maximo.cota) }}
                transition={{ duration: reduzir ? 0 : 0.9, ease: drive }}
                r="8"
                fill="var(--serie)"
                stroke="var(--canvas)"
                strokeWidth="4"
              />
              {hover != null && (
                <line x1={PL - 10} x2={PW - PR + 10} y1={sy(hover)} y2={sy(hover)} stroke="var(--serie)" strokeWidth="2" />
              )}
            </svg>
        </div>

        <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] md:gap-6 lg:gap-8">
          <figcaption className="text-[15px] leading-relaxed text-ink-2">
            <span className="font-display font-semibold text-ink">{f.nome.replace(" - ", " · ")}.</span>{" "}
            {descricaoFase(c, f, fi)}
          </figcaption>

          <div className="border-t-2 border-ink pt-4" aria-live="polite">
            <p className="font-display font-bold text-[clamp(1.6rem,2.4vw,2.1rem)] leading-none tracking-[-0.02em] text-ink">
              {num(naCota ? naCota.mm : maximo.mm)}&nbsp;mm
            </p>
            <p className="mt-2 text-[14px] leading-snug text-ink-2">
              {naCota
                ? `deslocamento na cota ${cotaTxt(naCota.cota)} · momento ${num(momentoNaCota?.v ?? 0)} kN·m/m`
                : `deslocamento máximo na ${f.nome.replace(/^Fase \d - /, "fase de ").toLowerCase()}, na cota ${cotaTxt(maximo.cota)}`}
            </p>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-3">
              <span className="inline-block h-[3px] w-5 bg-[var(--serie)]" aria-hidden /> fase selecionada
              <span className="ml-3 inline-block h-[2px] w-5 bg-ink-3" aria-hidden /> outras fases
            </p>
          </div>
        </div>
      </figure>

      <div className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-3">
        {c.estabilidade.map((k) => {
          const faseFs = k.fases[fi] ?? k.fases[0];
          const atual = faseFs.fs;
          const escala = (v: number) => 8 + (Math.min(v, 3.6) / 3.6) * 384;
          return (
            <div key={k.criterio} className="border-t border-rule-strong pt-4">
              <p className="text-[14px] font-display font-semibold text-ink" title={k.criterio}>
                {k.curto}
              </p>
              <svg viewBox="0 0 400 40" className="mt-3 block w-full h-auto" aria-hidden>
                <line x1="8" x2="392" y1="20" y2="20" stroke="var(--rule-strong)" strokeWidth="2" />
                <line x1={escala(k.minimo)} x2={escala(k.minimo)} y1="4" y2="36" stroke="var(--ink)" strokeWidth="3" />
                {k.fases.map((g, i) =>
                  i === fi ? null : <circle key={g.fase} cx={escala(g.fs)} cy="20" r="6" fill="var(--ink-3)" stroke="var(--canvas)" strokeWidth="3" />,
                )}
                <motion.circle
                  initial={false}
                  animate={{ cx: escala(atual) }}
                  transition={{ duration: reduzir ? 0 : 0.7, ease: drive }}
                  cy="20"
                  r="9"
                  fill="var(--serie)"
                  stroke="var(--canvas)"
                  strokeWidth="3"
                />
              </svg>
              <p className="mt-2 flex items-baseline justify-between gap-3 text-[14px] text-ink-2">
                <span>
                  {/* como o memorial escreve: 2,26 e não 2,260; mínimo 2 e não 2,0 */}
                  <strong className="font-display font-bold text-[17px] text-ink">{faseFs.texto}</strong>{" "}
                  · mínimo {k.minimoTexto}
                </span>
                <span className="inline-flex items-center gap-1 font-display font-semibold text-ink">
                  <Check size={15} strokeWidth={2.6} className="text-[var(--serie)]" aria-hidden />
                  {atual >= k.minimo ? "atende" : "não atende"}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <details className="mt-8 group">
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[14px] font-display font-semibold text-ink hover:text-brand-ink [&::-webkit-details-marker]:hidden">
          <ChevronDown size={16} aria-hidden className="transition-transform duration-300 group-open:rotate-180" />
          Ver os números da {f.nome.toLowerCase().replace(" - ", ": ")}
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full max-w-xl text-[14px] tabular-nums">
            <caption className="sr-only">{`Deslocamentos e momentos por cota — ${c.titulo}, ${f.nome}`}</caption>
            <thead>
              <tr className="text-left text-ink-3 border-b border-rule-strong">
                <th className="py-2 pr-6 font-display font-semibold">Cota (m)</th>
                <th className="py-2 pr-6 font-display font-semibold text-right">Deslocamento (mm)</th>
                <th className="py-2 font-display font-semibold text-right">Momento (kN·m/m)</th>
              </tr>
            </thead>
            <tbody>
              {f.deslocamentos.map((p, i) => (
                <tr key={p.cota} className="border-b border-rule">
                  <td className="py-1.5 pr-6">{num(p.cota)}</td>
                  <td className="py-1.5 pr-6 text-right">{num(p.mm)}</td>
                  <td className="py-1.5 text-right">{num(f.momentos[i].v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
