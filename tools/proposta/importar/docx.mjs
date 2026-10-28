/**
 * Leitor de Word (.docx) sem dependência de Word: devolve os blocos do documento em ordem —
 * parágrafos (com a numeração automática já resolvida, negrito/itálico/destaque amarelo e imagens)
 * e tabelas. Serve para conferir o PDF contra o Word da proposta (verificar.mjs) e para ler de
 * volta o Word editado pela equipe.
 *
 *   node importar/docx.mjs "<proposta>.docx"      → imprime o texto, uma linha por bloco
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import JSZip from "jszip";

const xmlParaTexto = (t) => t.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const letras = (n) => {
  let s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(97 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
};
const formata = (fmt, v) =>
  fmt === "lowerLetter" ? letras(v) : fmt === "upperLetter" ? letras(v).toUpperCase() : fmt === "bullet" ? "•" : String(v);

/** Lê as definições de numeração (listas) e devolve rotulo(numId, ilvl) → "1.1." / "a)" / "•". */
function numeracao(xml) {
  const abstratos = {};
  for (const a of xml.matchAll(/<w:abstractNum [^>]*w:abstractNumId="(\d+)"[^>]*>([\s\S]*?)<\/w:abstractNum>/g)) {
    const niveis = {};
    for (const l of a[2].matchAll(/<w:lvl [^>]*w:ilvl="(\d+)"[^>]*>([\s\S]*?)<\/w:lvl>/g)) {
      niveis[l[1]] = {
        inicio: Number(/<w:start w:val="(\d+)"/.exec(l[2])?.[1] ?? 1),
        fmt: /<w:numFmt w:val="([^"]+)"/.exec(l[2])?.[1] ?? "decimal",
        texto: /<w:lvlText w:val="([^"]*)"/.exec(l[2])?.[1] ?? "",
      };
    }
    abstratos[a[1]] = niveis;
  }
  const nums = {};
  for (const n of xml.matchAll(/<w:num [^>]*w:numId="(\d+)"[^>]*>([\s\S]*?)<\/w:num>/g)) {
    const over = {};
    for (const o of n[2].matchAll(/<w:lvlOverride w:ilvl="(\d+)">[\s\S]*?<w:startOverride w:val="(\d+)"/g)) over[o[1]] = Number(o[2]);
    nums[n[1]] = { abstrato: /<w:abstractNumId w:val="(\d+)"/.exec(n[2])?.[1], over };
  }
  const contadores = {};
  return (numId, ilvl) => {
    const n = nums[numId];
    if (!n) return "";
    const niv = abstratos[n.abstrato] ?? {};
    const c = (contadores[numId] ??= {});
    const ini = (k) => n.over[k] ?? niv[k]?.inicio ?? 1;
    c[ilvl] = c[ilvl] == null ? ini(ilvl) : c[ilvl] + 1;
    for (const k of Object.keys(c)) if (Number(k) > ilvl) delete c[k];
    for (let k = 0; k < ilvl; k++) if (c[k] == null) c[k] = ini(k);
    const def = niv[ilvl];
    if (!def) return "";
    if (def.fmt === "bullet") return "•";
    return def.texto.replace(/%(\d)/g, (_, d) => formata(niv[Number(d) - 1]?.fmt ?? "decimal", c[Number(d) - 1] ?? 1));
  };
}

/** Trechos de texto de um parágrafo, com as marcas de formatação de cada trecho. */
function trechos(p, alvo) {
  const out = [];
  for (const r of p.matchAll(/<w:r[ >][\s\S]*?<\/w:r>/g)) {
    const rp = /<w:rPr>([\s\S]*?)<\/w:rPr>/.exec(r[0])?.[1] ?? "";
    const marca = {
      b: /<w:b\/>|<w:b w:val="(1|true)"/.test(rp),
      i: /<w:i\/>|<w:i w:val="(1|true)"/.test(rp),
      rev: /<w:highlight w:val="yellow"/.test(rp),
    };
    let texto = "";
    for (const t of r[0].matchAll(/<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g)) {
      if (t[1] != null) texto += xmlParaTexto(t[1]);
      else if (t[0] === "<w:tab/>") texto += "\t";
      else texto += "\n";
    }
    const img = /<a:blip [^>]*?r:embed="([^"]+)"/.exec(r[0]);
    if (img) {
      const ext = /<wp:extent cx="(\d+)" cy="(\d+)"/.exec(r[0]);
      out.push({ imagem: alvo[img[1]], largura: ext ? Number(ext[1]) / 360000 : null, altura: ext ? Number(ext[2]) / 360000 : null });
    }
    if (texto) {
      const ult = out[out.length - 1];
      if (ult && !ult.imagem && ult.b === marca.b && ult.i === marca.i && ult.rev === marca.rev) ult.t += texto;
      else out.push({ t: texto, ...marca });
    }
  }
  return out;
}

