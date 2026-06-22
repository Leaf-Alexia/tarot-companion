/* app.js — punto de entrada. Carga datos, arma Inicio (hub) + Glosario·Arcanos
   y conecta router + sheet + sub-pestañas segmentadas. */

import {
  loadPure, loadDeck, loadDeckIndex, getPure, buildCard, cardMark, cardName, deckCardName, filterPure, SUITS, FILTERS,
} from "./deck.js";
import {
  getActiveDeckId, setActiveDeckId, getDailyId, getTheme,
  isDailyRevealed, setDailyRevealed,
} from "./store.js";
import { initRouter, onArcano, onSheetClose, onSub } from "./router.js";
import { openSheet, closeSheet, setContext, refresh as refreshSheet } from "./sheet.js";
import { initTiradas, setSpreadDeck } from "./spreads.js";
import { initNumerologia } from "./numerology.js";
import { initUso } from "./uso.js";
import { initDeckPicker, openDeckPicker } from "./decks-ui.js";
import { initSettings, open as openSettings, applyTheme } from "./settings.js";
import { onLangChange, t, pick, pickList, getLang } from "./i18n.js";
import { moonPhase } from "./moon.js";

// Mazos disponibles. La "energía pura" (id null) es la opción sin mazo y siempre
// está. El resto se carga del registro data/decks/index.json en init().
const DECK_OPTIONS = [{ id: null }]; // pure: su etiqueta se resuelve con t()

const deckLabel = (id) =>
  id == null ? t("deck.pure") : (DECK_OPTIONS.find((o) => o.id === id)?.label || t("deck.pure"));

const state = { group: "all", query: "", deckId: null, deckData: null };

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Sub-vistas dentro de cada destino segmentado. */
const SUBS = { glosario: ["arcanos", "numerologia"], tiradas: ["uso", "spreads"] };

/* ---------- Inicio · hub explorador ---------- */
function greeting() {
  const h = new Date().getHours();
  if (h < 6 || h >= 20) return t("home.greet.evening");
  if (h < 13) return t("home.greet.morning");
  return t("home.greet.afternoon");
}

/* Tarjeta de la carta del día: oculta (CTA revelar) o revelada (abre el sheet). */
function dailyCardHTML() {
  const revealed = isDailyRevealed();
  if (!revealed) {
    return `
      <div class="daily">
        <div class="daily-kicker"><span class="rule-l"></span><span class="diamond"></span>
          ${esc(t("home.dailyKicker"))}<span class="diamond"></span><span class="rule-r"></span></div>
        <div class="daily-hidden">
          <div class="medallion blank" aria-hidden="true">?</div>
          <p>${esc(t("home.dailyHidden"))}</p>
        </div>
        <button class="reveal" id="revealDaily">${esc(t("home.dailyReveal"))}</button>
      </div>`;
  }
  const id = getDailyId(getPure().map((c) => c.id));
  const c = buildCard(id, state.deckData);
  // Subtítulo: nombre del ser del mazo (Yōkai) o, si no hay, dos palabras clave.
  const sub = deckCardName(c) || pickList(c, "keywords").primary.slice(0, 2).join(" · ");
  const snippet = (pick(c, "energy") || "").split(/(?<=[.。])\s/)[0];
  return `
    <button class="daily revealed ${SUITS[c.group].groupClass}" id="dailyOpen"
            data-id="${esc(id)}" aria-label="${esc(t("home.dailyOpen"))}: ${esc(cardName(c))}">
      <div class="daily-kicker"><span class="rule-l"></span><span class="diamond"></span>
        ${esc(t("home.dailyKicker"))}<span class="diamond"></span><span class="rule-r"></span></div>
      <div class="daily-card">
        <div class="medallion">${esc(cardMark(c))}</div>
        <div class="daily-id">
          <div class="daily-name">${esc(cardName(c))}</div>
          ${sub ? `<div class="daily-sub">${esc(sub)}</div>` : ""}
        </div>
      </div>
      <p class="daily-snippet">${esc(snippet)}</p>
    </button>`;
}

function renderDaily() {
  const slot = document.getElementById("dailySlot");
  if (!slot) return;
  slot.innerHTML = dailyCardHTML();
  const rev = slot.querySelector("#revealDaily");
  if (rev) rev.addEventListener("click", () => { setDailyRevealed(); renderDaily(); });
  const open = slot.querySelector("#dailyOpen");
  if (open) open.addEventListener("click", () => {
    setContext({ listIds: getPure().map((c) => c.id) });
    openSheet(open.dataset.id);
  });
}

