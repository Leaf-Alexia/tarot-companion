/* deck.js — carga de datos y mezcla de capas.
   Capa pura (arcana-pure.json) + matiz del mazo activo (decks/*.json) -> buildCard().
   Esta función es el núcleo del producto: la separación por capas. */

export const SUITS = {
  major:  { es: "Mayores", label: "Arcano Mayor",   groupClass: "group-major"  },
  cups:   { es: "Copas",   label: "Copas · Agua",    groupClass: "group-cups"   },
  coins:  { es: "Oros",    label: "Oros · Tierra",   groupClass: "group-coins"  },
  wands:  { es: "Bastos",  label: "Bastos · Fuego",  groupClass: "group-wands"  },
  swords: { es: "Espadas", label: "Espadas · Aire",  groupClass: "group-swords" },
};

// Orden y etiquetas de los chips de filtro de la vista Arcanos.
export const FILTERS = [
  { g: "all",    es: "Todos"   },
  { g: "major",  es: "Mayores" },
  { g: "cups",   es: "Copas"   },
  { g: "coins",  es: "Oros"    },
  { g: "wands",  es: "Bastos"  },
  { g: "swords", es: "Espadas" },
];

let PURE = [];                 // arreglo de la capa pura, en orden
const PURE_BY_ID = new Map();  // id -> carta pura
const DECK_CACHE = new Map();  // deckId -> datos del mazo (con índice de cartas)

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

/* Carga la capa pura una sola vez. */
export async function loadPure() {
  if (PURE.length) return PURE;
  PURE = await getJSON("data/arcana-pure.json");
  PURE_BY_ID.clear();
  PURE.forEach((c) => PURE_BY_ID.set(c.id, c));
  return PURE;
}

/* Carga (y cachea) los datos de un mazo, indexando sus cartas por arcana_id. */
export async function loadDeck(deckId) {
  if (!deckId) return null;
  if (DECK_CACHE.has(deckId)) return DECK_CACHE.get(deckId);
  const data = await getJSON(`data/decks/${deckId}.json`);
  data._byArcana = new Map(data.cards.map((c) => [c.arcana_id, c]));
  DECK_CACHE.set(deckId, data);
  return data;
}

export function getPure() { return PURE; }
export function getPureById(id) { return PURE_BY_ID.get(id) || null; }

/* Mezcla las capas en runtime. Sin mazo => solo energía pura. */
export function buildCard(arcanaId, deckData = null) {
  const pure = PURE_BY_ID.get(arcanaId);
  if (!pure) return null;
  if (!deckData) return { ...pure, layer: "pure" };
  const deckCard = deckData._byArcana.get(arcanaId);
  if (!deckCard) return { ...pure, layer: "pure" }; // el mazo no cubre esta carta
  return { ...pure, ...deckCard, deck: { id: deckData.id, name: deckData.name }, layer: "deck" };
}

/* Glifo corto para el grid: romano en Mayores, rango en Menores. */
export function cardMark(card) {
  if (card.group === "major") return card.roman;
  return card.en.split(" ")[0]; // "Ace", "2"… "Page", "Knight"…
}

/* Filtra la capa pura por grupo + búsqueda en nombres y keywords (EN/ES). */
export function filterPure({ group = "all", query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return PURE.filter((c) => {
    if (group !== "all" && c.group !== group) return false;
    if (!q) return true;
    const hay = [c.en, c.es, c.roman || "", ...c.keywords_en, ...c.keywords_es]
      .join(" ").toLowerCase();
    return hay.includes(q);
  });
}
