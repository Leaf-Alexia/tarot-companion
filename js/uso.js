/* uso.js — vista "Cómo usar el tarot". Contenido de referencia estático, bilingüe.
   Tono: guía y acompañante, no oráculo. */

import { SUITS } from "./deck.js";
import { getLang, t } from "./i18n.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SUIT_NOTES = {
  es: {
    cups:   "El terreno de las emociones, los vínculos y la vida interior.",
    coins:  "Lo material y lo concreto: cuerpo, trabajo, dinero, hogar.",
    wands:  "La pasión, la voluntad y la acción; lo que enciende el impulso.",
    swords: "La mente, la verdad y el conflicto; pensamiento y comunicación.",
  },
  en: {
    cups:   "The realm of emotion, bonds, and the inner life.",
    coins:  "The material and concrete: body, work, money, home.",
    wands:  "Passion, will, and action; what sparks the drive.",
    swords: "The mind, truth, and conflict; thought and communication.",
  },
};

const CONTENT = {
  es: {
    eyebrow: "Antes de empezar",
    title: "Cómo usar el tarot",
    lead: "El tarot no adivina el futuro: ordena el presente. Es un espejo para mirar tu situación desde otro ángulo. Aquí no hay predicciones ni respuestas cerradas, solo una guía para acompañarte en la lectura.",
    mind: {
      h: "Qué tener en mente",
      items: [
        "<b>Busca un momento tranquilo.</b> Respira, baja el ritmo. La lectura empieza por tu propia calma.",
        "<b>Formula una intención, no una exigencia.</b> «¿Qué necesito ver sobre esto?» abre más que «¿Qué va a pasar?».",
        "<b>No hay cartas buenas ni malas.</b> Cada arcano tiene luz y sombra; el contexto decide qué pesa.",
        "<b>Tú interpretas, no la carta.</b> Las palabras clave son un punto de partida, no un veredicto.",
      ],
    },
    interpret: {
      h: "Interpretar, no predecir",
      p: [
        "Cada arcano describe una <b>energía</b>, no un hecho fijo. Una misma carta puede hablar de algo externo o de algo dentro de ti. Léela junto a tu pregunta y a las cartas vecinas: el sentido nace de la relación entre ellas, no de una sola en aislado.",
        "En esta app cada carta se lee en dos capas: la <b>energía pura</b> del arcano (universal) y, si tienes un mazo activo, el <b>matiz</b> con que ese mazo la expresa. La energía pura es siempre tu base; el mazo la colorea.",
      ],
    },
    structure: {
      h: "Mayores y Menores",
      p: "Los <b>22 Arcanos Mayores</b> nombran las grandes fuerzas y temas de fondo de una etapa de la vida: marcan el hilo central de una lectura. Los <b>56 Arcanos Menores</b> hablan del día a día y se reparten en cuatro palos, cada uno ligado a un elemento y a un área de la vida.",
      note: 'Dentro de cada palo, el <b>número</b> (As–10) marca la fase del ciclo y las <b>figuras</b> (Sota, Caballero, Reina, Rey) encarnan el elemento en distintas etapas de madurez. Encuentras el detalle en <a href="#numerologia">Numerología</a>.',
    },
    positions: {
      h: "Las posiciones de las cartas",
      p: [
        "En una tirada, <b>el lugar que ocupa una carta cambia su significado</b>. La misma carta no dice lo mismo en «pasado» que en «consejo». Antes de extraer, decide qué representa cada posición; así cada arcano responde a una pregunta concreta.",
        "Una carta puede salir <b>del derecho</b> (su energía fluye con claridad) o <b>invertida</b> (su sombra: la energía bloqueada, en exceso o vuelta hacia dentro). En cada lectura encontrarás ambas caras descritas.",
        '¿Listo para probar? Empieza por la <a href="#tiradas">Carta del día</a> o explora los <a href="#arcanos">78 arcanos</a>.',
      ],
    },
  },
  en: {
    eyebrow: "Before you begin",
    title: "How to use tarot",
    lead: "Tarot doesn't foretell the future: it brings order to the present. It is a mirror for seeing your situation from another angle. There are no predictions or closed answers here — only a guide to accompany you in the reading.",
    mind: {
      h: "What to keep in mind",
      items: [
        "<b>Find a quiet moment.</b> Breathe, slow down. The reading begins with your own calm.",
        "<b>Set an intention, not a demand.</b> “What do I need to see about this?” opens more than “What will happen?”",
        "<b>There are no good or bad cards.</b> Every arcanum holds light and shadow; context decides which weighs more.",
        "<b>You interpret, not the card.</b> The keywords are a starting point, not a verdict.",
      ],
    },
    interpret: {
      h: "Interpret, don't predict",
      p: [
        "Each arcanum describes an <b>energy</b>, not a fixed fact. The same card can speak of something outside you or within. Read it alongside your question and the neighboring cards: meaning arises from the relationship between them, not from one card alone.",
        "In this app each card is read in two layers: the arcanum's <b>pure energy</b> (universal) and, if you have an active deck, the <b>nuance</b> with which that deck expresses it. The pure energy is always your base; the deck colors it.",
      ],
    },
    structure: {
      h: "Major and Minor",
      p: "The <b>22 Major Arcana</b> name the great forces and underlying themes of a chapter of life: they trace the central thread of a reading. The <b>56 Minor Arcana</b> speak to daily life and split into four suits, each tied to an element and an area of life.",
      note: 'Within each suit, the <b>number</b> (Ace–10) marks the phase of the cycle and the <b>court figures</b> (Page, Knight, Queen, King) embody the element at different stages of maturity. Find the detail in <a href="#numerologia">Numerology</a>.',
    },
    positions: {
      h: "The positions of the cards",
      p: [
        "In a spread, <b>the place a card occupies changes its meaning</b>. The same card doesn't say the same thing in “past” as in “advice.” Before you draw, decide what each position represents; that way each arcanum answers a concrete question.",
        "A card can come up <b>upright</b> (its energy flows clearly) or <b>reversed</b> (its shadow: the energy blocked, in excess, or turned inward). In every reading you'll find both faces described.",
        'Ready to try? Start with the <a href="#tiradas">Card of the day</a> or explore the <a href="#arcanos">78 arcana</a>.',
      ],
    },
  },
};

export function initUso() {
  const el = document.getElementById("view-uso");
  const c = CONTENT[getLang()] || CONTENT.es;
  const notes = SUIT_NOTES[getLang()] || SUIT_NOTES.es;

  const suits = ["cups", "coins", "wands", "swords"].map((g) =>
    `<div class="suit-row ${SUITS[g].groupClass}">
      <span class="suit-name">${esc(t("suit." + g))}</span>
      <span class="suit-note">${esc(notes[g])}</span>
    </div>`
  ).join("");

  el.innerHTML = `
    <div class="pad-top prose">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h2 class="title">${esc(c.title)}</h2>
      <p class="lead">${esc(c.lead)}</p>

      <section class="panel">
        <h3>${esc(c.mind.h)}</h3>
        <ul>${c.mind.items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </section>

      <section class="panel">
        <h3>${esc(c.interpret.h)}</h3>
        ${c.interpret.p.map((p) => `<p>${p}</p>`).join("")}
      </section>

      <section class="panel">
        <h3>${esc(c.structure.h)}</h3>
        <p>${c.structure.p}</p>
        <div class="suit-list">${suits}</div>
        <p class="muted-note">${c.structure.note}</p>
      </section>

      <section class="panel">
        <h3>${esc(c.positions.h)}</h3>
        ${c.positions.p.map((p) => `<p>${p}</p>`).join("")}
      </section>
    </div>`;
}
