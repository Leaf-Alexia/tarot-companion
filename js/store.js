/* store.js — abstracción de persistencia (hoy localStorage; mañana IndexedDB si crece).
   Todo va envuelto en try/catch: en modo privado o sin permisos no debe romper la app. */

const K_DECK = "tc-active-deck";
const K_DAILY = "tc-daily";
const K_DAILY_SEEN = "tc-daily-seen";
const K_LANG = "tc-lang";
const K_THEME = "tc-theme";

const todayStr = () => new Date().toLocaleDateString("sv"); // YYYY-MM-DD local

export function getActiveDeckId() {
  try { return localStorage.getItem(K_DECK) || null; } catch { return null; }
}

export function setActiveDeckId(id) {
  try {
    if (id) localStorage.setItem(K_DECK, id);
    else localStorage.removeItem(K_DECK);
  } catch { /* sin persistencia: la sesión sigue en memoria */ }
}

/* Idioma del contenido de carta (es | en). Default: es (público hispanohablante). */
export function getLang() {
  try { return localStorage.getItem(K_LANG) || "es"; } catch { return "es"; }
}
export function setLang(lang) {
  try { localStorage.setItem(K_LANG, lang); } catch { /* sin persistencia */ }
}

/* Tema visual (dark | light). Default: dark (identidad de marca). */
export function getTheme() {
  try { return localStorage.getItem(K_THEME) || "dark"; } catch { return "dark"; }
}
export function setTheme(theme) {
  try { localStorage.setItem(K_THEME, theme); } catch { /* sin persistencia */ }
}

/* Carta del día: misma carta durante todo el día natural. Se persiste el id. */
export function getDailyId(allIds) {
  if (!allIds.length) return null;
  const today = todayStr();
  let rec = null;
  try { rec = JSON.parse(localStorage.getItem(K_DAILY) || "null"); } catch { /* noop */ }
  if (!rec || rec.d !== today || !allIds.includes(rec.id)) {
    rec = { d: today, id: allIds[Math.floor(Math.random() * allIds.length)] };
    try { localStorage.setItem(K_DAILY, JSON.stringify(rec)); } catch { /* noop */ }
  }
  return rec.id;
}

/* ¿La usuaria ya reveló la carta de hoy? La carta no se asigna sola: se elige
   al revelar (getDailyId) y queda fijada el resto del día. */
export function isDailyRevealed() {
  try { return localStorage.getItem(K_DAILY_SEEN) === todayStr(); } catch { return false; }
}
export function setDailyRevealed() {
  try { localStorage.setItem(K_DAILY_SEEN, todayStr()); } catch { /* sin persistencia */ }
}
