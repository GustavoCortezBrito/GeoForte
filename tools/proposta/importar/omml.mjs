/**
 * Equações do Word (OMML) → MathML. O Chrome desenha MathML sem biblioteca extra, então as fórmulas
 * do memorial entram no PDF como texto vetorial, na mesma identidade do restante do documento.
 * Cobre o que o memorial usa: runs, frações, índices, parênteses, somatório, acento (barra).
 */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Pequeno parser de XML: devolve { nome, attrs, filhos[] | texto }. */
function parse(xml) {
  const raiz = { nome: "#raiz", attrs: {}, filhos: [] };
  const pilha = [raiz];
  const re = /<(\/?)([\w:]+)((?:\s+[\w:]+="[^"]*")*)\s*(\/?)>|([^<]+)/g;
  for (const m of xml.matchAll(re)) {
    if (m[5] != null) {
      const topo = pilha[pilha.length - 1];
      topo.filhos.push({ texto: m[5].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"') });
    } else if (m[1]) pilha.pop();
    else {
      const attrs = Object.fromEntries([...m[3].matchAll(/([\w:]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]));
      const no = { nome: m[2], attrs, filhos: [] };
      pilha[pilha.length - 1].filhos.push(no);
      if (!m[4]) pilha.push(no);
    }
  }
  return raiz;
}

const filho = (no, nome) => no.filhos.find((f) => f.nome === nome);
const todos = (no) => no.filhos.filter((f) => f.nome);

/**
 * Texto de um <m:r>: letras viram <mi>, dígitos <mn>, o resto <mo>. Palavras (≥2 letras) ficam em um só <mi>.
 * Espaço entre número e unidade ("86,5 tf") vira um respiro fino; a barra entre unidades ("kN/cm²") fica colada.
 */
function run(no, upright) {
  const t = no.filhos.filter((f) => f.nome === "m:t").map((t) => t.filhos.map((x) => x.texto ?? "").join("")).join("");
  const out = [];
  const re = /(\d+(?:[.,]\d+)?)|([A-Za-zÀ-ÿα-ωΑ-Ω]+)|(\s+)|(.)/gu;
  let antes = ""; // tipo do token anterior: "n" número, "w" palavra, "s" espaço depois de número, "o" outro
  for (const m of t.matchAll(re)) {
    if (m[1]) {
      out.push(`<mn>${esc(m[1])}</mn>`);
      antes = "n";
    } else if (m[2]) {
      // duas ou mais letras seguidas: nome (ex.: "adm", "est"), vertical; uma letra: variável, itálico
      if (antes === "s") out.push(`<mspace width="0.3em"></mspace>`);
      if (m[2].length > 1 || upright) out.push(`<mi mathvariant="normal">${esc(m[2])}</mi>`);
      else out.push(`<mi>${esc(m[2])}</mi>`);
      antes = "w";
    } else if (m[3]) {
      antes = antes === "n" ? "s" : "o";
    } else {
      const colada = m[4] === "/" && antes === "w";
      out.push(colada ? `<mo lspace="0em" rspace="0em">/</mo>` : `<mo>${esc(m[4])}</mo>`);
      antes = "o";
    }
  }
  return out.join("");
}

function conv(no) {
  switch (no.nome) {
    case "m:oMath":
    case "m:e":
    case "m:num":
    case "m:den":
    case "m:sub":
    case "m:sup":
    case "m:lim":
      return lista(no);
    case "m:r":
      return run(no);
    case "m:sSub":
      return `<msub>${grupo(no, "m:e")}${grupo(no, "m:sub")}</msub>`;
    case "m:sSup":
      return `<msup>${grupo(no, "m:e")}${grupo(no, "m:sup")}</msup>`;
    case "m:sSubSup":
      return `<msubsup>${grupo(no, "m:e")}${grupo(no, "m:sub")}${grupo(no, "m:sup")}</msubsup>`;
    case "m:f":
      return `<mfrac>${grupo(no, "m:num")}${grupo(no, "m:den")}</mfrac>`;
    case "m:rad":
      return filho(no, "m:radPr")?.filhos.some((f) => f.nome === "m:degHide" && f.attrs["m:val"] === "1")
        ? `<msqrt>${lista(filho(no, "m:e"))}</msqrt>`
        : `<mroot>${grupo(no, "m:e")}${grupo(no, "m:deg")}</mroot>`;
    case "m:d": {
      const pr = filho(no, "m:dPr");
      const ab = pr && filho(pr, "m:begChr") ? filho(pr, "m:begChr").attrs["m:val"] ?? "(" : "(";
      const fe = pr && filho(pr, "m:endChr") ? filho(pr, "m:endChr").attrs["m:val"] ?? ")" : ")";
      const es = no.filhos.filter((f) => f.nome === "m:e").map((e) => `<mrow>${lista(e)}</mrow>`).join("<mo>,</mo>");
      return `<mrow><mo>${esc(ab)}</mo>${es}<mo>${esc(fe)}</mo></mrow>`;
    }
    case "m:acc": {
      const chr = filho(filho(no, "m:accPr") ?? { filhos: [] }, "m:chr")?.attrs["m:val"] ?? "̂";
      const marca = { "̅": "¯", "̄": "¯", "̂": "^", "̃": "~", "̇": "˙" }[chr] ?? chr;
      return `<mover accent="true">${grupo(no, "m:e")}<mo>${esc(marca)}</mo></mover>`;
    }
    case "m:bar":
      return `<mover accent="true">${grupo(no, "m:e")}<mo>¯</mo></mover>`;
    case "m:nary": {
      const pr = filho(no, "m:naryPr");
      const chr = pr && filho(pr, "m:chr") ? filho(pr, "m:chr").attrs["m:val"] : "∫";
      const subOculto = pr && filho(pr, "m:subHide")?.attrs["m:val"] === "1";
      const supOculto = pr && filho(pr, "m:supHide")?.attrs["m:val"] === "1";
      const op = `<mo>${esc(chr)}</mo>`;
      const cab = subOculto && supOculto ? op : subOculto ? `<mover>${op}${grupo(no, "m:sup")}</mover>` : supOculto ? `<munder>${op}${grupo(no, "m:sub")}</munder>` : `<munderover>${op}${grupo(no, "m:sub")}${grupo(no, "m:sup")}</munderover>`;
      return `<mrow>${cab}<mrow>${lista(filho(no, "m:e"))}</mrow></mrow>`;
    }
    case "m:func":
      return `<mrow>${lista(filho(no, "m:fName"))}${lista(filho(no, "m:e"))}</mrow>`;
    case "m:groupChr":
    case "m:box":
      return lista(filho(no, "m:e"));
    default:
      // propriedades (m:*Pr, w:rPr…) e o que não tem representação: ignora
      return /Pr$/.test(no.nome) || no.nome.startsWith("w:") ? "" : lista(no);
  }
}
const lista = (no) => (no ? todos(no).map(conv).join("") : "");
const grupo = (no, nome) => `<mrow>${lista(filho(no, nome))}</mrow>`;

/** @param {string} xml  trecho `<m:oMath>…</m:oMath>` */
export function ommlParaMathML(xml, { bloco = false } = {}) {
  const raiz = parse(xml);
  const math = raiz.filhos[0];
  return `<math${bloco ? ' display="block"' : ""}>${lista(math)}</math>`;
}

/** Texto simples da equação (para conferência e acessibilidade). */
export function ommlTexto(xml) {
  return [...xml.matchAll(/<m:t(?:\s[^>]*)?>([^<]*)<\/m:t>/g)].map((m) => m[1]).join("");
}
