/* numerology.js — vista Numerología. Clave de lectura complementaria:
   significado de los números (As–10), las figuras de la corte y el viaje
   de los 22 Arcanos Mayores (0–21). Los nombres de Mayores abren su lectura. */

import { getPure } from "./deck.js";
import { openSheet, setContext } from "./sheet.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Números As–10: significado universal dentro de cualquier palo. */
const NUMBERS = [
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
];

/* Figuras de la corte: el elemento del palo en distintas etapas de madurez. */
const COURT = [
  { mark: "小", title: "Sota · Page",        body: "Aprendiz y mensajero. Curiosidad, estudio, noticias; el elemento naciendo." },
  { mark: "騎", title: "Caballero · Knight",  body: "El elemento lanzado al mundo: impulso, búsqueda, acción (a veces exceso)." },
  { mark: "后", title: "Reina · Queen",       body: "Maestría interior: madurez receptiva, nutrir y sostener desde adentro." },
  { mark: "王", title: "Rey · King",          body: "Maestría exterior: autoridad, dirección y responsabilidad hacia el mundo." },
];

/* Las tres etapas del viaje del Loco (0–21), siete cartas cada una (0 abre el camino). */
const MAJOR_STAGES = [
  { range: "0 – VII",    name: "El mundo",   body: "Aprender a actuar: voluntad, vínculos, autoridad, dirección.", from: 0,  to: 7 },
  { range: "VIII – XIV", name: "El alma",    body: "Pruebas interiores: fuerza, soltar, transformación, equilibrio.", from: 8,  to: 14 },
  { range: "XV – XXI",   name: "El espíritu", body: "Fuerzas mayores: ruptura, esperanza, revelación, realización.", from: 15, to: 21 },
];

/* Arcano Mayor cuyo número coincide con n (para enlazar número ↔ arcano). */
function majorByNumber(n) {
  return getPure().find((c) => c.group === "major" && c.number === n) || null;
}

function viewHTML() {
  const majors = getPure().filter((c) => c.group === "major");

  const numberRows = NUMBERS.map((it) => {
    const m = majorByNumber(it.n);
    const link = m
      ? `<button class="num-major" data-id="${esc(m.id)}">${esc(m.roman)} · ${esc(m.es)}</button>`
      : "";
    return `<div class="numrow">
      <div class="nn">${it.n}</div>
      <div class="nb"><b>${esc(it.title)}</b>${esc(it.body)}${link ? `<div class="num-ref">Arcano Mayor afín: ${link}</div>` : ""}</div>
    </div>`;
  }).join("");

  const courtRows = COURT.map((it) =>
    `<div class="numrow"><div class="nn glyph">${esc(it.mark)}</div>
      <div class="nb"><b>${esc(it.title)}</b>${esc(it.body)}</div></div>`
  ).join("");

  const stages = MAJOR_STAGES.map((st) => {
    const chips = majors
      .filter((c) => c.number >= st.from && c.number <= st.to)
      .map((c) => `<button class="major-chip" data-id="${esc(c.id)}" title="${esc(c.es)}">
          <span class="mc-roman">${esc(c.roman)}</span><span class="mc-name">${esc(c.es)}</span></button>`)
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
      <p class="eyebrow">Reading keys</p>
      <h2 class="title">Numerología y simbolismo</h2>
      <p class="lead">Una clave de lectura complementaria. El palo te dice <em>en qué terreno</em> estás; el número, <em>en qué punto del ciclo</em>; la figura, una forma de encarnarlo; y el Arcano Mayor, la gran fuerza de fondo.</p>

      <section class="panel">
        <h3>Cómo encajan las piezas</h3>
        <p><b>Palo</b> = el área de la vida (Copas: emoción · Oros: lo material · Bastos: pasión y acción · Espadas: mente). <b>Número</b> = la fase o intensidad dentro de esa área. <b>Figura</b> = una forma de encarnar el elemento. <b>Arcano Mayor</b> = el tema de fondo que da sentido a todo lo demás.</p>
      </section>

      <section class="panel">
        <h3>Los números <span class="tag">· As a 10</span></h3>
        <div class="numlist">${numberRows}</div>
      </section>

      <section class="panel">
        <h3>Las figuras <span class="tag">· The Court</span></h3>
        <p class="muted-note">Cada figura encarna el elemento de su palo en una etapa distinta de madurez.</p>
        <div class="numlist">${courtRows}</div>
      </section>

      <section class="panel">
        <h3>Los Arcanos Mayores <span class="tag">· El viaje del Loco</span></h3>
        <p>Los 22 Mayores trazan el viaje del Loco (0) a través de 21 etapas, de la inocencia a la realización en El Mundo (XXI). Suelen leerse en tres etapas de siete cartas. Toca cualquiera para abrir su lectura.</p>
        <div class="stages">${stages}</div>
        <p class="muted-note">Numerología de los Mayores: reduce su número sumando dígitos para ver afinidades. XIII La Muerte → 1+3 = 4, que resuena con la estructura de El Emperador (IV): todo final reordena los cimientos.</p>
      </section>
    </div>`;
}

export function initNumerologia() {
  const el = document.getElementById("view-numerologia");
  el.innerHTML = viewHTML();

  // prev/next del sheet recorre los 22 Mayores cuando se abre desde aquí
  const majorIds = getPure().filter((c) => c.group === "major").map((c) => c.id);

  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-id]");
    if (!b) return;
    setContext({ listIds: majorIds });
    openSheet(b.dataset.id);
  });
}
