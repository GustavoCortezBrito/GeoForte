import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

/** URL file:// de um arquivo em assets/ (para o HTML das páginas). */
export const asset = (p) => pathToFileURL(join(raiz, "assets", p)).href;

/** Data URI de um arquivo em assets/ (cabeçalho e rodapé do Chrome não carregam arquivos). */
const MIME = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", woff2: "font/woff2" };
export const dataUri = (p) =>
  `data:${MIME[p.split(".").pop()]};base64,${readFileSync(join(raiz, "assets", p)).toString("base64")}`;

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Texto com **negrito** → HTML escapado. */
export const md = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // sem quebra de linha dentro de CNPJ nem entre “R$” e o valor
    .replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|R\$ [\d.,]*\d/g, (m) => `<span class="nw">${m}</span>`);

/** Marca invisível usada só na 1ª passada, para achar a página de cada seção no PDF. */
export const marca = (id, ativo) => (ativo ? `<span class="toc-marca">§TOC:${id}§</span>` : "");

/** Ícone de verificação (traço SVG, sem depender de glifo de fonte). */
export const iconeOk =
  '<svg class="ic-ok" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.2 6.4 4.8 9 9.8 3.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square"/></svg>';
