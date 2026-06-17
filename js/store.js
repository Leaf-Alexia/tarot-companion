/* store.js — abstracción de persistencia (hoy localStorage; mañana IndexedDB si crece).
   Todo va envuelto en try/catch: en modo privado o sin permisos no debe romper la app. */

const K_DECK = "tc-active-deck";
const K_DAILY = "tc-daily";

export function getActiveDeckId() {
  try { return localStorage.getItem(K_DECK) || null; } catch { return null; }
}

export function setActiveDeckId(id) {
  try {
    if (id) localStorage.setItem(K_DECK, id);
    else localStorage.removeItem(K_DECK);
  } catch { /* sin persistencia: la sesión sigue en memoria */ }
}

/* Carta del día: misma carta durante todo el día natural. Se persiste el id. */
export function getDailyId(allIds) {
  if (!allIds.length) return null;
  const today = new Date().toLocaleDateString("sv"); // YYYY-MM-DD local
  let rec = null;
  try { rec = JSON.parse(localStorage.getItem(K_DAILY) || "null"); } catch { /* noop */ }
  if (!rec || rec.d !== today || !allIds.includes(rec.id)) {
    rec = { d: today, id: allIds[Math.floor(Math.random() * allIds.length)] };
    try { localStorage.setItem(K_DAILY, JSON.stringify(rec)); } catch { /* noop */ }
  }
  return rec.id;
}
