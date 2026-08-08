/* simbolos.js — vista Glosario · Símbolos. Referencia de la estructura del tarot
   (Mayores, palos y elementos, la corte) + glosario de símbolos Waite-Smith.
   Contenido estático bilingüe co-localizado, mismo patrón que uso.js. */

import { SUITS } from "./deck.js";
import { getLang } from "./i18n.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Palos: elemento + nota corta (sin repetir el elemento: el chip ya lo dice)
   + la pregunta que ese terreno responde. */
const SUIT_INFO = {
  es: {
    cups:   { name: "Copas",   el: "Agua",   note: "Las emociones, los vínculos y la vida interior. Se adapta, fluye y refleja.",     q: "¿Qué siento?" },
    coins:  { name: "Oros",    el: "Tierra", note: "Lo material y lo concreto: cuerpo, trabajo, dinero, hogar. Sostiene y da fruto.", q: "¿Qué tengo y qué construyo?" },
    wands:  { name: "Bastos",  el: "Fuego",  note: "La pasión, la voluntad y la acción. Ilumina y también consume.",                   q: "¿Qué deseo?" },
    swords: { name: "Espadas", el: "Aire",   note: "La mente, la verdad y el conflicto. Corta, aclara y a veces hiere.",               q: "¿Qué pienso?" },
  },
  en: {
    cups:   { name: "Cups",      el: "Water", note: "Emotion, bonds, and the inner life. It adapts, flows, and reflects.",              q: "What do I feel?" },
    coins:  { name: "Pentacles", el: "Earth", note: "The material and concrete: body, work, money, home. It sustains and bears fruit.", q: "What do I have and what am I building?" },
    wands:  { name: "Wands",     el: "Fire",  note: "Passion, will, and action. It illuminates and also consumes.",                     q: "What do I want?" },
    swords: { name: "Swords",    el: "Air",   note: "The mind, truth, and conflict. It cuts, clarifies, and sometimes wounds.",         q: "What do I think?" },
  },
};

/* La corte como camino de madurez del elemento (Sota → Rey). */
const COURT = {
  es: [
    { name: "Sota",      hook: "el aprendizaje", note: "Primer contacto con el elemento: curiosidad, estudio, mensajes que llegan." },
    { name: "Caballero", hook: "la búsqueda",    note: "El elemento en movimiento: persigue su objetivo con entrega, a veces sin freno." },
    { name: "Reina",     hook: "la maduración",  note: "El elemento dominado hacia dentro: lo comprende, lo sostiene y lo nutre." },
    { name: "Rey",       hook: "la maestría",    note: "El elemento gobernado hacia fuera: dirige, decide y da estructura." },
  ],
  en: [
    { name: "Page",   hook: "learning",  note: "First contact with the element: curiosity, study, messages arriving." },
    { name: "Knight", hook: "the quest", note: "The element in motion: pursuing its goal with devotion, sometimes without brakes." },
    { name: "Queen",  hook: "maturing",  note: "The element mastered inward: she understands it, holds it, and nurtures it." },
    { name: "King",   hook: "mastery",   note: "The element governed outward: he directs, decides, and gives structure." },
  ],
};

