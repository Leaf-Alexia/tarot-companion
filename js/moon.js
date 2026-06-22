/* moon.js — fase lunar calculada localmente (sin red, sin librerías).
   Aproximación por mes sinódico desde una luna nueva de referencia.
   Suficiente para mostrar la fase del día como ambientación de Inicio. */

const SYNODIC = 29.530588853;           // duración media del mes lunar (días)
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // luna nueva de referencia

const PHASES = {
  es: [
    "Luna nueva", "Luna creciente", "Cuarto creciente", "Gibosa creciente",
    "Luna llena", "Gibosa menguante", "Cuarto menguante", "Luna menguante",
  ],
  en: [
    "New moon", "Waxing crescent", "First quarter", "Waxing gibbous",
    "Full moon", "Waning gibbous", "Last quarter", "Waning crescent",
  ],
};
const GLYPHS = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

/* Devuelve { glyph, name, index } para la fecha dada. */
export function moonPhase(date = new Date(), lang = "es") {
  const days = (date.getTime() - REF_NEW_MOON) / 86400000;
  const frac = ((days % SYNODIC) + SYNODIC) % SYNODIC / SYNODIC; // 0..1 del ciclo
  const index = Math.round(frac * 8) % 8; // 0=nueva … 4=llena … 7=menguante
  const names = PHASES[lang] || PHASES.es;
  return { glyph: GLYPHS[index], name: names[index], index };
}
