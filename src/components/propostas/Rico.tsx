/**
 * Texto das cláusulas com **negrito** (a marcação de dados/proposta.mjs).
 * CNPJ e valores em reais não quebram no meio, como no PDF.
 */
export default function Rico({ t }: { t: string }) {
  return (
    <>
      {t.split(/(\*\*[^*]+\*\*)/).map((parte, i) => {
        const negrito = parte.startsWith("**") && parte.endsWith("**");
        const texto = negrito ? parte.slice(2, -2) : parte;
        const pedacos = texto.split(/(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|R\$ [\d.,]*\d)/).map((p, j) =>
          j % 2 ? (
            <span key={j} className="whitespace-nowrap">
              {p}
            </span>
          ) : (
            p
          ),
        );
        return negrito ? (
          <strong key={i} className="font-semibold text-ink">
            {pedacos}
          </strong>
        ) : (
          <span key={i}>{pedacos}</span>
        );
      })}
    </>
  );
}
