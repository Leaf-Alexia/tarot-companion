/* spreads.js — vista Tiradas. Cuatro tiradas:
   1) Carta del día (1)  2) Tres cartas (3, clave intercambiable)
   3) Conoce tu mazo (4, posiciones fijas)  4) Spread Torii (6, tres capas).
   Cada carta extraída abre el detail sheet (sheet.js) con el mazo activo.
   No requiere red: el sorteo es local sobre la capa pura ya cargada. */

import { getPure, buildCard, cardMark, SUITS } from "./deck.js";
import { openSheet, setContext } from "./sheet.js";
import { getDailyId } from "./store.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Clave interpretativa de la tirada de tres cartas. */
const THREE_KEYS = [
  { label: "Tiempo",   roles: ["Pasado", "Presente", "Futuro"] },
  { label: "Relación", roles: ["Persona 1", "Persona 2", "Terreno común"] },
  { label: "Reto",     roles: ["Meta", "Obstáculo", "Ayuda"] },
];

/* "Conoce tu mazo": cuatro posiciones en segunda persona (ver CLAUDE.md). */
const DECK_POS = [
  { role: "La carta que lidera el mazo", hint: "Su energía dominante, la personalidad de este deck." },
  { role: "Qué puede enseñarte",         hint: "El tipo de mirada o conocimiento que te ofrece." },
  { role: "Cómo quiere ser consultado",  hint: "Su preferencia de uso: ¿reflexión lenta? ¿preguntas directas?" },
  { role: "Qué no malinterpretar",       hint: "El error más común al leerlo." },
];

/* Torii: seis posiciones en tres capas, leídas de abajo hacia arriba. */
const TORII_LAYERS = [
  { name: "Los cimientos", roles: ["Base 1", "Base 2"],
    text: "Los principios en la base de tu camino; los valores que deben guiar cada paso y sostener el peso de lo que viene." },
  { name: "Lo que sueltas", roles: ["Travesaño 1", "Travesaño 2"],
    text: "Lo que necesitas soltar para avanzar: cargas que se vuelven experiencia. El soltar te aligera para ascender." },
  { name: "La epifanía", roles: ["Cumbre 1", "Cumbre 2"],
    text: "El punto de giro de tu consciencia; las verdades hacia las que tu mente ya está lista para elevarse." },
];

// Estado del mazo activo (lo actualiza app.js). Solo afecta a "Conoce tu mazo".
let activeDeck = { id: null, name: null };
// Clave y cartas de la tirada de tres (las cartas se conservan al cambiar de clave).
let threeKey = 0;
let threeIds = [null, null, null];

