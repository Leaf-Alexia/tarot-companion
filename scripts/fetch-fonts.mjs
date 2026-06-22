/* fetch-fonts.mjs — descarga Spectral + Mulish (woff2, subsets latin + latin-ext)
   a assets/fonts/ y genera css/fonts.css con @font-face apuntando a archivos locales.
   Cumple la regla offline: nada se carga por CDN en runtime.
   Uso: node scripts/fetch-fonts.mjs */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_DIR = resolve(ROOT, "assets/fonts");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const CSS_URL =
  "https://fonts.googleapis.com/css2?" +
  "family=Spectral:ital,wght@0,400;0,500;0,600;1,400&" +
  "family=Mulish:wght@400;500;600;700&display=swap";

const KEEP = new Set(["latin", "latin-ext"]); // subsets que necesitamos (ES + ō)

const slug = (fam, weight, style) =>
  `${fam.toLowerCase()}-${weight}${style === "italic" ? "i" : ""}`;

async function main() {
  await mkdir(FONT_DIR, { recursive: true });
  const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();

  // Parte el CSS en bloques precedidos por su comentario de subset: /* latin */
  const blocks = css.split(/\/\*\s*([\w-]+)\s*\*\//).slice(1);
  const faces = [];
  for (let i = 0; i < blocks.length; i += 2) {
    const subset = blocks[i].trim();
    const body = blocks[i + 1] || "";
    if (!KEEP.has(subset)) continue;
    const fam = (body.match(/font-family:\s*'([^']+)'/) || [])[1];
    const weight = (body.match(/font-weight:\s*(\d+)/) || [])[1];
    const style = (body.match(/font-style:\s*(\w+)/) || [])[1];
    const url = (body.match(/url\(([^)]+)\)/) || [])[1];
    const range = (body.match(/unicode-range:\s*([^;]+);/) || [])[1];
    if (fam && url) faces.push({ subset, fam, weight, style, url, range });
  }

  const out = [];
  for (const f of faces) {
    const file = `${slug(f.fam, f.weight, f.style)}-${f.subset}.woff2`;
    const buf = Buffer.from(
      await (await fetch(f.url, { headers: { "User-Agent": UA } })).arrayBuffer()
    );
    await writeFile(resolve(FONT_DIR, file), buf);
    out.push({ ...f, file });
    console.log(`✓ ${file} (${buf.length} bytes)`);
  }

  const cssOut =
    "/* fonts.css — generado por scripts/fetch-fonts.mjs. Fuentes auto-hospedadas (offline). */\n" +
    out
      .map(
        (f) => `@font-face {
  font-family: '${f.fam}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url(../assets/fonts/${f.file}) format('woff2');
  unicode-range: ${f.range};
}`
      )
      .join("\n");
  await writeFile(resolve(ROOT, "css/fonts.css"), cssOut + "\n");
  console.log(`\nWrote css/fonts.css with ${out.length} @font-face rules.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
