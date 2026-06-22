/* spreads.js — vista Tiradas (bilingüe). Cuatro tiradas:
   1) Carta del día (1)  2) Tres cartas (3, clave intercambiable)
   3) Conoce tu mazo (4, posiciones fijas)  4) Spread Torii (6, tres capas).
   Cada carta extraída abre el detail sheet (sheet.js) con el mazo activo.
   No requiere red: el sorteo es local sobre la capa pura ya cargada. */

import { getPure, buildCard, cardMark, cardName, SUITS } from "./deck.js";
import { openSheet, setContext } from "./sheet.js";
import { getDailyId } from "./store.js";
import { getLang } from "./i18n.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const L = () => getLang();

/* Clave interpretativa de la tirada de tres cartas. */
const THREE_KEYS = {
  es: [
    { label: "Tiempo",   roles: ["Pasado", "Presente", "Futuro"] },
    { label: "Relación", roles: ["Persona 1", "Persona 2", "Terreno común"] },
    { label: "Reto",     roles: ["Meta", "Obstáculo", "Ayuda"] },
  ],
  en: [
    { label: "Time",         roles: ["Past", "Present", "Future"] },
    { label: "Relationship", roles: ["Person 1", "Person 2", "Common ground"] },
    { label: "Challenge",    roles: ["Goal", "Obstacle", "Help"] },
  ],
};

/* "Conoce tu mazo": cuatro posiciones en segunda persona (ver CLAUDE.md). */
const DECK_POS = {
  es: [
    { role: "La carta que lidera el mazo", hint: "Su energía dominante, la personalidad de este deck." },
    { role: "Qué puede enseñarte",         hint: "El tipo de mirada o conocimiento que te ofrece." },
    { role: "Cómo quiere ser consultado",  hint: "Su preferencia de uso: ¿reflexión lenta? ¿preguntas directas?" },
    { role: "Qué no malinterpretar",       hint: "El error más común al leerlo." },
  ],
  en: [
    { role: "The card that leads the deck", hint: "Its dominant energy, this deck's personality." },
    { role: "What it can teach you",        hint: "The kind of insight or knowledge it offers." },
    { role: "How it wants to be consulted", hint: "Its preferred use: slow reflection? direct questions?" },
    { role: "What not to misread",          hint: "The most common mistake when reading it." },
  ],
};

/* Torii: seis posiciones en tres capas, leídas de abajo hacia arriba. */
const TORII_LAYERS = {
  es: [
    { name: "Los cimientos", roles: ["Base 1", "Base 2"],
      text: "Los principios en la base de tu camino; los valores que deben guiar cada paso y sostener el peso de lo que viene." },
    { name: "Lo que sueltas", roles: ["Travesaño 1", "Travesaño 2"],
      text: "Lo que necesitas soltar para avanzar: cargas que se vuelven experiencia. El soltar te aligera para ascender." },
    { name: "La epifanía", roles: ["Cumbre 1", "Cumbre 2"],
      text: "El punto de giro de tu consciencia; las verdades hacia las que tu mente ya está lista para elevarse." },
  ],
  en: [
    { name: "The foundations", roles: ["Base 1", "Base 2"],
      text: "The principles at the base of your path; the values that must guide each step and bear the weight of what is coming." },
    { name: "What you release", roles: ["Crossbeam 1", "Crossbeam 2"],
      text: "What you need to let go of to move forward: burdens that become experience. Releasing them lightens you to ascend." },
    { name: "The epiphany", roles: ["Summit 1", "Summit 2"],
      text: "The turning point of your consciousness; the truths your mind is now ready to rise toward." },
  ],
};

