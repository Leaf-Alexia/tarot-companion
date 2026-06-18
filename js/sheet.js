/* sheet.js — detail sheet deslizable. Muestra las dos capas:
   1) energía pura (siempre)  2) matiz del mazo activo (si lo hay).
   Navegación prev/next dentro de la lista visible + teclado (flechas, Escape). */

import { buildCard, SUITS, cardMark } from "./deck.js";
import { writeHash } from "./router.js";
import { pick, pickList } from "./i18n.js";

const overlay = document.getElementById("overlay");
const sheet = document.getElementById("sheet");

let ctx = { deckData: null, listIds: [] };
let currentId = null;

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function setContext({ deckData, listIds }) {
  if (deckData !== undefined) ctx.deckData = deckData;
  if (listIds !== undefined) ctx.listIds = listIds;
}

export function isOpen() { return overlay.classList.contains("open"); }

function field(label, body, cls = "") {
  if (!body) return "";
  return `<div class="field"><div class="flabel">${esc(label)}</div>
    <div class="ftext ${cls}">${esc(body)}</div></div>`;
}

/* Arte de la carta (capa de mazo). Mientras no existan las imágenes, queda
   visible el placeholder "Imagen próximamente"; el <img> lo tapa al cargar y,
   si falla (404), se oculta vía clase .failed (listener en render). */
function cardArtHTML(c) {
  if (!c.image) return "";
  return `<div class="card-art">
    <span class="card-art-ph" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
      Imagen próximamente
    </span>
    <img class="card-art-img" src="${esc(c.image)}" alt="${esc(c.en)}" loading="lazy" width="600" height="1050">
  </div>`;
}

/* Construye el bloque de la capa del mazo según los campos que existan. */
function deckLayerHTML(c) {
  if (c.layer !== "deck") return "";
  const name = c.name || (c.deck && c.deck.name) || "Mazo";
  const head = (c.yokai_kanji || c.yokai_name)
    ? `<div class="deck-yokai"><span class="kanji">${esc(c.yokai_kanji || "")}</span>
         <span class="yname">${esc(c.yokai_name || "")}</span></div>`
    : "";
  const body = [
    field("Matiz del mazo", pick(c, "deck_nuance") || c.deck_resumen),
    field("Historia del mazo", c.deck_story, "en"),
    field("Sombra del mazo", c.deck_sombra, "italic"),
  ].join("");
  const art = cardArtHTML(c);
  if (!head && !body && !art) return "";
  return `<div class="deck-layer"><div class="layer-tag">✦ ${esc(name)}</div>${art}${head}${body}</div>`;
}

function render(c) {
  const suit = SUITS[c.group];
  const subtitle = c.group === "major" ? `Arcano Mayor · ${c.roman}` : suit.label;
  const kw = pickList(c, "keywords");
  const idx = ctx.listIds.indexOf(c.id);
  const hasPrev = idx > 0, hasNext = idx >= 0 && idx < ctx.listIds.length - 1;

  sheet.className = "sheet " + suit.groupClass;
  sheet.innerHTML = `
    <div class="sheet-top">
      <div class="accentbar"></div>
      <div class="heads">
        <div class="num">${esc(subtitle)}</div>
        <h2>${esc(c.en)}</h2>
        <div class="es-name">${esc(c.es)}</div>
      </div>
      <div class="mark">${esc(cardMark(c))}</div>
      <button class="close" aria-label="Cerrar" data-close>✕</button>
    </div>
    <div class="sheet-body">
      <div class="field">
        <div class="flabel">Palabras clave</div>
        <div class="kw">${kw.primary.map((k) => `<span>${esc(k)}</span>`).join("")}</div>
        ${kw.secondary.length ? `<div class="kw en">${kw.secondary.map((k) => `<span>${esc(k)}</span>`).join("")}</div>` : ""}
      </div>
      ${field("Energía pura", pick(c, "energy"))}
      ${field("Sombra · lectura invertida", pick(c, "shadow"), "italic")}
      ${deckLayerHTML(c)}
    </div>
    <div class="sheet-nav">
      <button data-nav="prev" ${hasPrev ? "" : "disabled"}>← Anterior</button>
      <button data-nav="next" ${hasNext ? "" : "disabled"}>Siguiente →</button>
    </div>`;

  sheet.querySelectorAll("[data-close]").forEach((b) =>
    b.addEventListener("click", () => closeSheet())
  );
  // Si la imagen no existe aún (404), se oculta y queda el placeholder.
  const art = sheet.querySelector(".card-art-img");
  if (art) art.addEventListener("error", () => art.classList.add("failed"));

  sheet.querySelector('[data-nav="prev"]').addEventListener("click", () => step(-1));
  sheet.querySelector('[data-nav="next"]').addEventListener("click", () => step(1));
}

function step(dir) {
  const idx = ctx.listIds.indexOf(currentId);
  const next = ctx.listIds[idx + dir];
  if (next) openSheet(next);
}

function onKey(e) {
  if (!isOpen()) return;
  if (e.key === "Escape") closeSheet();
  else if (e.key === "ArrowLeft") step(-1);
  else if (e.key === "ArrowRight") step(1);
}

export function openSheet(arcanaId) {
  const c = buildCard(arcanaId, ctx.deckData);
  if (!c) return;
  currentId = arcanaId;
  render(c);
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", onKey);
  writeHash("arcano/" + arcanaId);
}

/* Re-renderiza la carta abierta (p. ej. al cambiar de idioma). No-op si está cerrada. */
export function refresh() {
  if (!isOpen() || !currentId) return;
  const c = buildCard(currentId, ctx.deckData);
  if (c) render(c);
}

export function closeSheet() {
  if (!isOpen()) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", onKey);
  currentId = null;
  writeHash("arcanos");
}

// Cerrar al tocar el scrim
overlay.querySelector(".scrim").addEventListener("click", () => closeSheet());
