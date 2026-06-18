/* numerology.js — vista Numerología (bilingüe). Significado de los números (As–10),
   las figuras de la corte y el viaje de los 22 Arcanos Mayores (0–21).
   Los nombres de Mayores abren su lectura. */

import { getPure, cardName } from "./deck.js";
import { openSheet, setContext } from "./sheet.js";
import { getLang } from "./i18n.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const NUMBERS = {
  es: [
    { n: 1,  title: "As · Semilla",  body: "El don del palo en su forma más pura. Potencial, chispa, comienzo." },
    { n: 2,  title: "Dualidad",      body: "Equilibrio entre dos fuerzas, elección, relación, primer contacto." },
    { n: 3,  title: "Crecimiento",   body: "Primera expresión y síntesis; la idea toma forma y se comparte." },
    { n: 4,  title: "Estructura",    body: "Estabilidad, orden, cimiento. A veces, rigidez o estancamiento." },
    { n: 5,  title: "Crisis",        body: "Conflicto y cambio: el equilibrio se rompe y obliga a adaptarse." },
    { n: 6,  title: "Armonía",       body: "Reciprocidad y ajuste; el alivio que llega tras la prueba." },
    { n: 7,  title: "Prueba",        body: "Evaluación, perseverancia, reflexión. Sostener el rumbo elegido." },
    { n: 8,  title: "Dominio",       body: "Maestría práctica, movimiento, poder puesto en acción." },
    { n: 9,  title: "Plenitud",      body: "Casi la cima: intensidad, logro o exceso vividos a solas." },
    { n: 10, title: "Cierre",        body: "Fin del ciclo: plenitud o saturación. Transición al siguiente palo." },
  ],
  en: [
    { n: 1,  title: "Ace · Seed",  body: "The suit's gift in its purest form. Potential, spark, beginning." },
    { n: 2,  title: "Duality",     body: "Balance between two forces, choice, relationship, first contact." },
    { n: 3,  title: "Growth",      body: "First expression and synthesis; the idea takes shape and is shared." },
    { n: 4,  title: "Structure",   body: "Stability, order, foundation. At times, rigidity or stagnation." },
    { n: 5,  title: "Crisis",      body: "Conflict and change: the balance breaks and forces you to adapt." },
    { n: 6,  title: "Harmony",     body: "Reciprocity and adjustment; the relief that comes after the trial." },
    { n: 7,  title: "Trial",       body: "Assessment, perseverance, reflection. Holding the chosen course." },
    { n: 8,  title: "Mastery",     body: "Practical mastery, movement, power put into action." },
    { n: 9,  title: "Fullness",    body: "Almost the summit: intensity, achievement, or excess lived alone." },
    { n: 10, title: "Closure",     body: "End of the cycle: fullness or saturation. Transition to the next suit." },
  ],
};

const COURT = {
  es: [
    { mark: "小", title: "Sota",      body: "Aprendiz y mensajero. Curiosidad, estudio, noticias; el elemento naciendo." },
    { mark: "騎", title: "Caballero", body: "El elemento lanzado al mundo: impulso, búsqueda, acción (a veces exceso)." },
    { mark: "后", title: "Reina",     body: "Maestría interior: madurez receptiva, nutrir y sostener desde adentro." },
    { mark: "王", title: "Rey",       body: "Maestría exterior: autoridad, dirección y responsabilidad hacia el mundo." },
  ],
  en: [
    { mark: "小", title: "Page",   body: "Apprentice and messenger. Curiosity, study, news; the element being born." },
    { mark: "騎", title: "Knight", body: "The element launched into the world: drive, quest, action (sometimes excess)." },
    { mark: "后", title: "Queen",  body: "Inner mastery: receptive maturity, nurturing and sustaining from within." },
    { mark: "王", title: "King",   body: "Outer mastery: authority, direction, and responsibility toward the world." },
  ],
};

const STAGES = {
  es: [
    { range: "0 – VII",    name: "El mundo",    body: "Aprender a actuar: voluntad, vínculos, autoridad, dirección.", from: 0,  to: 7 },
    { range: "VIII – XIV", name: "El alma",     body: "Pruebas interiores: fuerza, soltar, transformación, equilibrio.", from: 8,  to: 14 },
    { range: "XV – XXI",   name: "El espíritu", body: "Fuerzas mayores: ruptura, esperanza, revelación, realización.", from: 15, to: 21 },
  ],
  en: [
    { range: "0 – VII",    name: "The world",  body: "Learning to act: will, bonds, authority, direction.", from: 0,  to: 7 },
    { range: "VIII – XIV", name: "The soul",   body: "Inner trials: strength, letting go, transformation, balance.", from: 8,  to: 14 },
    { range: "XV – XXI",   name: "The spirit", body: "Greater forces: rupture, hope, revelation, fulfillment.", from: 15, to: 21 },
  ],
};

