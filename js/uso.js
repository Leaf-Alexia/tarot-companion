/* uso.js — vista Glosario · Cómo leer. Guía práctica de lectura, bilingüe.
   Tono: guía y acompañante, no oráculo. La referencia de estructura y símbolos
   vive en simbolos.js; la numerología en numerology.js. */

import { getLang } from "./i18n.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
    anatomy: {
      h: "La anatomía de una carta",
      p: "El nombre de una carta ya trae media lectura. Aprende a desarmarlo:",
      items: [
        "<b>«Cinco de Copas»</b> = número + palo. El <b>número</b> dice en qué fase del ciclo está la energía; el <b>palo</b> dice en qué terreno de la vida ocurre.",
        "<b>«Reina de Bastos»</b> = figura + palo. La <b>figura</b> dice en qué etapa de madurez está esa energía; el palo, otra vez, el terreno.",
        "<b>«La Torre», «El Sol»…</b> = un Arcano Mayor con nombre propio: una fuerza grande que no se reduce a número y palo.",
      ],
      note: 'El detalle de cada pieza vive en <a href="#glosario/simbolos">Símbolos</a> (palos, elementos y corte) y en <a href="#glosario/numerologia">Números</a> (las fases del ciclo).',
    },
    positions: {
      h: "Las posiciones de las cartas",
      p: [
        "En una tirada, <b>el lugar que ocupa una carta cambia su significado</b>. La misma carta no dice lo mismo en «pasado» que en «consejo». Antes de extraer, decide qué representa cada posición; así cada arcano responde a una pregunta concreta.",
        "Una carta puede salir <b>del derecho</b> (su energía fluye con claridad) o <b>invertida</b> (su sombra: la energía bloqueada, en exceso o vuelta hacia dentro). En cada lectura encontrarás ambas caras descritas.",
        '¿Listo para probar? Empieza por la <a href="#tarot/spreads">Carta del día</a> o explora los <a href="#tarot/arcanos">78 arcanos</a>.',
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
    anatomy: {
      h: "The anatomy of a card",
      p: "A card's name already carries half a reading. Learn to take it apart:",
      items: [
        "<b>“Five of Cups”</b> = number + suit. The <b>number</b> tells you what phase of the cycle the energy is in; the <b>suit</b> tells you in which terrain of life it unfolds.",
        "<b>“Queen of Wands”</b> = figure + suit. The <b>figure</b> tells you the energy's stage of maturity; the suit, again, the terrain.",
        "<b>“The Tower,” “The Sun”…</b> = a Major Arcanum with a name of its own: a great force that can't be reduced to number and suit.",
      ],
      note: 'The detail of each piece lives in <a href="#glosario/simbolos">Symbols</a> (suits, elements, and court) and in <a href="#glosario/numerologia">Numbers</a> (the phases of the cycle).',
    },
    positions: {
      h: "The positions of the cards",
      p: [
        "In a spread, <b>the place a card occupies changes its meaning</b>. The same card doesn't say the same thing in “past” as in “advice.” Before you draw, decide what each position represents; that way each arcanum answers a concrete question.",
        "A card can come up <b>upright</b> (its energy flows clearly) or <b>reversed</b> (its shadow: the energy blocked, in excess, or turned inward). In every reading you'll find both faces described.",
        'Ready to try? Start with the <a href="#tarot/spreads">Card of the day</a> or explore the <a href="#tarot/arcanos">78 arcana</a>.',
      ],
    },
  },
};

export function initUso() {
  const el = document.getElementById("view-uso");
  const c = CONTENT[getLang()] || CONTENT.es;

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
        <h3>${esc(c.anatomy.h)}</h3>
        <p>${esc(c.anatomy.p)}</p>
        <ul>${c.anatomy.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        <p class="muted-note">${c.anatomy.note}</p>
      </section>

      <section class="panel">
        <h3>${esc(c.positions.h)}</h3>
        ${c.positions.p.map((p) => `<p>${p}</p>`).join("")}
      </section>
    </div>`;
}