/* Glosario de símbolos recurrentes en la imaginería Waite-Smith. */
const SYMBOLS = {
  es: [
    { term: "Montañas",           def: "Retos y metas lejanas; lo que exige esfuerzo para alcanzarse." },
    { term: "Agua (ríos, mares)", def: "Las emociones y el inconsciente. Quieta habla de calma; agitada, de agitación interior." },
    { term: "Sol",                def: "Claridad, vitalidad, éxito visible; lo que ya salió a la luz." },
    { term: "Luna",               def: "Intuición, ciclos, lo que todavía no se ve con claridad." },
    { term: "Estrellas",          def: "Esperanza, guía e inspiración; una promesa a largo plazo." },
    { term: "Nubes",              def: "El mundo mental. Cuando cubren la escena, confusión o ideas que aún no aterrizan." },
    { term: "Rayo",               def: "Revelación súbita; el cambio que irrumpe sin pedir permiso." },
    { term: "Camino o sendero",   def: "El rumbo elegido; un trayecto que está por recorrerse." },
    { term: "Corona",             def: "Logro, dominio, autoridad — y su pérdida cuando cae al suelo." },
    { term: "Rosas y lirios",     def: "El deseo y la pureza: la pasión (rosa roja) equilibrada con la intención limpia (lirio blanco)." },
    { term: "Granadas",           def: "Fertilidad, abundancia y misterio; la vida que germina en lo oculto." },
    { term: "Pilares",            def: "Dualidad y umbral: entre dos fuerzas opuestas se pasa hacia el misterio." },
    { term: "Velo o cortina",     def: "Lo oculto; conocimiento que espera detrás de la superficie." },
    { term: "Jardín amurallado",  def: "Seguridad y logro protegido; a veces, también encierro." },
    { term: "Perro y animales fieles", def: "El instinto amigo, la lealtad que acompaña el camino." },
    { term: "Serpiente",          def: "Transformación y conocimiento; también la tentación." },
    { term: "Figuras aladas",     def: "Un llamado superior; el mensaje que viene del espíritu." },
    { term: "Armadura",           def: "Protección y defensa; alguien preparado para el conflicto." },
    { term: "Venda en los ojos",  def: "No poder — o no querer — ver; decidir sin toda la información." },
    { term: "Barcos",             def: "Travesías y comercio; lo que llega de lejos o parte hacia allá." },
    { term: "Trono",              def: "Poder establecido; una posición ya consolidada." },
    { term: "Lemniscata (∞)",     def: "Energía sin fin; la maestría que se renueva a sí misma." },
  ],
  en: [
    { term: "Mountains",          def: "Challenges and distant goals; what demands effort to be reached." },
    { term: "Water (rivers, seas)", def: "Emotions and the unconscious. Still water speaks of calm; churning water, of inner turmoil." },
    { term: "Sun",                def: "Clarity, vitality, visible success; what has already come to light." },
    { term: "Moon",               def: "Intuition, cycles, what cannot yet be seen clearly." },
    { term: "Stars",              def: "Hope, guidance, and inspiration; a long-term promise." },
    { term: "Clouds",             def: "The mental world. When they cover the scene: confusion, or ideas not yet landed." },
    { term: "Lightning",          def: "Sudden revelation; change that breaks in without asking permission." },
    { term: "Path or road",       def: "The chosen direction; a journey yet to be walked." },
    { term: "Crown",              def: "Achievement, dominion, authority — and its loss when it falls." },
    { term: "Roses and lilies",   def: "Desire and purity: passion (red rose) balanced with clean intention (white lily)." },
    { term: "Pomegranates",       def: "Fertility, abundance, and mystery; life germinating in the hidden." },
    { term: "Pillars",            def: "Duality and threshold: between two opposing forces lies the way into mystery." },
    { term: "Veil or curtain",    def: "The hidden; knowledge waiting behind the surface." },
    { term: "Walled garden",      def: "Safety and protected achievement; sometimes, enclosure too." },
    { term: "Dog and loyal animals", def: "Friendly instinct; the loyalty that walks beside you." },
    { term: "Serpent",            def: "Transformation and knowledge; also temptation." },
    { term: "Winged figures",     def: "A higher calling; the message that comes from spirit." },
    { term: "Armor",              def: "Protection and defense; someone ready for conflict." },
    { term: "Blindfold",          def: "Being unable — or unwilling — to see; deciding without full information." },
    { term: "Ships",              def: "Voyages and trade; what arrives from afar or sets out toward it." },
    { term: "Throne",             def: "Established power; a position already consolidated." },
    { term: "Lemniscate (∞)",     def: "Endless energy; mastery that renews itself." },
  ],
};