const CONTENT = {
  es: {
    eyebrow: "Claves de lectura",
    title: "Numerología y simbolismo",
    lead: "Una clave de lectura complementaria. El palo te dice <em>en qué terreno</em> estás; el número, <em>en qué punto del ciclo</em>; la figura, una forma de encarnarlo; y el Arcano Mayor, la gran fuerza de fondo.",
    fitH: "Cómo encajan las piezas",
    fitBody: "<b>Palo</b> = el área de la vida (Copas: emoción · Oros: lo material · Bastos: pasión y acción · Espadas: mente). <b>Número</b> = la fase o intensidad dentro de esa área. <b>Figura</b> = una forma de encarnar el elemento. <b>Arcano Mayor</b> = el tema de fondo que da sentido a todo lo demás.",
    numbersH: "Los números", numbersTag: "· As a 10",
    related: "Arcano Mayor afín:",
    courtH: "Las figuras", courtTag: "· La corte",
    courtNote: "Cada figura encarna el elemento de su palo en una etapa distinta de madurez.",
    majorsH: "Los Arcanos Mayores", majorsTag: "· El viaje del Loco",
    majorsIntro: "Los 22 Mayores trazan el viaje del Loco (0) a través de 21 etapas, de la inocencia a la realización en El Mundo (XXI). Suelen leerse en tres etapas de siete cartas. Toca cualquiera para abrir su lectura.",
    majorsNote: "Numerología de los Mayores: reduce su número sumando dígitos para ver afinidades. XIII La Muerte → 1+3 = 4, que resuena con la estructura de El Emperador (IV): todo final reordena los cimientos.",
  },
  en: {
    eyebrow: "Reading keys",
    title: "Numerology & symbolism",
    lead: "A complementary reading key. The suit tells you <em>which terrain</em> you're on; the number, <em>where in the cycle</em>; the figure, a way to embody it; and the Major Arcanum, the great force underneath.",
    fitH: "How the pieces fit",
    fitBody: "<b>Suit</b> = the area of life (Cups: emotion · Coins: the material · Wands: passion and action · Swords: the mind). <b>Number</b> = the phase or intensity within that area. <b>Figure</b> = a way to embody the element. <b>Major Arcanum</b> = the underlying theme that gives meaning to everything else.",
    numbersH: "The numbers", numbersTag: "· Ace to 10",
    related: "Related Major Arcanum:",
    courtH: "The court figures", courtTag: "· The court",
    courtNote: "Each figure embodies its suit's element at a different stage of maturity.",
    majorsH: "The Major Arcana", majorsTag: "· The Fool's journey",
    majorsIntro: "The 22 Major Arcana trace the Fool's journey (0) across 21 stages, from innocence to fulfillment in The World (XXI). They are often read in three stages of seven cards. Tap any one to open its reading.",
    majorsNote: "Numerology of the Majors: reduce the number by adding its digits to see affinities. XIII Death → 1+3 = 4, which resonates with the structure of The Emperor (IV): every ending reorders the foundations.",
  },
};

function majorByNumber(n) {
  return getPure().find((c) => c.group === "major" && c.number === n) || null;
}

function viewHTML() {
  const lang = getLang();
  const c = CONTENT[lang] || CONTENT.es;
  const numbers = NUMBERS[lang] || NUMBERS.es;
  const court = COURT[lang] || COURT.es;
  const stages = STAGES[lang] || STAGES.es;
  const majors = getPure().filter((m) => m.group === "major");

  const numberRows = numbers.map((it) => {
    const m = majorByNumber(it.n);
    const link = m
      ? `<button class="num-major" data-id="${esc(m.id)}">${esc(m.roman)} · ${esc(cardName(m))}</button>`
      : "";
    return `<div class="numrow">
      <div class="nn">${it.n}</div>
      <div class="nb"><b>${esc(it.title)}</b>${esc(it.body)}${link ? `<div class="num-ref">${esc(c.related)} ${link}</div>` : ""}</div>
    </div>`;
  }).join("");

  const courtRows = court.map((it) =>
    `<div class="numrow"><div class="nn glyph">${esc(it.mark)}</div>
      <div class="nb"><b>${esc(it.title)}</b>${esc(it.body)}</div></div>`
  ).join("");

  const stageBlocks = stages.map((st) => {
    const chips = majors
      .filter((m) => m.number >= st.from && m.number <= st.to)
      .map((m) => `<button class="major-chip" data-id="${esc(m.id)}" title="${esc(cardName(m))}">
          <span class="mc-roman">${esc(m.roman)}</span><span class="mc-name">${esc(cardName(m))}</span></button>`)
      .join("");
    return `<div class="stage">
      <div class="stage-head"><span class="stage-range">${esc(st.range)}</span>
        <span class="stage-name">${esc(st.name)}</span></div>
      <p class="stage-body">${esc(st.body)}</p>
      <div class="major-chips">${chips}</div>
    </div>`;
  }).join("");

  return `
    <div class="pad-top">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h2 class="title">${esc(c.title)}</h2>
      <p class="lead">${c.lead}</p>

      <section class="panel">
        <h3>${esc(c.fitH)}</h3>
        <p>${c.fitBody}</p>
      </section>

      <section class="panel">
        <h3>${esc(c.numbersH)} <span class="tag">${esc(c.numbersTag)}</span></h3>
        <div class="numlist">${numberRows}</div>
      </section>

      <section class="panel">
        <h3>${esc(c.courtH)} <span class="tag">${esc(c.courtTag)}</span></h3>
        <p class="muted-note">${esc(c.courtNote)}</p>
        <div class="numlist">${courtRows}</div>
      </section>

      <section class="panel">
        <h3>${esc(c.majorsH)} <span class="tag">${esc(c.majorsTag)}</span></h3>
        <p>${esc(c.majorsIntro)}</p>
        <div class="stages">${stageBlocks}</div>
        <p class="muted-note">${esc(c.majorsNote)}</p>
      </section>
    </div>`;
}

let numWired = false;
function onNumClick(e) {
  const b = e.target.closest("[data-id]");
  if (!b) return;
  const majorIds = getPure().filter((m) => m.group === "major").map((m) => m.id);
  setContext({ listIds: majorIds });
  openSheet(b.dataset.id);
}

export function initNumerologia() {
  const el = document.getElementById("view-numerologia");
  el.innerHTML = viewHTML();
  if (!numWired) { el.addEventListener("click", onNumClick); numWired = true; }
}
