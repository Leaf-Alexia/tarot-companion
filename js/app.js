/* app.js — punto de entrada. Carga datos, arma Inicio + Arcanos y conecta router + sheet. */

import {
  loadPure, loadDeck, loadDeckIndex, getPure, buildCard, cardMark, cardName, deckCardName, filterPure, SUITS, FILTERS,
} from "./deck.js";
import { getActiveDeckId, setActiveDeckId, getDailyId, getTheme } from "./store.js";
import { initRouter, onArcano, onSheetClose } from "./router.js";
import { openSheet, closeSheet, setContext, refresh as refreshSheet } from "./sheet.js";
import { initTiradas, setSpreadDeck } from "./spreads.js";
import { initNumerologia } from "./numerology.js";
import { initUso } from "./uso.js";
import { initDeckPicker, openDeckPicker } from "./decks-ui.js";
import { initSettings, open as openSettings, applyTheme } from "./settings.js";
import { onLangChange, t } from "./i18n.js";

// Mazos disponibles. La "energía pura" (id null) es la opción sin mazo y siempre
// está. El resto se carga del registro data/decks/index.json en init().
const DECK_OPTIONS = [{ id: null }]; // pure: su etiqueta se resuelve con t()

const deckLabel = (id) =>
  id == null ? t("deck.pure") : (DECK_OPTIONS.find((o) => o.id === id)?.label || t("deck.pure"));

const state = { group: "all", query: "", deckId: null, deckData: null };

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- Inicio ---------- */
function renderInicio() {
  const el = document.getElementById("view-inicio");
  el.innerHTML = `
    <div class="cover">
      <p class="kicker">${esc(t("cover.kicker"))}</p>
      <h1>Tarot<br>Companion</h1>
      <p class="sub">${esc(t("cover.sub"))}</p>
      <div class="rule"></div>
      <button class="enter" data-go="arcanos">${esc(t("cover.cta"))}</button>
    </div>`;

  el.querySelector("[data-go]").addEventListener("click", () => { location.hash = "arcanos"; });
}

/* ---------- Arcanos: controles (una vez) ---------- */
function renderArcanosShell() {
  const el = document.getElementById("view-arcanos");
  el.innerHTML = `
    <div class="controls">
      <div class="controls-top">
        <label class="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="search" type="search" placeholder="${esc(t("arcanos.search"))}" autocomplete="off" aria-label="${esc(t("arcanos.searchAria"))}">
        </label>
        <button class="deck-btn" id="deckBtn" aria-label="${esc(t("arcanos.deckAria"))}">
          <span class="db-icon">🎴</span><span class="db-name" id="deckBtnName">${esc(deckLabel(state.deckId))}</span><span class="db-caret">▾</span>
        </button>
      </div>
      <div class="chips" id="chips">
        ${FILTERS.map((f) =>
          `<button class="chip ${f.g === "all" ? "active" : ""}" data-g="${f.g}">${esc(t("filter." + f.g))}</button>`
        ).join("")}
        <button class="chip day" id="dayBtn" title="${esc(t("arcanos.dayTitle"))}">${esc(t("arcanos.day"))}</button>
      </div>
    </div>
    <div class="count" id="count"></div>
    <div class="grid" id="grid"></div>`;

  el.querySelector("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    if (b.id === "dayBtn") {
      const id = getDailyId(getPure().map((c) => c.id));
      if (id) openSheet(id);
      return;
    }
    state.group = b.dataset.g;
    el.querySelectorAll(".chip[data-g]").forEach((x) => x.classList.toggle("active", x === b));
    renderGrid();
  });
  el.querySelector("#search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderGrid();
  });
  el.querySelector("#deckBtn").addEventListener("click", () => openDeckPicker());
}

/* ---------- Arcanos: grid (según filtro + mazo) ---------- */
function renderGrid() {
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  const list = filterPure({ group: state.group, query: state.query });
  const ids = list.map((c) => c.id);
  setContext({ listIds: ids }); // para prev/next del sheet

  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const pure of list) {
    const c = buildCard(pure.id, state.deckData);
    const name = cardName(c);
    const sub = deckCardName(c); // nombre del ser del mazo (Yōkai); null si no aplica
    const btn = document.createElement("button");
    btn.className = "card " + SUITS[c.group].groupClass;
    btn.setAttribute("aria-label", sub ? `${name} · ${sub}` : name);
    btn.innerHTML = `
      <div class="mark">${esc(cardMark(c))}</div>
      ${c.yokai_kanji ? `<div class="kanji">${esc(c.yokai_kanji)}</div>` : ""}
      <div class="nm">${esc(name)}</div>
      ${sub ? `<div class="nm-sub">${esc(sub)}</div>` : ""}`;
    btn.addEventListener("click", () => openSheet(pure.id));
    frag.appendChild(btn);
  }
  grid.appendChild(frag);
  count.textContent = `${list.length} ${list.length === 1 ? t("arcanos.one") : t("arcanos.many")}`;
}

