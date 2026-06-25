// Redacta energy_es (derecha) + shadow_es (invertida) en ES para los 22 Arcanos Mayores.
// Traducción original y fiel del EN, en español natural y GÉNERO-NEUTRO (sin adjetivos
// marcados en género al dirigirse a la lectora), tono cálido para leerse en voz alta.
// Idempotente: reescribe energy_es/shadow_es de cada id. No toca la capa EN.
// Uso: node scripts/author-majors-es.mjs
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../data/arcana-pure.json", import.meta.url);
const arcana = JSON.parse(readFileSync(path, "utf8"));

const ES = {
  "the-fool": {
    energy: "El Loco es la chispa pura del comienzo: el paso que se da antes de conocer el camino. Hay inocencia aquí, y confianza: la disposición a saltar a lo desconocido con las manos abiertas y el corazón ligero. Esta energía te invita a seguir tu curiosidad, a abrazar la libertad y la posibilidad, y a empezar de cero sin el peso de lo que vino antes.",
    shadow: "Invertido, el salto se vuelve tropiezo. La espontaneidad se desborda en imprudencia, y la apertura en ingenuidad: avanzar sin mirar, ignorar los riesgos reales o negarse a crecer. También puede significar contenerse ante un comienzo que da miedo emprender.",
  },
  "the-magician": {
    energy: "El Mago es la voluntad enfocada hecha manifiesta. Tienes todo lo que necesitas —mente, corazón, cuerpo y oficio— y el poder de canalizar la intención hacia el mundo material. Es la energía de la creación y la concentración: nombra lo que deseas, reúne tus recursos y actúa con confianza, sabiendo que eres tú quien convierte la posibilidad en realidad.",
    shadow: "Invertido, el poder pierde su centro. El talento se dispersa entre demasiadas cosas, o la habilidad se inclina hacia la manipulación, la ilusión y las promesas vacías. Puede señalar potencial sin explotar, inseguridad, o una brecha entre lo que dices y lo que de verdad haces.",
  },
  "the-high-priestess": {
    energy: "La Sacerdotisa es la guardiana del saber interior. Habla en lo callado: a través de la intuición, los sueños y esa sabiduría que percibes pero aún no sabes explicar. Esta energía te pide quietud, confiar en la voz que late bajo el ruido y honrar los misterios que la lógica por sí sola no resuelve. Algunas puertas solo se abren desde dentro.",
    shadow: "Invertida, la voz interior queda ahogada. Tal vez le estés dando la espalda a tu intuición, en medio de la confusión o sin contacto con tus propias profundidades. También puede hablar de secretos guardados con demasiada fuerza, o de una sabiduría retenida que se endurece en juicio frío.",
  },
  "the-empress": {
    energy: "La Emperatriz es la abundancia de la vida misma: creatividad, cuidado y la plenitud generosa de los sentidos. Te invita a crear y a cuidar, a recibir la belleza y el placer sin culpa, y a dejar que lo que atiendes crezca a su propio ritmo. Es tierra fértil: las ideas, los vínculos y los proyectos florecen cuando se los recibe con calidez y paciencia.",
    shadow: "Invertida, la abundancia se vuelve posesiva o se agota. El cuidado se convierte en asfixia, o te entregas tanto a los demás que no queda nada para ti. Puede apuntar a un bloqueo creativo, a olvidarte de ti, o a la belleza vivida como vanidad en lugar de alimento.",
  },
  "the-emperor": {
    energy: "El Emperador es la autoridad firme y el orden que protege lo que importa. Es la energía de la estructura, la disciplina y los límites claros: tomar las riendas de una situación, construir algo duradero y guiar desde la experiencia más que desde el impulso. Mantente firme en tus principios y deja que el poder nazca del respeto ganado, no del miedo.",
    shadow: "Invertido, la autoridad se endurece en tiranía o rigidez. El control manda por miedo en lugar de por respeto, o la terquedad le cierra la puerta a todo cambio. También puede hablar de una pérdida de mando: sentir que no tienes poder, disciplina ni un suelo firme bajo los pies.",
  },
  "the-hierophant": {
    energy: "El Hierofante es la sabiduría que se transmite: la tradición, la enseñanza y las creencias compartidas que dan forma a una comunidad. Esta energía señala a los mentores y a los caminos probados por el tiempo, al aprendizaje dentro de una estructura y al encuentro de tu lugar entre los demás. Hay consuelo y sentido en pertenecer, en el rito y en una senda que muchos recorrieron antes que tú.",
    shadow: "Invertido, la tradición se vuelve jaula. Se siguen las reglas sin cuestionarlas, el dogma reemplaza a la comprensión, o te pliegas a lo que se espera de ti a costa de tu propia verdad. También puede ser la llamada a romper con la convención y encontrar tu propio camino.",
  },
  "the-lovers": {
    energy: "Los Enamorados son la unión y las elecciones que nos comprometen. Es la energía de la conexión profunda —la atracción, la armonía, el encuentro con el otro como un igual verdadero— pero también la de la decisión: elegir en sintonía con tus valores y tu corazón. Cuando eliges desde el amor y no desde el miedo, hasta el compromiso más grande vale lo que pesa.",
    shadow: "Invertidos, la armonía se fractura. La distancia, la indecisión o los valores desalineados tensan el vínculo; quizá estés eligiendo desde el miedo, evitando comprometerte o fuera de sintonía con lo que de verdad quieres. Puede marcar una relación desequilibrada o una decisión que sigues posponiendo.",
  },
  "the-chariot": {
    energy: "El Carro es la voluntad en movimiento: enfoque, empuje y la determinación de conducir fuerzas opuestas hacia una sola meta. Esta energía te pide tomar las riendas, enfrentar los desafíos de frente y avanzar con confianza y disciplina. La victoria no llega solo por la fuerza, sino por sostener tu rumbo firme cuando el camino tira hacia los lados.",
    shadow: "Invertido, el control se escapa. Quizá avances sin dirección, fuerces una situación en lugar de enfrentarla, o te dividan impulsos que tiran en sentidos opuestos. También puede hablar de un avance estancado: energía que se dispersa, o una meta abandonada justo antes de la línea final.",
  },
  "strength": {
    energy: "La Fuerza es el poder sereno que doma sin violencia. Es el valor del corazón: paciencia, temple y la confianza suave que recibe al miedo y a la pasión con compasión en lugar de fuerza. El verdadero poder vive en un espíritu firme: cuando sostienes tu calma, hasta la situación más salvaje se ablanda entre tus manos.",
    shadow: "Invertida, la fuerza interior flaquea. La calma cede ante la rabia, la inseguridad o reacciones que no logras gobernar del todo. Puede significar que una situación te sobrepasa, o forzar el control donde la paciencia era la respuesta.",
  },
  "the-hermit": {
    energy: "El Ermitaño es la sabiduría que se encuentra en la soledad. Esta energía te invita a apartarte del ruido, volverte hacia dentro y dejar que tu propia luz interior guíe el camino. No hay prisa aquí: solo reflexión, prudencia y ese hondo autoconocimiento que nace de andar tu propio sendero a solas por un tiempo. Busca dentro y hallarás la respuesta que ya llevas contigo.",
    shadow: "Invertido, el retiro se vuelve aislamiento. La soledad se agria en abandono doloroso o en evasión, o rechazas toda guía: la tuya y la de los demás. También puede significar volver a salir demasiado pronto, antes de terminar el trabajo interior.",
  },
  "the-wheel": {
    energy: "La Rueda de la Fortuna es el gran girar de la vida: los ciclos, el cambio y los momentos en que el destino mueve el suelo bajo tus pies. Esta energía te recuerda que nada permanece fijo: lo que sube bajará, y lo que cae volverá a subir. Cuando la rueda gire a tu favor, móntala; cuando gire en contra, confía en el flujo, porque el movimiento mismo es la ley de la vida.",
    shadow: "Invertida, peleas contra el giro. La resistencia al cambio alarga un ciclo difícil, o una racha de mala suerte se siente como una condena en vez de una temporada. Puede significar aferrarte a lo que ya se va, o intentar forzar una rueda que gira a su propio tiempo.",
  },
  "justice": {
    energy: "La Justicia es la verdad pesada sin sesgo. Es la energía de la equidad, la responsabilidad y la causa y el efecto claros: toda acción vuelve a encontrarse con su consecuencia. Te pide actuar con integridad, ver una situación tal como es de verdad y hacerte cargo de tu parte. Haz lo correcto por sí mismo, y deja que el resultado siga su curso.",
    shadow: "Invertida, la balanza se inclina. El juicio se vuelve parcial, las decisiones se enfrían o se tornan injustas, o esquivas la responsabilidad de tus actos. También puede significar verdad evitada, o lógica aplicada sin un rastro de compasión.",
  },
  "the-hanged-one": {
    energy: "El Colgado es la sabiduría de la pausa. Al rendir el control y quedar suspendido en la quietud, ganas un ángulo nuevo sobre todo lo que creías saber. Esta energía te pide soltar, dejar de empujar y mirar la situación al revés, porque a veces la única manera de avanzar es soltar, esperar y dejar que la comprensión llegue por sí sola.",
    shadow: "Invertido, la pausa se vuelve parálisis. La entrega se convierte en estancamiento, o te resistes al giro de perspectiva que el momento pide. Puede significar sacrificio inútil, estancamiento, o aferrarte al control cuando soltar es el único camino que atraviesa.",
  },
  "death": {
    energy: "La Muerte es el gran umbral: el final que despeja el paso a lo que viene. Esta energía no es pérdida porque sí, sino transformación: algo debe cerrarse para que algo más verdadero pueda empezar. Mira el final con honestidad, suelta lo que ya cumplió su ciclo y deja que algo nuevo te rehaga. Todo tránsito deja sitio para la vida.",
    shadow: "Invertida, el final se resiste. El miedo al cambio prolonga el dolor, o te aferras a lo que ya terminó. Puede significar una transición detenida a medias, o una parte de ti que se niega a dejar morir lo viejo.",
  },
  "temperance": {
    energy: "La Templanza es el arte del equilibrio. Esta energía mezcla los opuestos hasta volverlos armonía: la paciencia sobre la prisa, la mesura sobre el exceso, la unión paciente de las fuerzas hasta que surge algo entero y sanador. Encuentra el camino del medio, atempera tus impulsos y deja que la calma y el cuidado guíen el trabajo lento de devolverle equilibrio a tu vida.",
    shadow: "Invertida, el equilibrio se pierde. El exceso, la impaciencia o los extremos te sacan del centro, y las partes ya no se mezclan. Puede significar una sanación apresurada, fuerzas opuestas mal combinadas, o una vida sin ritmo con ella misma.",
  },
  "the-devil": {
    energy: "El Diablo revela las cadenas que elegimos. Esta energía habla del apego y el deseo: los placeres, los hábitos y las dependencias que pueden enriquecer la vida o esclavizarla en silencio. Te pide mirar con honestidad qué te sujeta: disfruta tus pasiones, pero distingue entre saborear y ser consumido. Las cadenas suelen estar más flojas de lo que parecen.",
    shadow: "Invertido, el agarre empieza a ceder, o se aprieta sin que lo notes. Quizá estés enfrentando un apego, soltando lo que te ataba, o negándote a admitir lo hondo que llega su dominio. Puede marcar el momento doloroso y liberador de nombrar lo que te posee.",
  },
  "the-tower": {
    energy: "La Torre es el rayo súbito que derriba las estructuras falsas. Esta energía es sacudida: un golpe que hace pedazos lo que se construyó sobre suelo inestable, a menudo sin aviso. Puede sentirse como ruina, pero también es liberación: solo cuando cae lo inestable puede alzarse algo más verdadero. Deja ir la vieja estructura; el derrumbe está abriendo espacio.",
    shadow: "Invertida, la sacudida se aplaza o se niega. Quizá te aferres a una estructura que ya se agrieta, temas un cambio que tiene que llegar, o atravieses el desastre negándote a su lección. Cuanto más se resiste la caída, más fuerte aterriza.",
  },
  "the-star": {
    energy: "La Estrella es la esperanza después de la tormenta. Esta energía suave trae renovación, fe y la certeza serena de que las piezas irán encontrando su lugar. Brilla más fuerte cuando la noche es más oscura: un recordatorio para sanar, confiar y seguir caminando hacia el sueño luminoso que te guía. Ábrete; estás justo donde necesitas estar.",
    shadow: "Invertida, la luz se atenúa. La esperanza se apaga en desánimo, duda o la sensación de andar sin rumbo y sin inspiración. Puede significar fe retirada, un sueño abandonado, o la pérdida de confianza en que las cosas saldrán bien.",
  },
  "the-moon": {
    energy: "La Luna es el reino del sueño y la intuición, donde nada es del todo lo que aparenta. Esta energía te pide moverte por lo que sientes más que por la lógica, confiar en tu instinto a través de la niebla y mirar de frente los miedos y fantasías que remueve el subconsciente. No toda puerta se abre a la razón: deja que tu sentido interior te guíe por la oscuridad incierta.",
    shadow: "Invertida, la niebla empieza a levantarse, o se espesa. Tal vez la confusión y el autoengaño se estén disipando y salgan a la luz verdades ocultas; o tal vez la ansiedad, la ilusión y el miedo nublen el camino más que nunca. Mira con cuidado lo que has tenido miedo de ver.",
  },
  "the-sun": {
    energy: "El Sol es resplandor puro: alegría, vitalidad y la claridad cálida que lo trae todo a la luz. Esta energía es éxito y honestidad, la felicidad sencilla de estar plenamente vivo. Vuelca tu entusiasmo en lo que amas y déjate brillar, con libertad y sin arrogancia. Es un tiempo de crecimiento, verdad y celebración.",
    shadow: "Invertido, la luz queda velada. La alegría se siente forzada, o brilla hacia afuera mientras algo dentro sigue vacío; la vanidad o una tristeza pasajera apagan el resplandor. Puede significar un éxito que se demora, o un brillo que no te estás permitiendo sentir.",
  },
  "judgement": {
    energy: "El Juicio es el llamado que no puedes ignorar: un momento de despertar, de balance y de renacimiento. Esta energía te pide mirar tu vida con honestidad, responder a la llamada profunda que viene sonando y levantarte renovada. El pasado se pesa, las lecciones se recogen y se te ofrece la oportunidad de empezar de nuevo, en claro y a paz. Escucha: la campana suena para ti.",
    shadow: "Invertido, el llamado queda sin respuesta. Quizá estés evitando mirarte por dentro, tratándote con dureza, o con miedo a ser juzgada. Puede significar aferrarte al pasado, dudar de tu valor, o ignorar un despertar que sigue tocando a la puerta.",
  },
  "the-world": {
    energy: "El Mundo es la culminación y la plenitud: el viaje que cierra su círculo, la meta alcanzada, todas las piezas al fin integradas. Esta energía es realización y recompensa bien merecida, la satisfacción honda de haber llegado. Honra lo lejos que has llegado, celebra el logro y deja que este final se vuelva el umbral del próximo gran comienzo.",
    shadow: "Invertido, la culminación se siente a un paso de distancia. Un ciclo queda sin terminar, el cierre se demora, o el éxito llega vacío y sin sabor. Puede significar aferrarte a un capítulo que necesita terminar, o detenerte en el último paso antes de la meta.",
  },
};

let patched = 0;
for (const card of arcana) {
  const t = ES[card.id];
  if (!t) continue;
  card.energy_es = t.energy;
  card.shadow_es = t.shadow;
  patched++;
}

const expected = Object.keys(ES).length;
if (patched !== expected) {
  const missing = Object.keys(ES).filter((id) => !arcana.some((c) => c.id === id));
  throw new Error(`Apliqué ${patched}/${expected}. Ids sin coincidencia: ${missing.join(", ")}`);
}

writeFileSync(path, JSON.stringify(arcana, null, 2) + "\n", "utf8");
console.log(`OK · energy_es+shadow_es aplicados a ${patched} Arcanos Mayores`);