/**
 * @param {Buffer} buffer  o .docx
 * @returns {Promise<{blocos: object[], zip: JSZip}>}
 *   blocos: { tipo: "p", estilo, jc, num?, nivel?, quebra?, runs[] } | { tipo: "tabela", linhas[][] } | { tipo: "secao" }
 */
export async function lerDocx(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml").async("string");
  const rels = await zip.file("word/_rels/document.xml.rels").async("string");
  const alvo = {};
  for (const m of rels.matchAll(/<Relationship [^>]*?Id="([^"]+)"[^>]*?Target="([^"]+)"/g)) alvo[m[1]] = m[2];
  for (const m of rels.matchAll(/<Relationship [^>]*?Target="([^"]+)"[^>]*?Id="([^"]+)"/g)) alvo[m[2]] = m[1];
  const rotulo = numeracao(zip.file("word/numbering.xml") ? await zip.file("word/numbering.xml").async("string") : "");

  const corpo = /<w:body>([\s\S]*)<\/w:body>/.exec(xml)[1];
  const tabelas = [];
  const semTab = corpo.replace(/<w:tbl>[\s\S]*?<\/w:tbl>/g, (t) => {
    tabelas.push(t);
    return `<TAB ${tabelas.length - 1}/>`;
  });
  const partes = semTab.match(/<w:p[ >][\s\S]*?<\/w:p>|<TAB \d+\/>|<w:sectPr[\s\S]*?<\/w:sectPr>/g) ?? [];

  const blocos = [];
  for (const parte of partes) {
    if (parte.startsWith("<w:sectPr")) {
      blocos.push({ tipo: "secao" });
      continue;
    }
    const tab = /^<TAB (\d+)\/>$/.exec(parte);
    if (tab) {
      const linhas = [...tabelas[tab[1]].matchAll(/<w:tr[ >][\s\S]*?<\/w:tr>/g)].map((tr) =>
        [...tr[0].matchAll(/<w:tc>[\s\S]*?<\/w:tc>/g)].map((tc) =>
          [...tc[0].matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)]
            .map((p) => trechos(p[0], alvo).map((r) => r.t ?? "").join(""))
            .filter(Boolean)
            .join("\n"),
        ),
      );
      blocos.push({ tipo: "tabela", linhas });
      continue;
    }
    const ppr = /<w:pPr>([\s\S]*?)<\/w:pPr>/.exec(parte)?.[1] ?? "";
    const numId = /<w:numId w:val="(\d+)"/.exec(ppr)?.[1];
    const ilvl = /<w:ilvl w:val="(\d+)"/.exec(ppr)?.[1] ?? "0";
    blocos.push({
      tipo: "p",
      estilo: /<w:pStyle w:val="([^"]+)"/.exec(ppr)?.[1] ?? "",
      jc: /<w:jc w:val="([^"]+)"/.exec(ppr)?.[1] ?? "",
      ...(numId && numId !== "0" ? { num: rotulo(numId, ilvl), nivel: Number(ilvl) } : {}),
      ...(/<w:br w:type="page"\/>|<w:pageBreakBefore/.test(parte) ? { quebra: true } : {}),
      runs: trechos(parte, alvo),
    });
  }
  return { blocos, zip };
}

/** Texto corrido de um bloco: “1.1. texto…”; tabela = uma linha por linha da tabela, células separadas por “ | ”. */
export function textoDoBloco(b) {
  if (b.tipo === "tabela") return b.linhas.map((l) => l.join(" | ").replace(/\n/g, " ")).join("\n");
  if (b.tipo !== "p") return "";
  const t = b.runs.map((r) => r.t ?? "").join("").replace(/\s+/g, " ").trim();
  return t ? `${b.num && b.num !== "•" ? b.num + " " : ""}${t}` : "";
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href && process.argv[2]) {
  const { blocos } = await lerDocx(readFileSync(process.argv[2]));
  for (const b of blocos) {
    const t = textoDoBloco(b);
    if (t) console.log(t);
  }
}
