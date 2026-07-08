/* sheet.js — detail sheet deslizable. Muestra las dos capas:
   1) energía pura (siempre)  2) matiz del mazo activo (si lo hay).
   Navegación prev/next dentro de la lista visible + teclado (flechas, Escape). */

import { buildCard, SUITS, cardMark, cardName, deckCardName } from "./deck.js";
import { writeHash, currentView } from "./router.js";
import { pick, pickList, t } from "./i18n.js";
import { lockScroll, unlockScroll } from "./scroll-lock.js";
import { isFav, toggleFav, getNote, setNote } from "./store.js";

const overlay = document.getElementById("overlay");
const sheet = document.getElementById("sheet");

let ctx = { deckData: null, listIds: [] };
let currentId = null;
let returnHash = "glosario/arcanos"; // a dónde volver al cerrar (la vista de origen)

// La vista Arcanos se suscribe para re-renderizar cuando cambian los favoritos
// (útil si el filtro ♥ está activo mientras se abre una carta).
let favListener = null;
export function onFavChange(fn) { favListener = fn; }
function notifyFav() { if (favListener) favListener(); }

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
      ${esc(t("sheet.imageSoon"))}
    </span>
    <img class="card-art-img" src="${esc(c.image)}" alt="${esc(cardName(c))}" loading="lazy" width="600" height="1050">
  </div>`;
}

/* Construye el bloque de la capa del mazo según los campos que existan. */
function deckLayerHTML(c) {
  if (c.layer !== "deck") return "";
  const name = c.name || (c.deck && c.deck.name) || "Mazo";
  // El nombre del ser (yokai_name) ya va en el encabezado; aquí solo el kanji como deco.
  const head = c.yokai_kanji
    ? `<div class="deck-yokai"><span class="kanji">${esc(c.yokai_kanji)}</span></div>`
    : "";
  // Yōkai y RWS exponen distintos campos; pick() elige idioma (base = EN, *_es = ES).
  // Para el Yōkai: deck_resumen/deck_sombra ahora tienen base EN + *_es; deck_story EN + deck_story_es.
  const body = [
    field(t("sheet.deckNuance"), pick(c, "deck_nuance") || pick(c, "deck_resumen")),
    field(t("sheet.deckStory"), pick(c, "deck_story"), "en"),
    field(t("sheet.deckShadow"), pick(c, "deck_sombra"), "italic"),
  ].join("");
  const art = cardArtHTML(c);
  if (!head && !body && !art) return "";
  return `<div class="deck-layer"><div class="layer-tag">✦ ${esc(name)}</div>${art}${head}${body}</div>`;
}

function render(c) {
  const suit = SUITS[c.group];
  const subtitle = c.group === "major"
    ? `${t("sheet.majorArcanum")} · ${c.roman}`
    : t("suit." + c.group);
  const sub2 = deckCardName(c); // nombre del ser del mazo (Yōkai); null en RWS/pura
  const kw = pickList(c, "keywords");
  const idx = ctx.listIds.indexOf(c.id);
  const hasPrev = idx > 0, hasNext = idx >= 0 && idx < ctx.listIds.length - 1;
  const fav = isFav(c.id);
  const note = getNote(c.id);
  const favLbl = t(fav ? "sheet.favOn" : "sheet.fav");

  sheet.className = "sheet " + suit.groupClass;
  sheet.innerHTML = `
    <div class="sheet-top">
      <div class="accentbar"></div>
      <div class="heads">
        <div class="num">${esc(subtitle)}</div>
        <h2>${esc(cardName(c))}</h2>
        ${sub2 ? `<div class="es-name">${esc(sub2)}</div>` : ""}
      </div>
      <div class="mark">${esc(cardMark(c))}</div>
      <button class="fav${fav ? " on" : ""}" data-fav aria-pressed="${fav}" aria-label="${esc(favLbl)}" title="${esc(favLbl)}">
        <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="M12 20.7s-7.3-4.5-9.7-9C.9 8.9 2.2 5.6 5.4 5.6c1.9 0 3.1 1.1 3.7 2.1h1.8c.6-1 1.8-2.1 3.7-2.1 3.2 0 4.5 3.3 3.1 6.1-2.4 4.5-9.7 9-9.7 9z"/></svg>
      </button>
      <button class="close" aria-label="${esc(t("sheet.close"))}" data-close>✕</button>
    </div>
    <div class="sheet-body">
      <div class="field">
        <div class="flabel">${esc(t("sheet.keywords"))}</div>
        <div class="kw">${kw.primary.map((k) => `<span>${esc(k)}</span>`).join("")}</div>
      </div>
      ${field(t("sheet.energy"), pick(c, "energy"))}
      ${field(t("sheet.shadow"), pick(c, "shadow"), "italic")}
      ${deckLayerHTML(c)}
      <button class="copybtn" data-copy>${esc(t("sheet.copy"))}</button>
      <div class="field note-field">
        <div class="flabel">${esc(t("sheet.note"))}</div>
        <textarea class="note" data-note rows="3" aria-label="${esc(t("sheet.note"))}" placeholder="${esc(t("sheet.notePlaceholder"))}">${esc(note)}</textarea>
      </div>
    </div>
    <div class="sheet-nav">
      <button data-nav="prev" ${hasPrev ? "" : "disabled"}>${esc(t("sheet.prev"))}</button>
      <button data-nav="next" ${hasNext ? "" : "disabled"}>${esc(t("sheet.next"))}</button>
    </div>`;

  sheet.querySelectorAll("[data-close]").forEach((b) =>
    b.addEventListener("click", () => closeSheet())
  );
  // Si la imagen no existe aún (404), se oculta y queda el placeholder.
  const art = sheet.querySelector(".card-art-img");
  if (art) art.addEventListener("error", () => art.classList.add("failed"));

  sheet.querySelector('[data-nav="prev"]').addEventListener("click", () => step(-1));
  sheet.querySelector('[data-nav="next"]').addEventListener("click", () => step(1));

  // Copiar: nombre + energía pura + pincelada del mazo activo. Sin sombra ni palabras
  // clave (decisión de la autora). Usa valores crudos de pick(), no el HTML escapado.
  const copyBtn = sheet.querySelector("[data-copy]");
  copyBtn.addEventListener("click", () => {
    const lines = [cardName(c), `${t("sheet.energy")}: ${pick(c, "energy")}`];
    if (c.layer === "deck") {
      const deckName = (ctx.deckData && ctx.deckData.name) || "";
      const pincelada = pick(c, "deck_nuance") || pick(c, "deck_resumen");
      if (pincelada) lines.push(deckName ? `${deckName}: ${pincelada}` : pincelada);
    }
    navigator.clipboard?.writeText(lines.join("\n")).then(() => {
      copyBtn.textContent = t("sheet.copied");
      setTimeout(() => { copyBtn.textContent = t("sheet.copy"); }, 1600);
    }).catch(() => { copyBtn.textContent = t("sheet.copyFail"); });
  });

  // Favorito (♥): alterna y refleja el estado en el botón. Persiste por arcana_id.
  const favBtn = sheet.querySelector("[data-fav]");
  favBtn.addEventListener("click", () => {
    const now = toggleFav(c.id);
    favBtn.classList.toggle("on", now);
    favBtn.setAttribute("aria-pressed", String(now));
    const lbl = t(now ? "sheet.favOn" : "sheet.fav");
    favBtn.setAttribute("aria-label", lbl);
    favBtn.setAttribute("title", lbl);
    notifyFav(); // avisa a la vista Arcanos por si el filtro ♥ está activo
  });

  // Nota personal: se guarda por arcana_id en cada tecleo (localStorage, offline).
  const noteEl = sheet.querySelector("[data-note]");
  noteEl.addEventListener("input", () => setNote(c.id, noteEl.value));

  // El #sheet no se recrea (solo su innerHTML), así que conserva el scrollTop del
  // contenido anterior. Reiniciar al tope en cada render (nueva carta, prev/next o
  // cambio de idioma) evita quedar "atascado" desplazado más allá del contenido nuevo.
  // El reset síncrono no basta: el navegador restaura el scroll del botón pulsado
  // (prev/next) tras el reflow, así que se reafirma en el siguiente frame.
  sheet.scrollTop = 0;
  requestAnimationFrame(() => { sheet.scrollTop = 0; });
}

function step(dir) {
  const idx = ctx.listIds.indexOf(currentId);
  const next = ctx.listIds[idx + dir];
  if (next) openSheet(next);
}

function onKey(e) {
  if (!isOpen()) return;
  if (e.key === "Escape") return closeSheet();
  // Mientras se escribe una nota, las flechas mueven el cursor, no navegan cartas.
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "textarea" || tag === "input") return;
  if (e.key === "ArrowLeft") step(-1);
  else if (e.key === "ArrowRight") step(1);
}

export function openSheet(arcanaId) {
  const c = buildCard(arcanaId, ctx.deckData);
  if (!c) return;
  // Recuerda la vista de origen solo al abrir (no en prev/next con el sheet ya abierto).
  if (!isOpen()) {
    const h = decodeURIComponent(location.hash.slice(1));
    returnHash = h && !/^arcano\//.test(h) ? h : currentView();
  }
  const wasOpen = isOpen();
  currentId = arcanaId;
  render(c);
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  // Solo bloquea en la transición cerrado→abierto; prev/next llaman openSheet con
  // el sheet ya abierto y no deben incrementar el contador de bloqueo.
  if (!wasOpen) lockScroll();
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
  unlockScroll();
  document.removeEventListener("keydown", onKey);
  currentId = null;
  writeHash(returnHash || "glosario/arcanos");
}

// Cerrar al tocar el scrim
overlay.querySelector(".scrim").addEventListener("click", () => closeSheet());
