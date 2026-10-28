/**
 * Leitor mínimo de EMF (metarquivo do Windows): devolve os textos desenhados (com posição, cor e
 * fonte) e os retângulos preenchidos. É o que o Word guarda quando se cola uma planilha do Excel
 * como "imagem": o texto continua lá, só não é texto no documento. Serve para refazer as tabelas
 * do memorial na identidade da proposta, sem digitar nada à mão.
 */
import { pathToFileURL } from "node:url";

const REG = {
  SETTEXTCOLOR: 24,
  CREATEBRUSHINDIRECT: 39,
  SELECTOBJECT: 37,
  EXTCREATEFONTINDIRECTW: 82,
  EXTTEXTOUTW: 84,
  BITBLT: 76,
  RECTANGLE: 43,
};

/** @param {Buffer} b */
export function lerEmf(b) {
  const textos = [];
  const fills = [];
  const fontes = {};
  const pinceis = {};
  let cor = 0;
  let fonte = null;
  let pincel = 0xffffff;
  let off = 0;
  while (off + 8 <= b.length) {
    const tipo = b.readUInt32LE(off);
    const tam = b.readUInt32LE(off + 4);
    if (tam < 8) break;
    if (tipo === REG.SETTEXTCOLOR) cor = b.readUInt32LE(off + 8);
    else if (tipo === REG.CREATEBRUSHINDIRECT) pinceis[b.readUInt32LE(off + 8)] = b.readUInt32LE(off + 16);
    else if (tipo === REG.EXTCREATEFONTINDIRECTW) {
      fontes[b.readUInt32LE(off + 8)] = { alt: b.readInt32LE(off + 12), peso: b.readInt32LE(off + 28), italico: !!b.readUInt8(off + 32) };
    } else if (tipo === REG.SELECTOBJECT) {
      const h = b.readUInt32LE(off + 8);
      if (fontes[h]) fonte = fontes[h];
      else if (pinceis[h] != null) pincel = pinceis[h];
      else if (h === 0x80000000) pincel = 0xffffff;
      else if (h === 0x80000004) pincel = 0;
    } else if (tipo === REG.BITBLT) {
      if (b.readUInt32LE(off + 40) === 0x00f00021)
        fills.push({ x: b.readInt32LE(off + 24), y: b.readInt32LE(off + 28), w: b.readInt32LE(off + 32), h: b.readInt32LE(off + 36), cor: pincel });
    } else if (tipo === REG.RECTANGLE) {
      const [x0, y0, x1, y1] = [8, 12, 16, 20].map((o) => b.readInt32LE(off + o));
      fills.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0, cor: pincel });
    } else if (tipo === REG.EXTTEXTOUTW) {
      const x = b.readInt32LE(off + 36);
      const y = b.readInt32LE(off + 40);
      const n = b.readUInt32LE(off + 44);
      const offStr = b.readUInt32LE(off + 48);
      let s = "";
      for (let i = 0; i < n; i++) s += String.fromCharCode(b.readUInt16LE(off + offStr + i * 2));
      textos.push({ x, y, s, cor, peso: fonte?.peso ?? 400, italico: fonte?.italico ?? false });
    }
    off += tam;
  }
  return { textos, fills };
}

/** BGR do Windows → "#rrggbb". */
export const hex = (c) => "#" + [c & 255, (c >> 8) & 255, (c >> 16) & 255].map((v) => v.toString(16).padStart(2, "0")).join("");

/** Agrupa os textos em linhas (mesmo y, com tolerância) e ordena cada linha por x. */
export function linhas(textos, tol = 6) {
  const out = [];
  for (const t of [...textos].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const l = out.find((l) => Math.abs(l.y - t.y) <= tol);
    if (l) l.t.push(t);
    else out.push({ y: t.y, t: [t] });
  }
  for (const l of out) l.t.sort((a, b) => a.x - b.x);
  return out;
}

/** Cor de preenchimento (do retângulo de cor ≠ branco) que cobre o ponto, ou null. */
export function preenchimentoEm(fills, x, y) {
  let achado = null;
  for (const f of fills) if (f.w > 3 && f.h > 3 && x >= f.x && x < f.x + f.w && y >= f.y && y < f.y + f.h && f.cor !== 0xffffff) achado = f;
  return achado;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href && process.argv[2]) {
  const { readFileSync } = await import("node:fs");
  const { textos } = lerEmf(readFileSync(process.argv[2]));
  for (const l of linhas(textos).slice(0, Number(process.argv[3] ?? 20))) console.log(l.y, l.t.map((t) => `${t.x}:${t.s}`).join(" | "));
}
