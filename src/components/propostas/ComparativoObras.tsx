interface ObraLinha {
  numero: string;
  nome: string;
  construtora: string;
  cenario: string;
  solucao: string;
  complementoTexto: string;
  complementoConfirmar: boolean;
  fotos: { etapa: string }[];
}
interface Comparativo {
  grandPalladium: { nome: string; cenario: string; solucao: string; complemento: string; contencoes: number; area: string };
  numeros: { valor: string; rotulo: string }[];
  etapas: { id: string; nome: string }[];
}

/** Quatro caixas: cheia (laranja) quando a obra tem foto da etapa. */
function Caixas({ obra, etapas }: { obra: ObraLinha; etapas: Comparativo["etapas"] }) {
  const com = etapas.filter((e) => obra.fotos.some((f) => f.etapa === e.id)).map((e) => e.nome);
  return (
    <span className="inline-flex gap-1" role="img" aria-label={com.length ? `Etapas com foto: ${com.join(", ")}` : "Sem foto de etapas"}>
      {etapas.map((e) => (
        <span key={e.id} aria-hidden title={e.nome} className={`h-3 w-3 border ${obra.fotos.some((f) => f.etapa === e.id) ? "border-brand bg-brand" : "border-ink-3"}`} />
      ))}
    </span>
  );
}

/**
 * Cada obra ao lado do Grand Palladium: cenário, solução e complemento (do briefing e das
 * cláusulas da proposta) e as etapas que as fotos registram. Mesma informação do PDF (B.2).
 */
export default function ComparativoObras({ obras, c }: { obras: ObraLinha[]; c: Comparativo }) {
  const gp = c.grandPalladium;
  return (
    <div>
      <h3 className="font-display text-[19px] font-bold text-ink">As obras e o {gp.nome}</h3>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">O que cada obra tem em comum com a expansão do resort, e o que as fotos registram.</p>

      {/* telas largas: tabela */}
      <table className="mt-6 hidden w-full text-left text-[14px] leading-snug md:table">
        <caption className="sr-only">Comparativo das obras executadas com o {gp.nome}</caption>
        <thead>
          <tr className="border-b-2 border-ink font-display text-[13px] text-ink-2">
            <th className="py-2 pr-4 font-semibold">Obra</th>
            <th className="py-2 pr-4 font-semibold">Cenário</th>
            <th className="py-2 pr-4 font-semibold">Solução</th>
            <th className="py-2 pr-4 font-semibold">Complemento</th>
            <th className="py-2 font-semibold">Etapas com foto</th>
          </tr>
        </thead>
        <tbody>
          {obras.map((o) => (
            <tr key={o.numero} className="border-b border-rule align-top">
              <td className="py-3 pr-4">
                <span className="mr-2 font-display font-bold tabular-nums text-brand-ink">{o.numero}</span>
                <b className="font-display font-bold text-ink">{o.nome}</b>
                <span className="block pl-7 text-[13px] text-ink-3">{o.construtora}</span>
              </td>
              <td className="py-3 pr-4 text-ink-2">{o.cenario}</td>
              <td className="py-3 pr-4 text-ink-2">{o.solucao}</td>
              <td className="py-3 pr-4 text-ink-2">
                {o.complementoTexto}
                {o.complementoConfirmar && <span className="block text-[12px] text-ink-3">a confirmar</span>}
              </td>
              <td className="py-3">
                <Caixas obra={o} etapas={c.etapas} />
                <span className="mt-1 block text-[12px] text-ink-3">{o.fotos.length} fotos</span>
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-ink bg-canvas-sunk align-top">
            <td className="px-0 py-3 pr-4">
              <b className="font-display font-bold text-ink">{gp.nome}</b>
              <span className="block text-[13px] text-ink-3">
                {gp.contencoes} contenções · {gp.area}
              </span>
            </td>
            <td className="py-3 pr-4 text-ink">{gp.cenario}</td>
            <td className="py-3 pr-4 text-ink">{gp.solucao}</td>
            <td className="py-3 pr-4 text-ink">{gp.complemento}</td>
            <td className="py-3 text-[12px] text-ink-3">esta proposta</td>
          </tr>
        </tbody>
      </table>

      {/* celular: um bloco por obra */}
      <ul className="mt-6 divide-y divide-rule border-t-2 border-ink md:hidden">
        {obras.map((o) => (
          <li key={o.numero} className="py-4 text-[14px] leading-snug">
            <p className="font-display text-[16px] font-bold text-ink">
              <span className="mr-2 tabular-nums text-brand-ink">{o.numero}</span>
              {o.nome}
            </p>
            <p className="mt-1 text-ink-2">{o.cenario}</p>
            <p className="mt-1 text-ink-2">
              {o.solucao} · {o.complementoTexto}
              {o.complementoConfirmar ? " (a confirmar)" : ""}
            </p>
            <p className="mt-2 flex items-center gap-3 text-[12px] text-ink-3">
              <Caixas obra={o} etapas={c.etapas} />
              {o.fotos.length} fotos
            </p>
          </li>
        ))}
        <li className="bg-canvas-sunk px-3 py-4 text-[14px] leading-snug">
          <p className="font-display text-[16px] font-bold text-ink">{gp.nome}</p>
          <p className="mt-1 text-ink">{gp.cenario}</p>
          <p className="mt-1 text-ink">
            {gp.solucao} · {gp.complemento}
          </p>
        </li>
      </ul>
      <p className="mt-3 flex items-center gap-2 text-[12px] text-ink-3">
        <span aria-hidden className="inline-flex gap-1">
          <span className="h-3 w-3 border border-brand bg-brand" />
          <span className="h-3 w-3 border border-ink-3" />
        </span>
        Etapas, em ordem: {c.etapas.map((e) => e.nome.toLowerCase()).join(" · ")}. Caixa cheia = há foto da etapa.
      </p>

      <p className="mt-8 max-w-[62ch] border-t border-rule pt-4 text-[15px] leading-relaxed text-ink-2">
        A Geoforte executa fundações desde <strong className="font-semibold text-ink">{c.numeros[0].valor}</strong>: {c.numeros[1].valor} obras executadas, {c.numeros[2].valor} de metros de estacas e {c.numeros[3].valor} equipamentos próprios.
      </p>
    </div>
  );
}