/* ---------- Selección de mazo ---------- */
async function setDeck(deckId) {
  state.deckId = deckId;
  setActiveDeckId(deckId);
  try {
    state.deckData = deckId ? await loadDeck(deckId) : null;
  } catch (err) {
    console.warn("No se pudo cargar el mazo:", err);
    state.deckData = null;
    state.deckId = null;
  }
  setContext({ deckData: state.deckData });
  // propagar el mazo activo a la tirada "Conoce tu mazo"
  setSpreadDeck({ id: state.deckId, name: state.deckData?.name || deckLabel(state.deckId) });
  // refrescar la etiqueta del botón de mazo en Arcanos
  const nameEl = document.getElementById("deckBtnName");
  if (nameEl) nameEl.textContent = deckLabel(state.deckId);
  if (document.getElementById("grid")) renderGrid();
}

/* Etiquetas del chrome del header (tabs + aria del engrane) según idioma. */
function setChromeLabels() {
  document.querySelectorAll("#tabs button").forEach((b) => {
    b.textContent = t("tab." + b.dataset.view);
  });
  const mb = document.getElementById("menuBtn");
  if (mb) mb.setAttribute("aria-label", t("menu.settingsAria"));
}

/* Re-render de Arcanos preservando filtro y búsqueda activos. */
function refreshArcanos() {
  renderArcanosShell();
  const s = document.getElementById("search");
  if (s) s.value = state.query;
  document.querySelectorAll("#chips .chip[data-g]").forEach((x) =>
    x.classList.toggle("active", x.dataset.g === state.group)
  );
  renderGrid();
}

/* Cambio de idioma: re-render de todo el chrome y las vistas. La vista activa
   no cambia (el router gestiona .active aparte; aquí solo se repinta el contenido). */
function applyLanguage() {
  setChromeLabels();
  renderInicio();
  refreshArcanos();
  initUso();
  initTiradas();
  initNumerologia();
  refreshSheet();
}

/* ---------- Init ---------- */
async function init() {
  try {
    await loadPure();
  } catch (err) {
    document.getElementById("view-arcanos").innerHTML =
      `<p class="placeholder">${esc(t("arcanos.loadError"))}</p>`;
    console.error(err);
    initRouter();
    return;
  }

  // Mazos disponibles del registro (energía pura siempre primero).
  const registry = await loadDeckIndex();
  for (const d of registry) DECK_OPTIONS.push({ id: d.id, label: d.name, subtitle: d.subtitle });

  // Selector de mazo reutilizable (Arcanos + menú) y menú de configuración.
  initDeckPicker({
    getDecks: () => DECK_OPTIONS.map((o) =>
      o.id == null
        ? { id: null, name: t("deck.pure"), subtitle: t("deck.pureSub") }
        : { id: o.id, name: o.label, subtitle: o.subtitle }
    ),
    getActiveId: () => state.deckId,
    onSelect: (id) => setDeck(id),
    onMore: () => openSettings(),
  });
  initSettings({ getActiveDeckName: () => deckLabel(state.deckId) });
  // Tema: el script anti-flash ya aplicó data-theme; sincroniza meta/persistencia.
  applyTheme(getTheme());
  // Al cambiar idioma, re-renderiza todo el chrome y las vistas.
  onLangChange(() => applyLanguage());

  setChromeLabels();
  renderInicio();
  renderArcanosShell();
  initUso();
  initTiradas();
  initNumerologia();

  // restaurar mazo activo guardado (si sigue disponible)
  const saved = getActiveDeckId();
  const validId = DECK_OPTIONS.some((o) => o.id === saved) ? saved : null;
  await setDeck(validId);

  renderGrid();

  onArcano((id) => openSheet(id));
  onSheetClose(() => closeSheet());
  initRouter();
}

document.addEventListener("DOMContentLoaded", init);

// Service Worker (offline). No bloquea el arranque si falla.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) =>
      console.warn("SW no registrado:", err)
    );
  });
}
