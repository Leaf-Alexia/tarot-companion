/* spreads.js — vista Tiradas (bilingüe). Tiradas base:
   1) Carta del día (1)  2) Tres cartas (3, clave intercambiable)
   3) Conoce tu mazo (4, posiciones fijas)  4) Spread Torii (6, tres capas)
   + tiradas simples del registro SIMPLE_SPREADS (posiciones fijas; añadir una
   tirada nueva = añadir una entrada ahí). Varias son adaptaciones con redacción
   propia, inspiradas en "The Library of Questions" de Lida Pavlova.
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

/* Tiradas simples: posiciones fijas, un botón, sin lógica especial.
   `story` (opcional) es una entrada narrativa que se lee antes de extraer. */
const SIMPLE_SPREADS = [
  {
    key: "sensacion", n: 5,
    es: {
      h: "Esa sensación", tag: "· 5 cartas",
      p: "Para ponerle nombre a esa sensación extraña que te acompaña y no sabes bien de dónde viene.",
      btn: "Extraer cinco cartas",
      roles: [
        { role: "Qué siento",          hint: "La emoción, nombrada por el arcano." },
        { role: "Cómo se siente",      hint: "Su textura: cómo se mueve dentro de ti." },
        { role: "Con quién o con qué", hint: "Hacia dónde apunta esta sensación." },
        { role: "De dónde viene",      hint: "Su raíz: qué la despertó." },
        { role: "Para qué llegó",      hint: "Lo que viene a mostrarte o a pedirte." },
      ],
    },
    en: {
      h: "That feeling", tag: "· 5 cards",
      p: "To put a name to that strange feeling that follows you around and you can't quite place.",
      btn: "Draw five cards",
      roles: [
        { role: "What I feel",        hint: "The emotion, named by the arcanum." },
        { role: "How it feels",       hint: "Its texture: how it moves inside you." },
        { role: "With whom or what",  hint: "Where this feeling is pointing." },
        { role: "Where it comes from", hint: "Its root: what woke it." },
        { role: "What it came for",   hint: "What it wants to show you or ask of you." },
      ],
    },
  },
  {
    key: "piel", n: 5,
    es: {
      h: "Cambio de piel", tag: "· 5 cartas",
      p: "Para cuando notas que algo en ti ya no es como era. Un retrato del cambio, con cariño por quien fuiste y por quien estás siendo.",
      btn: "Extraer cinco cartas",
      roles: [
        { role: "Quién eras",              hint: "La versión de ti que quedó atrás." },
        { role: "Por qué ya no eres ella", hint: "Qué disolvió esa forma de ser." },
        { role: "Quién estás siendo",      hint: "Lo que está emergiendo ahora." },
        { role: "Lo que brilla en ti",     hint: "Qué admirar de esta nueva versión." },
        { role: "Cómo acompañarte",        hint: "El cuidado que este cambio te pide." },
      ],
    },
    en: {
      h: "Shedding skin", tag: "· 5 cards",
      p: "For when you notice something in you is no longer as it was. A portrait of the change, with tenderness for who you were and who you are becoming.",
      btn: "Draw five cards",
      roles: [
        { role: "Who you were",           hint: "The version of you left behind." },
        { role: "Why you are no longer her", hint: "What dissolved that way of being." },
        { role: "Who you are becoming",   hint: "What is emerging now." },
        { role: "What shines in you",     hint: "What to admire in this new version." },
        { role: "How to hold yourself",   hint: "The care this change asks of you." },
      ],
    },
  },
  {
    key: "bosque", n: 5,
    es: {
      h: "El anciano del bosque", tag: "· 5 cartas",
      p: "Una tirada narrativa para la introspección profunda. Léela como un pequeño cuento en el que tú entras.",
      story: "Caminas hacia lo profundo de un bosque antiguo. Al caer la tarde, un anciano encapuchado aparece en tu sendero y, apoyado en su bastón, te saluda.",
      btn: "Entrar al bosque",
      roles: [
        { role: "Tu saludo",       hint: "Cómo le respondes tú." },
        { role: "Tu pregunta",     hint: "Qué le preguntas." },
        { role: "Su respuesta",    hint: "Lo que el anciano contesta." },
        { role: "El encuentro",    hint: "Por qué el bosque quiso reunirlos." },
        { role: "El cambio",       hint: "Sales del bosque distinta: ¿qué cambió en ti?" },
      ],
    },
    en: {
      h: "The elder of the forest", tag: "· 5 cards",
      p: "A narrative spread for deep introspection. Read it like a little tale you step into.",
      story: "You walk into the depths of an ancient forest. As evening falls, a hooded elder appears on your path and, leaning on his staff, greets you.",
      btn: "Enter the forest",
      roles: [
        { role: "Your greeting",  hint: "How you answer him." },
        { role: "Your question",  hint: "What you ask him about." },
        { role: "His answer",     hint: "What the elder replies." },
        { role: "The meeting",    hint: "Why the forest wanted you two to meet." },
        { role: "The change",     hint: "You leave the forest different: what changed in you?" },
      ],
    },
  },
  {
    key: "aventura", n: 4,
    es: {
      h: "Aventura", tag: "· 4 cartas",
      p: "Una tirada lúdica: mira un objetivo como si fuera una gesta. Baraja — nos vamos de aventura.",
      btn: "Partir a la aventura",
      roles: [
        { role: "Tu arma",      hint: "Lo que te va a ayudar." },
        { role: "Tu aliado",    hint: "Quién o qué te acompaña." },
        { role: "Tu adversario", hint: "Contra qué o quién luchas." },
        { role: "El desenlace", hint: "Lo que puede pasar." },
      ],
    },
    en: {
      h: "Adventure", tag: "· 4 cards",
      p: "A playful spread: look at a goal as if it were a quest. Shuffle up — we're going on an adventure.",
      btn: "Set off on the adventure",
      roles: [
        { role: "Your weapon",   hint: "What will help you." },
        { role: "Your ally",     hint: "Who or what goes with you." },
        { role: "Your adversary", hint: "What or whom you are fighting." },
        { role: "The outcome",   hint: "What may come to pass." },
      ],
    },
  },
  {
    key: "umbral", n: 5,
    es: {
      h: "El umbral del mes", tag: "· 5 cartas",
      p: "Para tirar al comenzar cada mes: un inventario de lo que traes y de lo que este ciclo quiere de ti.",
      btn: "Abrir el mes",
      roles: [
        { role: "El clima del mes",     hint: "La energía que abre este ciclo." },
        { role: "Lo que traes de sobra", hint: "Tu abundancia: de qué llegas llena y puedes compartir." },
        { role: "Lo que escasea",       hint: "Qué se está agotando y pide reponerse." },
        { role: "Dónde ponerlo",        hint: "A quién o a qué dedicar lo que tienes." },
        { role: "El regalo del mes",    hint: "Lo que este ciclo quiere dejarte al irse." },
      ],
    },
    en: {
      h: "The month's threshold", tag: "· 5 cards",
      p: "To draw at the start of each month: an inventory of what you carry in and what this cycle wants from you.",
      btn: "Open the month",
      roles: [
        { role: "The month's weather",  hint: "The energy that opens this cycle." },
        { role: "What you carry in plenty", hint: "Your abundance: what you arrive full of and can share." },
        { role: "What is running low",  hint: "What is nearly used up and asks to be replenished." },
        { role: "Where to place it",    hint: "Whom or what to devote what you have to." },
        { role: "The month's gift",     hint: "What this cycle wants to leave you when it goes." },
      ],
    },
  },
];

