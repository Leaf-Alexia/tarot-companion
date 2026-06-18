/* i18n.js — idioma del CONTENIDO de carta (energía, sombra, keywords, matiz).
   No traduce el chrome de la UI (labels, vistas estáticas): eso sigue en español.
   Con `_es` vacío, "es" cae a "en" como fallback, así nada queda en blanco. */

import { getLang as storedLang, setLang as persistLang } from "./store.js";

let lang = storedLang(); // "es" | "en"
const listeners = new Set();

export function getLang() { return lang; }

export function setLang(next) {
  if (next !== "es" && next !== "en") return;
  if (next === lang) return;
  lang = next;
  persistLang(lang);
  listeners.forEach((fn) => fn(lang));
}

/* Suscribe un callback que se ejecuta al cambiar de idioma (para re-render). */
export function onLangChange(fn) { listeners.add(fn); }

/* Devuelve el campo `base` en el idioma activo, con fallback al otro idioma.
   pick(card, "energy")  -> energy_es || energy   (si lang === "es")
                         -> energy || energy_es    (si lang === "en") */
export function pick(card, base) {
  const es = card[base + "_es"];
  const en = card[base];
  return lang === "es" ? (es || en || "") : (en || es || "");
}

/* Igual que pick pero para arreglos (keywords): keywords_es / keywords_en. */
export function pickList(card, base) {
  const es = card[base + "_es"];
  const en = card[base + "_en"];
  const primary = lang === "es" ? es : en;
  const secondary = lang === "es" ? en : es;
  return { primary: primary || secondary || [], secondary: (primary ? secondary : null) || [] };
}
