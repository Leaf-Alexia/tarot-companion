// Migración mecánica de datos: extrae DECK/YOKAI/SOMBRA reales de yokai-tarot.html
// (evaluando el JS original, sin transcribir a mano) y genera:
//   data/arcana-pure.json  -> capa universal (energy/shadow se redactan aparte)
//   data/decks/yokai.json  -> capa de matiz del mazo Yōkai (historia, kanji, resumen, sombra)
//
// Uso: node scripts/migrate.mjs
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync(new URL("../yokai-tarot.html", import.meta.url), "utf8");
const lines = html.split(/\r?\n/);
// rango 1-indexado inclusivo -> texto
const slice = (a, b) => lines.slice(a - 1, b).join("\n");

// Bloques de datos puros del <script> (sin código que toca el DOM)
const dataSrc = [
  slice(472, 477),  // RANKS, RANK_EN, minor()
  slice(479, 767),  // DECK
  slice(770, 793),  // YOKAI
  slice(796, 875),  // SOMBRA
  slice(877, 877),  // merge: c.yk / c.yn / c.sombra
  "return { DECK, YOKAI, SOMBRA };",
].join("\n");

const { DECK } = new Function(dataSrc)();

if (DECK.length !== 78) throw new Error(`Esperaba 78 arcanos, obtuve ${DECK.length}`);

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
   .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const COURT = { 10: "page", 11: "knight", 12: "queen", 13: "king" };

// ---- arcana-pure.json (capa universal) ----
const pure = DECK.map((c) => {
  const isMajor = c.group === "major";
  let number, numerology_id, roman;
  if (isMajor) {
    number = c.rank;                 // 0–21
    numerology_id = String(c.rank);
    roman = c.roman;
  } else if (c.rank <= 9) {           // As–10
    number = c.rank + 1;             // 1–10
    numerology_id = String(c.rank + 1);
    roman = null;
  } else {                            // figuras de la corte
    number = null;
    numerology_id = COURT[c.rank];
    roman = null;
  }
  return {
    id: slugify(c.en),
    number,
    roman,
    group: c.group,
    en: c.en,
    es: c.es,
    keywords_en: c.kwEn,
    keywords_es: c.kwEs,
    energy: "",        // EN deck-agnóstico — se redacta aparte
    energy_es: "",     // ES deck-agnóstico — se redacta después del EN
    shadow: "",        // EN invertida deck-agnóstica
    shadow_es: "",     // ES invertida deck-agnóstica
    numerology_id,
  };
});

// ---- decks/yokai.json (capa de matiz: todo lo que es propio del mazo Yōkai) ----
const yokai = {
  id: "yokai",
  name: "Yōkai Tarot",
  subtitle: "The Deck of Japanese Folklore",
  theme: "yokai",
  available: true,
  credits: { art: "Marga Biazzi", text: "Paolo Bertazzo", manual: "Alejandra Carrillo" },
  cards: DECK.map((c) => ({
    arcana_id: slugify(c.en),
    image: null,                  // el manual original usa el kanji como glifo, no imagen
    yokai_name: c.yn,
    yokai_kanji: c.yk,
    deck_story: c.story,          // historia EN del yōkai (del libro)
    deck_resumen: c.resumen,      // resumen ES
    deck_sombra: c.sombra,        // lectura invertida ES (menciona al yōkai)
  })),
};

const out = (path, obj) =>
  writeFileSync(new URL(path, import.meta.url), JSON.stringify(obj, null, 2) + "\n", "utf8");

out("../data/arcana-pure.json", pure);
out("../data/decks/yokai.json", yokai);

console.log(`OK · ${pure.length} arcanos -> arcana-pure.json`);
console.log(`OK · ${yokai.cards.length} cartas -> decks/yokai.json`);
console.log("Mayores:", pure.filter((c) => c.group === "major").length);
console.log("Menores:", pure.filter((c) => c.group !== "major").length);