/* Sorteo local sin repetir dentro de la misma tirada. */
function drawN(n) {
  const pool = getPure().map((c) => c.id);
  const out = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

/* HTML de una posición: vacía (placeholder) o con la carta extraída. */
function slotHTML(role, hint, id) {
  if (!id) {
    return `<div class="slot empty">
      <div class="slot-role">${esc(role)}</div>
      ${hint ? `<div class="slot-hint">${esc(hint)}</div>` : ""}
      <div class="slot-face">—</div>
    </div>`;
  }
  const c = buildCard(id, null); // solo nombre + glifo: la capa del mazo la pone el sheet
  return `<button class="slot drawn ${SUITS[c.group].groupClass}" data-id="${esc(id)}"
            aria-label="Abrir ${esc(c.en)} · ${esc(c.es)}">
      <div class="slot-role">${esc(role)}</div>
      <div class="slot-mark">${esc(cardMark(c))}</div>
      <div class="slot-name">${esc(c.es)}</div>
      <div class="slot-en">${esc(c.en)}</div>
    </button>`;
}

/* Pinta las cartas extraídas en un contenedor y prepara el sheet (prev/next dentro de la tirada). */
function fillSlots(container, roles, hints, ids) {
  setContext({ listIds: ids });
  container.innerHTML = roles
    .map((r, i) => slotHTML(r, hints ? hints[i] : null, ids[i]))
    .join("");
  container.querySelectorAll(".slot.drawn").forEach((b) =>
    b.addEventListener("click", () => openSheet(b.dataset.id))
  );
}

/* ---------- Render de la vista ---------- */
function viewHTML() {
  return `
    <div class="pad-top">
      <p class="eyebrow">Spreads</p>
      <h2 class="title">Tiradas</h2>
      <p class="lead">Cuatro caminos para consultar los arcanos. Elige según la pregunta y la profundidad que busques. Cada carta extraída abre su lectura completa.</p>

      <div class="spread-grid">

        <section class="panel" data-spread="dia">
          <h3>Carta del día <span class="tag">· 1 carta</span></h3>
          <p>Un solo arcano para invocar un destello de inspiración que te acompañe durante el día. Es la misma carta hasta que cambie la fecha.</p>
          <div class="slots one" id="diaSlots"></div>
          <button class="draw" data-draw="dia">✦ Revelar la carta del día</button>
        </section>

        <section class="panel" data-spread="tres">
          <h3>Tres cartas <span class="tag">· 3 cartas</span></h3>
          <p>Funciona mejor como respuesta a una pregunta concreta. Elige una clave interpretativa, extrae tres cartas y léelas una a una; luego observa el mensaje de la secuencia.</p>
          <p class="mini-label">Clave interpretativa</p>
          <div class="keys" id="threeKeys"></div>
          <div class="slots three" id="tresSlots"></div>
          <button class="draw" data-draw="tres">Extraer tres cartas</button>
        </section>

        <section class="panel" data-spread="mazo">
          <h3>Conoce tu mazo <span class="tag">· 4 cartas</span></h3>
          <p>Construye el vínculo entre tú y el mazo: cuatro posiciones que describen su personalidad, lo que enseña y cómo quiere ser leído.</p>
          <div class="slots four" id="mazoSlots"></div>
          <button class="draw" data-draw="mazo">Conocer el mazo</button>
          <p class="deck-needed" id="mazoNeeded" hidden>Activa un mazo en <a href="#inicio">Inicio</a> para esta tirada.</p>
        </section>

        <section class="panel" data-spread="torii">
          <h3>Spread Torii <span class="tag">· 6 cartas · 鳥居</span></h3>
          <p>Con forma de torii, la puerta ceremonial sintoísta. Extrae seis cartas y léelas de <b>abajo hacia arriba</b>: no avances de capa hasta asentar la anterior.</p>
          <div class="torii" id="toriiSlots"></div>
          <button class="draw" data-draw="torii">Extraer seis cartas</button>
        </section>

      </div>
    </div>`;
}

function renderThreeKeys() {
  const wrap = document.getElementById("threeKeys");
  wrap.innerHTML = THREE_KEYS.map((k, i) =>
    `<button class="${i === threeKey ? "active" : ""}" data-k="${i}">${esc(k.label)}</button>`
  ).join("");
}

/* Re-pinta la tirada de tres con la clave actual, conservando las cartas extraídas. */
function renderThreeSlots() {
  fillSlots(document.getElementById("tresSlots"), THREE_KEYS[threeKey].roles, null, threeIds);
}

/* Estado inicial de cada tirada: posiciones vacías. */
function paintEmpty() {
  fillSlots(document.getElementById("diaSlots"), ["Hoy"], null, [null]);
  renderThreeSlots();
  fillSlots(document.getElementById("mazoSlots"), DECK_POS.map((p) => p.role), DECK_POS.map((p) => p.hint), [null, null, null, null]);
  renderTorii([null, null, null, null, null, null]);
}

/* El torii se dibuja por capas (base abajo). */
function renderTorii(ids) {
  const wrap = document.getElementById("toriiSlots");
  setContext({ listIds: ids.filter(Boolean) });
  // Capas en orden visual descendente (cumbre arriba), pero numeradas desde la base.
  const layersTopDown = [2, 1, 0];
  wrap.innerHTML = layersTopDown.map((li) => {
    const layer = TORII_LAYERS[li];
    const base = li * 2; // índice de la primera carta de la capa
    const cells = layer.roles.map((role, j) => {
      const idx = base + j;
      const n = idx + 1;
      return slotHTML(`${n} · ${role}`, null, ids[idx]);
    }).join("");
    return `<div class="torii-layer">
      <div class="torii-meta"><span class="torii-name">${esc(layer.name)}</span>
        <span class="torii-pos">Posiciones ${base + 1} · ${base + 2}</span></div>
      <div class="torii-cells">${cells}</div>
      <p class="torii-text">${esc(layer.text)}</p>
    </div>`;
  }).join("");
  wrap.querySelectorAll(".slot.drawn").forEach((b) =>
    b.addEventListener("click", () => openSheet(b.dataset.id))
  );
}

/* ---------- Tiradas individuales ---------- */
function drawDia() {
  const id = getDailyId(getPure().map((c) => c.id));
  fillSlots(document.getElementById("diaSlots"), ["Hoy"], null, [id]);
}

function drawTres() {
  threeIds = drawN(3);
  renderThreeSlots();
}

function drawMazo() {
  if (!activeDeck.id) return;
  const ids = drawN(4);
  fillSlots(
    document.getElementById("mazoSlots"),
    DECK_POS.map((p) => p.role),
    DECK_POS.map((p) => p.hint),
    ids
  );
}

function drawTorii() {
  renderTorii(drawN(6));
}

/* Habilita/inhabilita "Conoce tu mazo" según haya mazo activo. */
function refreshDeckGate() {
  const panel = document.querySelector('[data-spread="mazo"]');
  if (!panel) return;
  const btn = panel.querySelector('[data-draw="mazo"]');
  const needed = panel.querySelector("#mazoNeeded");
  const has = Boolean(activeDeck.id);
  btn.disabled = !has;
  btn.textContent = has ? `Conocer el ${activeDeck.name || "mazo"}` : "Conocer el mazo";
  needed.hidden = has;
}

/* ---------- API pública ---------- */
export function initTiradas() {
  const el = document.getElementById("view-tiradas");
  el.innerHTML = viewHTML();

  renderThreeKeys();
  paintEmpty();
  refreshDeckGate();

  el.querySelector("#threeKeys").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    threeKey = Number(b.dataset.k);
    renderThreeKeys();
    renderThreeSlots(); // solo re-etiqueta posiciones; conserva las cartas extraídas
  });

  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-draw]");
    if (!b || b.disabled) return;
    ({ dia: drawDia, tres: drawTres, mazo: drawMazo, torii: drawTorii })[b.dataset.draw]?.();
  });
}

/* app.js la llama al cambiar de mazo. */
export function setSpreadDeck({ id, name }) {
  activeDeck = { id: id || null, name: name || null };
  refreshDeckGate();
}
