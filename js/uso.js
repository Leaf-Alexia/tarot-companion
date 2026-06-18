/* uso.js — vista "Cómo usar el tarot". Contenido de referencia estático:
   cómo prepararse, interpretar en vez de predecir, la estructura del mazo
   (Mayores/Menores y los cuatro palos) y las posiciones de las cartas.
   Tono: guía y acompañante, no oráculo. */

import { SUITS } from "./deck.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SUIT_NOTES = {
  cups:   "El terreno de las emociones, los vínculos y la vida interior.",
  coins:  "Lo material y lo concreto: cuerpo, trabajo, dinero, hogar.",
  wands:  "La pasión, la voluntad y la acción; lo que enciende el impulso.",
  swords: "La mente, la verdad y el conflicto; pensamiento y comunicación.",
};

export function initUso() {
  const el = document.getElementById("view-uso");

  const suits = ["cups", "coins", "wands", "swords"].map((g) =>
    `<div class="suit-row ${SUITS[g].groupClass}">
      <span class="suit-name">${esc(SUITS[g].label)}</span>
      <span class="suit-note">${esc(SUIT_NOTES[g])}</span>
    </div>`
  ).join("");

  el.innerHTML = `
    <div class="pad-top prose">
      <p class="eyebrow">Antes de empezar</p>
      <h2 class="title">Cómo usar el tarot</h2>
      <p class="lead">El tarot no adivina el futuro: ordena el presente. Es un espejo para mirar tu situación desde otro ángulo. Aquí no hay predicciones ni respuestas cerradas, solo una guía para acompañarte en la lectura.</p>

      <section class="panel">
        <h3>Qué tener en mente</h3>
        <ul>
          <li><b>Busca un momento tranquilo.</b> Respira, baja el ritmo. La lectura empieza por tu propia calma.</li>
          <li><b>Formula una intención, no una exigencia.</b> «¿Qué necesito ver sobre esto?» abre más que «¿Qué va a pasar?».</li>
          <li><b>No hay cartas buenas ni malas.</b> Cada arcano tiene luz y sombra; el contexto decide qué pesa.</li>
          <li><b>Tú interpretas, no la carta.</b> Las palabras clave son un punto de partida, no un veredicto.</li>
        </ul>
      </section>

      <section class="panel">
        <h3>Interpretar, no predecir</h3>
        <p>Cada arcano describe una <b>energía</b>, no un hecho fijo. Una misma carta puede hablar de algo externo o de algo dentro de ti. Léela junto a tu pregunta y a las cartas vecinas: el sentido nace de la relación entre ellas, no de una sola en aislado.</p>
        <p>En esta app cada carta se lee en dos capas: la <b>energía pura</b> del arcano (universal) y, si tienes un mazo activo, el <b>matiz</b> con que ese mazo la expresa. La energía pura es siempre tu base; el mazo la colorea.</p>
      </section>

      <section class="panel">
        <h3>Mayores y Menores</h3>
        <p>Los <b>22 Arcanos Mayores</b> nombran las grandes fuerzas y temas de fondo de una etapa de la vida: marcan el hilo central de una lectura. Los <b>56 Arcanos Menores</b> hablan del día a día y se reparten en cuatro palos, cada uno ligado a un elemento y a un área de la vida.</p>
        <div class="suit-list">${suits}</div>
        <p class="muted-note">Dentro de cada palo, el <b>número</b> (As–10) marca la fase del ciclo y las <b>figuras</b> (Sota, Caballero, Reina, Rey) encarnan el elemento en distintas etapas de madurez. Encuentras el detalle en <a href="#numerologia">Numerología</a>.</p>
      </section>

      <section class="panel">
        <h3>Las posiciones de las cartas</h3>
        <p>En una tirada, <b>el lugar que ocupa una carta cambia su significado</b>. La misma carta no dice lo mismo en «pasado» que en «consejo». Antes de extraer, decide qué representa cada posición; así cada arcano responde a una pregunta concreta.</p>
        <p>Una carta puede salir <b>del derecho</b> (su energía fluye con claridad) o <b>invertida</b> (su sombra: la energía bloqueada, en exceso o vuelta hacia dentro). En cada lectura encontrarás ambas caras descritas.</p>
        <p>¿Listo para probar? Empieza por la <a href="#tiradas">Carta del día</a> o explora los <a href="#arcanos">78 arcanos</a>.</p>
      </section>
    </div>`;
}