const TXT = {
  es: {
    eyebrow: "Para tu lectura", title: "Tiradas",
    lead: "Cuatro caminos para consultar los arcanos. Elige según la pregunta y la profundidad que busques. Cada carta extraída abre su lectura completa.",
    diaH: "Carta del día", diaTag: "· 1 carta",
    diaP: "Un solo arcano para invocar un destello de inspiración que te acompañe durante el día. Es la misma carta hasta que cambie la fecha.",
    diaBtn: "✦ Revelar la carta del día", today: "Hoy",
    tresH: "Tres cartas", tresTag: "· 3 cartas",
    tresP: "Funciona mejor como respuesta a una pregunta concreta. Elige una clave interpretativa, extrae tres cartas y léelas una a una; luego observa el mensaje de la secuencia.",
    tresKey: "Clave interpretativa", tresBtn: "Extraer tres cartas",
    mazoH: "Conoce tu mazo", mazoTag: "· 4 cartas",
    mazoP: "Construye el vínculo entre tú y el mazo: cuatro posiciones que describen su personalidad, lo que enseña y cómo quiere ser leído.",
    mazoBtnBase: "Conocer el mazo", mazoBtnNamed: (n) => `Conocer el ${n}`,
    mazoNeeded: 'Elige un mazo con el botón de mazo en <a href="#glosario/arcanos">Glosario</a> para esta tirada.',
    toriiH: "Spread Torii", toriiTag: "· 6 cartas · 鳥居",
    toriiP: "Con forma de torii, la puerta ceremonial sintoísta. Extrae seis cartas y léelas de <b>abajo hacia arriba</b>: no avances de capa hasta asentar la anterior.",
    toriiBtn: "Extraer seis cartas", positions: "Posiciones", open: "Abrir",
  },
  en: {
    eyebrow: "For your reading", title: "Spreads",
    lead: "Four paths to consult the arcana. Choose by the question and the depth you seek. Each card drawn opens its full reading.",
    diaH: "Card of the day", diaTag: "· 1 card",
    diaP: "A single arcanum to summon a flash of inspiration to carry through your day. It stays the same card until the date changes.",
    diaBtn: "✦ Reveal the card of the day", today: "Today",
    tresH: "Three cards", tresTag: "· 3 cards",
    tresP: "Works best as an answer to a specific question. Choose an interpretive key, draw three cards and read them one by one; then read the message of the sequence.",
    tresKey: "Interpretive key", tresBtn: "Draw three cards",
    mazoH: "Know your deck", mazoTag: "· 4 cards",
    mazoP: "Build the bond between you and the deck: four positions that describe its personality, what it teaches, and how it wants to be read.",
    mazoBtnBase: "Know your deck", mazoBtnNamed: (n) => `Get to know ${n}`,
    mazoNeeded: 'Choose a deck with the deck button in <a href="#glosario/arcanos">Glossary</a> for this spread.',
    toriiH: "Torii spread", toriiTag: "· 6 cards · 鳥居",
    toriiP: "Shaped like a torii, the Shinto ceremonial gate. Draw six cards and read them <b>from the bottom up</b>: don't move up a layer until the one below has settled.",
    toriiBtn: "Draw six cards", positions: "Positions", open: "Open",
  },
};