const CONTENT = {
  es: {
    eyebrow: "Referencia",
    title: "Símbolos y estructura",
    lead: "Cómo encajan las piezas del tarot: las grandes fuerzas de los Mayores, los cuatro terrenos de los Menores, el camino de la corte y los símbolos que pueblan las cartas.",
    majors: {
      h: "Los 22 Arcanos Mayores",
      p: [
        "Los Mayores nombran las <b>grandes fuerzas</b> de una etapa de la vida: transformaciones, lecciones de fondo, momentos que marcan. Cuando aparecen en una tirada, señalan el hilo central — lo que está en juego más allá del día a día.",
        "Su secuencia suele leerse como un <b>viaje</b>: la conciencia que parte inocente, atraviesa pruebas y maestros, y regresa completa. Por eso una lectura con varios Mayores habla de un capítulo importante, no de un trámite.",
      ],
      j0: "0 · El Loco", jmid: "el viaje", j21: "XXI · El Mundo",
    },
    minors: {
      h: "Los 56 Arcanos Menores",
      p: "Los Menores hablan del <b>día a día</b>: situaciones, estados de ánimo, decisiones concretas. Cada palo se corresponde con un <b>elemento</b> que define su temperamento, y responde a una pregunta distinta.",
      qLabel: "Su pregunta",
      note: 'Dentro de cada palo, el <b>número</b> (As–10) marca la fase del ciclo: el As es la semilla del elemento y el 10 su culminación. Encuentras el detalle de cada número en <a href="#glosario/numerologia">Números</a>.',
    },
    court: {
      h: "La corte: un camino de madurez",
      p: "Las cuatro <b>figuras</b> de cada palo trazan un camino: cada una encarna el elemento en una etapa distinta — de quien apenas lo descubre a quien lo gobierna. Pueden ser personas a tu alrededor, o facetas tuyas frente a ese terreno.",
      note: "Por ejemplo: el Caballero de Copas persigue un anhelo del corazón; el de Espadas, una idea o una verdad. La figura pone la etapa; el palo pone el terreno.",
      order: "Ojo con el orden: el 1→4 numera la <b>madurez</b> (la Sota abre el camino, el Rey lo culmina), no el rango. En jerarquía de corte es al revés: el Rey encabeza y la Sota es la más joven. Cuando te salga una figura, pregúntate en qué etapa de ese terreno estás tú.",
    },
    table: {
      h: "Correspondencias rápidas",
      cols: ["Palo", "Elemento", "Terreno", "Pregunta"],
      rows: {
        cups:   ["Copas",   "Agua",   "Emociones y vínculos",  "¿Qué siento?"],
        coins:  ["Oros",    "Tierra", "Cuerpo y lo material",  "¿Qué tengo?"],
        wands:  ["Bastos",  "Fuego",  "Voluntad y acción",     "¿Qué deseo?"],
        swords: ["Espadas", "Aire",   "Mente y palabra",       "¿Qué pienso?"],
      },
    },
    map: {
      h: "El mapa de la carta",
      p: "No solo importa <b>qué</b> aparece en la ilustración, sino <b>dónde</b> aparece. La carta es un pequeño mapa, y cada zona tiene su lectura:",
      items: [
        "<b>Arriba — el cielo.</b> El mundo mental y espiritual: ideas, ideales, lo que se piensa o se anhela. Por eso el aire, las nubes y las revelaciones viven en la parte alta.",
        "<b>Abajo — el suelo.</b> Lo material y lo corporal: lo que sostiene a la figura. Fíjate en qué pisa: ¿tierra fértil, roca árida, agua, el borde de un abismo?",
        "<b>El primer plano.</b> Lo inmediato: lo que la carta te pone enfrente y no puedes ignorar.",
        "<b>El fondo.</b> El contexto: lo lejano, lo pendiente o lo que quedó atrás — montañas por escalar, pueblos que se dejaron, barcos que se van.",
        "<b>La mirada y el cuerpo de la figura.</b> Hacia dónde mira o camina apunta la dirección de la energía: hacia lo que viene, hacia lo que dejó, o hacia lo que se niega a ver.",
        "<b>Cuenta los objetos.</b> Las copas, espadas, bastos u oros en escena repiten el número de la carta — y cómo están dispuestos (ordenados, caídos, en equilibrio) dibuja la fase del ciclo.",
      ],
      note: 'Combina este mapa con el significado de cada número en <a href="#glosario/numerologia">Números</a>: el número dice la fase; la escena, cómo se está viviendo.',
    },
    symbols: {
      h: "Glosario de símbolos",
      p: "Las cartas están llenas de detalles puestos a propósito: paisajes, objetos, colores. Reconocerlos te ayuda a leer lo que la ilustración quiere decir más allá del nombre de la carta. Estos son algunos de los más frecuentes en la imaginería clásica:",
      note: "Un símbolo no impone un significado: lo sugiere. Deja que el detalle que te llame la atención guíe tu lectura — si tus ojos fueron ahí, algo tiene que decirte.",
    },
  },
  en: {
    eyebrow: "Reference",
    title: "Symbols and structure",
    lead: "How the pieces of tarot fit together: the great forces of the Majors, the four terrains of the Minors, the court's path, and the symbols that populate the cards.",
    majors: {
      h: "The 22 Major Arcana",
      p: [
        "The Majors name the <b>great forces</b> of a chapter of life: transformations, underlying lessons, defining moments. When they appear in a spread, they mark the central thread — what is at stake beyond the everyday.",
        "Their sequence is often read as a <b>journey</b>: consciousness setting out innocent, passing through trials and teachers, and returning whole. That is why a reading with several Majors speaks of an important chapter, not a routine matter.",
      ],
      j0: "0 · The Fool", jmid: "the journey", j21: "XXI · The World",
    },
    minors: {
      h: "The 56 Minor Arcana",
      p: "The Minors speak to <b>daily life</b>: situations, moods, concrete decisions. Each suit corresponds to an <b>element</b> that defines its temperament, and answers a different question.",
      qLabel: "Its question",
      note: 'Within each suit, the <b>number</b> (Ace–10) marks the phase of the cycle: the Ace is the seed of the element and the 10 its culmination. Find the detail of each number in <a href="#glosario/numerologia">Numbers</a>.',
    },
    court: {
      h: "The court: a path of maturity",
      p: "The four <b>court figures</b> of each suit trace a path: each embodies the element at a different stage — from the one just discovering it to the one who governs it. They can be people around you, or facets of yourself facing that terrain.",
      note: "For example: the Knight of Cups pursues a longing of the heart; the Knight of Swords, an idea or a truth. The figure sets the stage; the suit sets the terrain.",
      order: "Mind the order: 1→4 numbers <b>maturity</b> (the Page opens the path, the King completes it), not rank. In court hierarchy it's the other way around: the King leads and the Page is the youngest. When a figure comes up, ask yourself what stage of that terrain you are in.",
    },
    table: {
      h: "Quick correspondences",
      cols: ["Suit", "Element", "Terrain", "Question"],
      rows: {
        cups:   ["Cups",      "Water", "Emotions and bonds",   "What do I feel?"],
        coins:  ["Pentacles", "Earth", "Body and the material", "What do I have?"],
        wands:  ["Wands",     "Fire",  "Will and action",      "What do I want?"],
        swords: ["Swords",    "Air",   "Mind and word",        "What do I think?"],
      },
    },
    map: {
      h: "The map of the card",
      p: "It's not only <b>what</b> appears in the illustration that matters, but <b>where</b> it appears. The card is a little map, and each zone has its reading:",
      items: [
        "<b>Above — the sky.</b> The mental and spiritual world: ideas, ideals, what is thought or longed for. That's why air, clouds, and revelations live in the upper part.",
        "<b>Below — the ground.</b> The material and bodily: what holds the figure up. Notice what they stand on: fertile soil, barren rock, water, the edge of a cliff?",
        "<b>The foreground.</b> The immediate: what the card puts in front of you and won't let you ignore.",
        "<b>The background.</b> The context: the distant, the pending, or what was left behind — mountains to climb, towns departed, ships sailing away.",
        "<b>The figure's gaze and body.</b> Where they look or walk points the direction of the energy: toward what's coming, what was left, or what they refuse to see.",
        "<b>Count the objects.</b> The cups, swords, wands, or pentacles in the scene repeat the card's number — and how they're arranged (ordered, fallen, balanced) draws the phase of the cycle.",
      ],
      note: 'Combine this map with the meaning of each number in <a href="#glosario/numerologia">Numbers</a>: the number tells the phase; the scene, how it is being lived.',
    },
    symbols: {
      h: "Glossary of symbols",
      p: "The cards are full of details placed on purpose: landscapes, objects, colors. Recognizing them helps you read what the illustration means beyond the card's name. These are some of the most frequent in classic imagery:",
      note: "A symbol doesn't impose a meaning: it suggests one. Let the detail that catches your eye guide your reading — if your eyes went there, it has something to tell you.",
    },
  },
};