function renderInicio() {
  const el = document.getElementById("view-inicio");
  const moon = moonPhase(new Date(), getLang());
  el.innerHTML = `
    <div class="home">
      <p class="home-greet">${esc(greeting())}</p>
      <h1 class="home-headline">${esc(t("home.headline"))}</h1>
      <div class="moon"><span class="moon-glyph">${moon.glyph}</span><span class="moon-name">${esc(moon.name)}</span></div>

      <div id="dailySlot"></div>

      <button class="home-discover" data-go="discover">
        <span class="hd-text"><span class="hd-title">${esc(t("home.discover"))}</span>
          <span class="hd-sub">${esc(t("home.discoverSub"))}</span></span>
        <span class="hd-glyph">✦</span>
      </button>

      <div class="home-grid">
        <button class="home-tile" data-go="glosario/arcanos">
          <span class="ht-top"><span class="diamond"></span><span class="ht-arrow">→</span></span>
          <span class="ht-title">${esc(t("home.glosarioCard"))}</span>
          <span class="ht-sub">${esc(t("home.glosarioSub"))}</span>
        </button>
        <button class="home-tile" data-go="tiradas/spreads">
          <span class="ht-top"><span class="diamond"></span><span class="ht-arrow">→</span></span>
          <span class="ht-title">${esc(t("home.tiradasCard"))}</span>
          <span class="ht-sub">${esc(t("home.tiradasSub"))}</span>
        </button>
      </div>
    </div>`;

  renderDaily();
  el.querySelectorAll("[data-go]").forEach((b) =>
    b.addEventListener("click", () => {
      const go = b.dataset.go;
      if (go === "discover") {
        const ids = getPure().map((c) => c.id);
        setContext({ listIds: ids });
        openSheet(ids[Math.floor(Math.random() * ids.length)]);
        return;
      }
      location.hash = go;
    })
  );
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
      </div>
    </div>
    <div class="count" id="count"></div>
    <div class="grid" id="grid"></div>`;

  el.querySelector("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
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
  // Matiz visual del mazo: el tema del JSON (p. ej. "rws") engancha css/themes/<tema>.css
  // vía :root[data-deck="..."]. Energía pura (sin mazo) limpia el atributo → tema base.
  document.documentElement.dataset.deck = state.deckData?.theme || "";
  // propagar el mazo activo a la tirada "Conoce tu mazo"
  setSpreadDeck({ id: state.deckId, name: state.deckData?.name || deckLabel(state.deckId) });
  // refrescar la etiqueta del botón de mazo en Arcanos
  const nameEl = document.getElementById("deckBtnName");
  if (nameEl) nameEl.textContent = deckLabel(state.deckId);
  if (document.getElementById("grid")) renderGrid();
  renderDaily(); // la carta del día puede mostrar el ser del mazo activo
}

/* ---------- Sub-pestañas segmentadas (Glosario, Tiradas) ---------- */
function showSub(view, sub) {
  const list = SUBS[view];
  if (!list || !list.includes(sub)) return;
  list.forEach((s) =>
    document.getElementById("view-" + s).classList.toggle("active", s === sub)
  );
  const segId = view === "glosario" ? "segGlosario" : "segTiradas";
  document.querySelectorAll("#" + segId + " button").forEach((b) => {
    const on = b.dataset.sub === sub;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
}

function initSegTabs() {
  [["segGlosario", "glosario"], ["segTiradas", "tiradas"]].forEach(([id, view]) => {
    document.getElementById(id).addEventListener("click", (e) => {
      const b = e.target.closest("button[data-sub]");
      if (b) location.hash = view + "/" + b.dataset.sub;
    });
  });
}

/* Etiquetas del chrome (barra inferior + sub-pestañas + aria del engrane) según idioma. */
function setChromeLabels() {
  document.querySelectorAll("#nav button").forEach((b) => {
    const lbl = b.querySelector(".bn-lbl");
    if (lbl) lbl.textContent = t("tab." + b.dataset.view);
  });
  document.querySelectorAll(".seg-tabs button[data-sub]").forEach((b) => {
    b.textContent = t("seg." + b.dataset.sub);
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

/* Cambio de idioma: re-render de todo el chrome y las vistas, preservando
   qué sub-vista estaba activa en cada destino segmentado. */
function applyLanguage() {
  const activeSub = {};
  for (const [view, list] of Object.entries(SUBS)) {
    activeSub[view] = list.find((s) => document.getElementById("view-" + s).classList.contains("active")) || list[0];
  }
  setChromeLabels();
  renderInicio();
  refreshArcanos();
  initUso();
  initTiradas();
  initNumerologia();
  refreshSheet();
  for (const [view, sub] of Object.entries(activeSub)) showSub(view, sub);
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
  initSegTabs();
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

  // deep link a carta: asegura Glosario · Arcanos antes de abrir el sheet
  onArcano((id) => { showSub("glosario", "arcanos"); openSheet(id); });
  onSheetClose(() => closeSheet());
  onSub((view, sub) => showSub(view, sub));
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