const tx = () => TXT[L()] || TXT.es;

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
  const name = cardName(c);
  return `<button class="slot drawn ${SUITS[c.group].groupClass}" data-id="${esc(id)}"
            aria-label="${esc(tx().open)} ${esc(name)}">
      <div class="slot-role">${esc(role)}</div>
      <div class="slot-mark">${esc(cardMark(c))}</div>
      <div class="slot-name">${esc(name)}</div>
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
  const x = tx();
  return `
    <div class="pad-top">
      <p class="eyebrow">${esc(x.eyebrow)}</p>
      <h2 class="title">${esc(x.title)}</h2>
      <p class="lead">${esc(x.lead)}</p>

      <div class="spread-grid">

        <section class="panel" data-spread="dia">
          <h3>${esc(x.diaH)} <span class="tag">${esc(x.diaTag)}</span></h3>
          <p>${esc(x.diaP)}</p>
          <div class="slots one" id="diaSlots"></div>
          <button class="draw" data-draw="dia">${esc(x.diaBtn)}</button>
        </section>

        <section class="panel" data-spread="tres">
          <h3>${esc(x.tresH)} <span class="tag">${esc(x.tresTag)}</span></h3>
          <p>${esc(x.tresP)}</p>
          <p class="mini-label">${esc(x.tresKey)}</p>
          <div class="keys" id="threeKeys"></div>
          <div class="slots three" id="tresSlots"></div>
          <button class="draw" data-draw="tres">${esc(x.tresBtn)}</button>
        </section>

        <section class="panel" data-spread="mazo">
          <h3>${esc(x.mazoH)} <span class="tag">${esc(x.mazoTag)}</span></h3>
          <p>${esc(x.mazoP)}</p>
          <div class="slots four" id="mazoSlots"></div>
          <button class="draw" data-draw="mazo">${esc(x.mazoBtnBase)}</button>
          <p class="deck-needed" id="mazoNeeded" hidden>${x.mazoNeeded}</p>
        </section>

        <section class="panel" data-spread="torii">
          <h3>${esc(x.toriiH)} <span class="tag">${esc(x.toriiTag)}</span></h3>
          <p>${x.toriiP}</p>
          <div class="torii" id="toriiSlots"></div>
          <button class="draw" data-draw="torii">${esc(x.toriiBtn)}</button>
        </section>

      </div>
    </div>`;
}

function renderThreeKeys() {
  const wrap = document.getElementById("threeKeys");
  wrap.innerHTML = (THREE_KEYS[L()] || THREE_KEYS.es).map((k, i) =>
    `<button class="${i === threeKey ? "active" : ""}" data-k="${i}">${esc(k.label)}</button>`
  ).join("");
}

/* Re-pinta la tirada de tres con la clave actual, conservando las cartas extraídas. */
function renderThreeSlots() {
  const keys = THREE_KEYS[L()] || THREE_KEYS.es;
  fillSlots(document.getElementById("tresSlots"), keys[threeKey].roles, null, threeIds);
}

/* Estado inicial de cada tirada: posiciones vacías. */
function paintEmpty() {
  const pos = DECK_POS[L()] || DECK_POS.es;
  fillSlots(document.getElementById("diaSlots"), [tx().today], null, [null]);
  renderThreeSlots();
  fillSlots(document.getElementById("mazoSlots"), pos.map((p) => p.role), pos.map((p) => p.hint), [null, null, null, null]);
  renderTorii([null, null, null, null, null, null]);
}

/* El torii se dibuja por capas (base abajo). */
function renderTorii(ids) {
  const wrap = document.getElementById("toriiSlots");
  const layers = TORII_LAYERS[L()] || TORII_LAYERS.es;
  setContext({ listIds: ids.filter(Boolean) });
  // Capas en orden visual descendente (cumbre arriba), pero numeradas desde la base.
  const layersTopDown = [2, 1, 0];
  wrap.innerHTML = layersTopDown.map((li) => {
    const layer = layers[li];
    const base = li * 2; // índice de la primera carta de la capa
    const cells = layer.roles.map((role, j) => {
      const idx = base + j;
      const n = idx + 1;
      return slotHTML(`${n} · ${role}`, null, ids[idx]);
    }).join("");
    return `<div class="torii-layer">
      <div class="torii-meta"><span class="torii-name">${esc(layer.name)}</span>
        <span class="torii-pos">${esc(tx().positions)} ${base + 1} · ${base + 2}</span></div>
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
  fillSlots(document.getElementById("diaSlots"), [tx().today], null, [id]);
}

function drawTres() {
  threeIds = drawN(3);
  renderThreeSlots();
}

function drawMazo() {
  if (!activeDeck.id) return;
  const pos = DECK_POS[L()] || DECK_POS.es;
  const ids = drawN(4);
  fillSlots(
    document.getElementById("mazoSlots"),
    pos.map((p) => p.role),
    pos.map((p) => p.hint),
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
  const x = tx();
  const has = Boolean(activeDeck.id);
  btn.disabled = !has;
  btn.textContent = has ? x.mazoBtnNamed(activeDeck.name || x.mazoBtnBase) : x.mazoBtnBase;
  needed.hidden = has;
}

/* Click delegado en el contenedor (se adjunta una sola vez; sobrevive re-renders). */
let wired = false;
function onTiradasClick(e) {
  const key = e.target.closest("#threeKeys [data-k]");
  if (key) {
    threeKey = Number(key.dataset.k);
    renderThreeKeys();
    renderThreeSlots(); // solo re-etiqueta posiciones; conserva las cartas extraídas
    return;
  }
  const b = e.target.closest("[data-draw]");
  if (!b || b.disabled) return;
  ({ dia: drawDia, tres: drawTres, mazo: drawMazo, torii: drawTorii })[b.dataset.draw]?.();
}

/* ---------- API pública ---------- */
export function initTiradas() {
  const el = document.getElementById("view-spreads");
  el.innerHTML = viewHTML();

  renderThreeKeys();
  paintEmpty();
  refreshDeckGate();

  if (!wired) { el.addEventListener("click", onTiradasClick); wired = true; }
}

/* app.js la llama al cambiar de mazo. */
export function setSpreadDeck({ id, name }) {
  activeDeck = { id: id || null, name: name || null };
  refreshDeckGate();
}
