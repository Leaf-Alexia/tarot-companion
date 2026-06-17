/* app.js — punto de entrada. Carga datos, arma Inicio + Arcanos y conecta router + sheet. */

import {
  loadPure, loadDeck, getPure, buildCard, cardMark, filterPure, SUITS, FILTERS,
} from "./deck.js";
import { getActiveDeckId, setActiveDeckId, getDailyId } from "./store.js";
import { initRouter, onArcano, onSheetClose } from "./router.js";
import { openSheet, closeSheet, setContext } from "./sheet.js";

// Mazos disponibles (la "energía pura" es la opción sin mazo). Crecerá con rws.json.
const DECK_OPTIONS = [
  { id: null, label: "Energía pura" },
  { id: "yokai", label: "Yōkai Tarot" },
];

const state = { group: "all", query: "", deckId: null, deckData: null };

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- Inicio ---------- */
function renderInicio() {
  const el = document.getElementById("view-inicio");
  el.innerHTML = `
    <div class="cover">
      <p class="kicker">Guía y acompañante de lectura</p>
      <h1>Tarot<br>Companion</h1>
      <p class="sub">La energía pura de los 78 arcanos, y cómo cada mazo la matiza.</p>
      <div class="rule"></div>
      <div class="deck-select" id="deckSelect" aria-label="Mazo activo">
        <span class="ds-label">Capa activa</span>
        <div class="ds-opts">
          ${DECK_OPTIONS.map((o) =>
            `<button data-deck="${o.id ?? ""}" class="${state.deckId === o.id ? "active" : ""}">${esc(o.label)}</button>`
          ).join("")}
        </div>
      </div>
      <button class="enter" data-go="arcanos">Consultar los arcanos →</button>
    </div>`;

  el.querySelector("[data-go]").addEventListener("click", () => { location.hash = "arcanos"; });
  el.querySelectorAll("[data-deck]").forEach((b) =>
    b.addEventListener("click", () => setDeck(b.dataset.deck || null))
  );
}

/* ---------- Arcanos: controles (una vez) ---------- */
function renderArcanosShell() {
  const el = document.getElementById("view-arcanos");
  el.innerHTML = `
    <div class="controls">
      <label class="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="search" type="search" placeholder="Buscar por nombre o palabra clave…" autocomplete="off" aria-label="Buscar arcano">
      </label>
      <div class="chips" id="chips">
        ${FILTERS.map((f) =>
          `<button class="chip ${f.g === "all" ? "active" : ""}" data-g="${f.g}">${esc(f.es)}</button>`
        ).join("")}
        <button class="chip day" id="dayBtn" title="Extrae un arcano al azar">✦ Carta del día</button>
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
    const btn = document.createElement("button");
    btn.className = "card " + SUITS[c.group].groupClass;
    btn.setAttribute("aria-label", `${c.en} · ${c.es}`);
    btn.innerHTML = `
      <div class="mark">${esc(cardMark(c))}</div>
      ${c.yokai_kanji ? `<div class="kanji">${esc(c.yokai_kanji)}</div>` : ""}
      <div class="nm-en">${esc(c.en)}</div>
      <div class="nm-es">${esc(c.es)}</div>`;
    btn.addEventListener("click", () => openSheet(pure.id));
    frag.appendChild(btn);
  }
  grid.appendChild(frag);
  count.textContent = `${list.length} ${list.length === 1 ? "arcano" : "arcanos"}`;
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
  // refrescar UI que depende del mazo
  document.querySelectorAll("#deckSelect [data-deck]").forEach((b) =>
    b.classList.toggle("active", (b.dataset.deck || null) === state.deckId)
  );
  if (document.getElementById("grid")) renderGrid();
}

/* Marcadores para vistas aún no construidas (pasos siguientes del roadmap). */
function paintPending() {
  const pend = {
    uso: "Cómo usar el tarot (pendiente)",
    tiradas: "Tiradas: carta del día, tres cartas, conoce tu mazo, torii (pendiente)",
    numerologia: "Numerología 0–21 (pendiente)",
  };
  for (const [v, txt] of Object.entries(pend)) {
    const el = document.getElementById("view-" + v);
    if (el && !el.children.length) el.innerHTML = `<p class="placeholder">${txt}</p>`;
  }
}

/* ---------- Init ---------- */
async function init() {
  try {
    await loadPure();
  } catch (err) {
    document.getElementById("view-arcanos").innerHTML =
      `<p class="placeholder">No se pudieron cargar los datos. Reintenta con conexión.</p>`;
    console.error(err);
    initRouter();
    return;
  }

  renderInicio();
  renderArcanosShell();
  paintPending();

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