export function initSimbolos() {
  const el = document.getElementById("view-simbolos");
  const lang = getLang();
  const c = CONTENT[lang] || CONTENT.es;
  const info = SUIT_INFO[lang] || SUIT_INFO.es;
  const court = COURT[lang] || COURT.es;
  const symbols = SYMBOLS[lang] || SYMBOLS.es;

  /* Palos como tarjetas: acento de grupo + chip de elemento (una sola mención). */
  const suitCards = ["cups", "coins", "wands", "swords"].map((g) =>
    `<div class="suit-card ${SUITS[g].groupClass}">
      <div class="sc-head">
        <span class="sc-name">${esc(info[g].name)}</span>
        <span class="sc-el">${esc(info[g].el)}</span>
      </div>
      <p class="sc-note">${esc(info[g].note)}</p>
      <p class="sc-q"><span>${esc(c.minors.qLabel)}:</span> ${esc(info[g].q)}</p>
    </div>`
  ).join("");

  /* La corte como camino: pasos conectados por una línea. */
  const courtPath = court.map((f, i) =>
    `<div class="path-step">
      <div class="ps-dot" aria-hidden="true">${i + 1}</div>
      <div class="ps-body">
        <div class="ps-name">${esc(f.name)} <span class="ps-hook">· ${esc(f.hook)}</span></div>
        <p class="ps-note">${esc(f.note)}</p>
      </div>
    </div>`
  ).join("");

  const tableRows = ["cups", "coins", "wands", "swords"].map((g) => {
    const r = c.table.rows[g];
    return `<tr class="${SUITS[g].groupClass}">
      <td class="ct-suit">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="ct-q">${esc(r[3])}</td>
    </tr>`;
  }).join("");

  const glossRows = symbols.map((s) =>
    `<div class="gloss-row">
      <span class="gloss-term">${esc(s.term)}</span>
      <span class="gloss-def">${esc(s.def)}</span>
    </div>`
  ).join("");

  el.innerHTML = `
    <div class="pad-top prose">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h2 class="title">${esc(c.title)}</h2>
      <p class="lead">${esc(c.lead)}</p>

      <section class="panel">
        <h3>${esc(c.majors.h)}</h3>
        ${c.majors.p.map((p) => `<p>${p}</p>`).join("")}
        <div class="journey" aria-hidden="true">
          <span class="j-end">${esc(c.majors.j0)}</span>
          <span class="j-line"><span class="j-mid">${esc(c.majors.jmid)}</span></span>
          <span class="j-end">${esc(c.majors.j21)}</span>
        </div>
      </section>

      <section class="panel">
        <h3>${esc(c.minors.h)}</h3>
        <p>${c.minors.p}</p>
        <div class="suit-cards">${suitCards}</div>
        <p class="muted-note">${c.minors.note}</p>
      </section>

      <section class="panel">
        <h3>${esc(c.court.h)}</h3>
        <p>${c.court.p}</p>
        <div class="court-path">${courtPath}</div>
        <p class="muted-note">${esc(c.court.note)}</p>
        <p class="muted-note">${c.court.order}</p>
      </section>

      <section class="panel">
        <h3>${esc(c.table.h)}</h3>
        <div class="corr-wrap">
          <table class="corr-table">
            <thead><tr>${c.table.cols.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <h3>${esc(c.map.h)}</h3>
        <p>${c.map.p}</p>
        <ul>${c.map.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        <p class="muted-note">${c.map.note}</p>
      </section>

      <section class="panel">
        <h3>${esc(c.symbols.h)}</h3>
        <p>${esc(c.symbols.p)}</p>
        <div class="gloss-list">${glossRows}</div>
        <p class="muted-note">${esc(c.symbols.note)}</p>
      </section>
    </div>`;
}
