/* i18n.js — idioma de la app. `pick`/`pickList` para el CONTENIDO de carta
   (energía, sombra, keywords, matiz) y `t()` para el CHROME (labels de UI).
   Con `_es` vacío, "es" cae a "en" como fallback, así nada queda en blanco. */

import { getLang as storedLang, setLang as persistLang } from "./store.js";
import { UI } from "./strings.js";

let lang = storedLang(); // "es" | "en"
const listeners = new Set();

export function getLang() { return lang; }

/* Texto del chrome compartido por clave. Cae a español y, en último caso, a la clave. */
export function t(key) {
  return (UI[lang] && UI[lang][key]) ?? UI.es[key] ?? key;
}

export function setLang(next) {
  if (next !== "es" && next !== "en") return;
  if (next === lang) return;
  lang = next;
  persistLang(lang);
  listeners.forEach((fn) => fn(lang));
}

/* Suscribe un callback que se ejecuta al cambiar de idioma (para re-render). */
export function onLangChange(fn) { listeners.add(fn); }

/* Devuelve el campo `base` en el idioma activo, con fallback al otro idioma. */
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