const TXT = {
  es: {
    eyebrow: "Para tu lectura", title: "Tiradas",
    lead: "Distintos caminos para consultar los arcanos. Elige según la pregunta y la profundidad que busques. Cada carta extraída abre su lectura completa.",
    credit: "Algunas tiradas son adaptaciones con redacción propia, inspiradas en el libro «The Library of Questions» de Lida Pavlova.",
    diaH: "Carta del día", diaTag: "· 1 carta",
    diaP: "Un solo arcano para invocar un destello de inspiración que te acompañe durante el día. Es la misma carta hasta que cambie la fecha.",
    diaBtn: "✦ Revelar la carta del día", today: "Hoy",
    tresH: "Tres cartas", tresTag: "· 3 cartas",
    tresP: "Funciona mejor como respuesta a una pregunta concreta. Elige una clave interpretativa, extrae tres cartas y léelas una a una; luego observa el mensaje de la secuencia.",
    tresKey: "Clave interpretativa", tresBtn: "Extraer tres cartas",
    mazoH: "Conoce tu mazo", mazoTag: "· 4 cartas",
    mazoP: "Construye el vínculo entre tú y el mazo: cuatro posiciones que describen su personalidad, lo que enseña y cómo quiere ser leído.",
    mazoBtnBase: "Conocer el mazo", mazoBtnNamed: (n) => `Conocer el ${n}`,
    mazoNeeded: 'Elige un mazo con el botón de mazo en <a href="#tarot/arcanos">Arcanos</a> para esta tirada.',
    toriiH: "Spread Torii", toriiTag: "· 6 cartas · 鳥居",
    toriiP: "Con forma de torii, la puerta ceremonial sintoísta. Extrae seis cartas y léelas de <b>abajo hacia arriba</b>: no avances de capa hasta asentar la anterior.",
    toriiBtn: "Extraer seis cartas", positions: "Posiciones", open: "Abrir",
  },
  en: {
    eyebrow: "For your reading", title: "Spreads",
    lead: "Different paths to consult the arcana. Choose by the question and the depth you seek. Each card drawn opens its full reading.",
    credit: "Some spreads are adaptations in our own words, inspired by the book “The Library of Questions” by Lida Pavlova.",
    diaH: "Card of the day", diaTag: "· 1 card",
    diaP: "A single arcanum to summon a flash of inspiration to carry through your day. It stays the same card until the date changes.",
    diaBtn: "✦ Reveal the card of the day", today: "Today",
    tresH: "Three cards", tresTag: "· 3 cards",
    tresP: "Works best as an answer to a specific question. Choose an interpretive key, draw three cards and read them one by one; then read the message of the sequence.",
    tresKey: "Interpretive key", tresBtn: "Draw three cards",
    mazoH: "Know your deck", mazoTag: "· 4 cards",
    mazoP: "Build the bond between you and the deck: four positions that describe its personality, what it teaches, and how it wants to be read.",
    mazoBtnBase: "Know your deck", mazoBtnNamed: (n) => `Get to know ${n}`,
    mazoNeeded: 'Choose a deck with the deck button in <a href="#tarot/arcanos">Arcana</a> for this spread.',
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
// Cartas extraídas de las tiradas simples (se conservan al re-render por idioma).
const simpleIds = Object.fromEntries(
  SIMPLE_SPREADS.map((s) => [s.key, Array(s.n).fill(null)])
);

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

        ${SIMPLE_SPREADS.map((s) => {
          const c = s[L()] || s.es;
          return `<section class="panel" data-spread="${s.key}">
            <h3>${esc(c.h)} <span class="tag">${esc(c.tag)}</span></h3>
            <p>${esc(c.p)}</p>
            ${c.story ? `<p class="spread-story">${esc(c.story)}</p>` : ""}
            <div class="slots n${s.n}" id="slots-${s.key}"></div>
            <button class="draw" data-draw="${s.key}">${esc(c.btn)}</button>
          </section>`;
        }).join("")}

      </div>
      <p class="muted-note spread-credit">${esc(x.credit)}</p>
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

/* Pinta una tirada simple con sus cartas actuales (o vacía). */
function renderSimple(spread) {
  const c = spread[L()] || spread.es;
  fillSlots(
    document.getElementById("slots-" + spread.key),
    c.roles.map((r) => r.role),
    c.roles.map((r) => r.hint),
    simpleIds[spread.key]
  );
}

/* Estado inicial de cada tirada: posiciones vacías (las simples conservan lo extraído). */
function paintEmpty() {
  const pos = DECK_POS[L()] || DECK_POS.es;
  fillSlots(document.getElementById("diaSlots"), [tx().today], null, [null]);
  renderThreeSlots();
  fillSlots(document.getElementById("mazoSlots"), pos.map((p) => p.role), pos.map((p) => p.hint), [null, null, null, null]);
  renderTorii([null, null, null, null, null, null]);
  SIMPLE_SPREADS.forEach(renderSimple);
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
  const fixed = { dia: drawDia, tres: drawTres, mazo: drawMazo, torii: drawTorii }[b.dataset.draw];
  if (fixed) { fixed(); return; }
  const spread = SIMPLE_SPREADS.find((s) => s.key === b.dataset.draw);
  if (spread) {
    simpleIds[spread.key] = drawN(spread.n);
    renderSimple(spread);
  }
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
