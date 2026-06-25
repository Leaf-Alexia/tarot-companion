// Redacta energy_es (derecha) + shadow_es (invertida) en ES para los 56 Arcanos Menores.
// Traducción original y fiel del EN, en español natural y GÉNERO-NEUTRO (sin adjetivos
// marcados en género al dirigirse a la lectora), tono cálido para leerse en voz alta.
// Idempotente: reescribe energy_es/shadow_es de cada id. No toca la capa EN.
// Uso: node scripts/author-minors-es.mjs
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../data/arcana-pure.json", import.meta.url);
const arcana = JSON.parse(readFileSync(path, "utf8"));

const ES = {
  // ── COPAS · agua · emoción, relación, intuición ─────────────────────
  "ace-of-cups": {
    energy: "El As de Copas es el corazón que se abre: un manantial puro de sentimiento, amor y compasión que brota desde dentro. Es la primera gota de un nuevo comienzo emocional: ternura que se ofrece, intuición que fluye, la oportunidad de dar y recibir con el corazón abierto. Permítete sentir, y deja que la copa se desborde.",
    shadow: "Invertido, el manantial se obstruye. Los sentimientos se retienen, se reprimen, o se derraman más rápido de lo que pueden sostenerse. Puede significar vacío emocional, un amor que se niega, o un corazón cerrado a aquello mismo que anhela.",
  },
  "2-of-cups": {
    energy: "El Dos de Copas es la conexión entre iguales: el encuentro de dos corazones en respeto y atracción mutuos. Esta energía es sociedad, armonía y esa alquimia delicada que ocurre cuando dos personas de verdad se ven. Sea en el amor o en la amistad, habla de un vínculo dado con libertad y devuelto con libertad.",
    shadow: "Invertido, el equilibrio se tambalea. Una conexión se agria en tensión, malentendido o distancia; lo que era mutuo se vuelve de un solo lado. Puede significar una despedida, un vínculo que necesita repararse, o una armonía que primero debes restaurar dentro de ti.",
  },
  "3-of-cups": {
    energy: "El Tres de Copas es la alegría compartida: celebración, amistad y el calor de pertenecer a un círculo que te cuida. Esta energía brinda por la buena compañía y la causa común: reencuentros, logros y la felicidad sencilla de estar entre quienes te animan. Déjate llevar por la alegría de los demás.",
    shadow: "Invertido, el círculo se deshilacha. La celebración se desborda en exceso, en chismes o en la sensación de quedar fuera del grupo. Puede significar una amistad tensa, una fiesta que suena hueca, o la necesidad de apartarte de tanto ruido.",
  },
  "4-of-cups": {
    energy: "El Cuatro de Copas es la pausa del descontento: volverte hacia dentro, cansada de lo que se ofrece, esperando a que algo vuelva a moverse. Esta energía invita a una reflexión honesta: nota la apatía, pero nota también la copa que te tienden y que aún no has visto. A veces el regalo que anhelas ya está al alcance de la mano.",
    shadow: "Invertido, la niebla empieza a despejarse. La apatía cede ante un interés renovado, y aceptas la oferta que antes ignorabas. También puede ahondar el repliegue: el aburrimiento que se endurece en evasión, o el rechazo a conectar por puro hábito.",
  },
  "5-of-cups": {
    energy: "El Cinco de Copas es el dolor de la pérdida: duelo, arrepentimiento y la mirada fija en lo que se derramó. Esta energía honra la tristeza real, pero te recuerda en voz baja que no todas las copas han caído. Llora lo que se fue, pero cuando estés lista, date la vuelta: algo sigue en pie, esperando a que lo recojas.",
    shadow: "Invertido, la mirada empieza a girar. Comienzas a aceptar la pérdida, a perdonar y a recoger lo que queda; o sigues vuelta hacia lo derramado, sin poder dejar que el duelo se mueva y salga.",
  },
  "6-of-cups": {
    energy: "El Seis de Copas es la dulzura del recuerdo: nostalgia, inocencia y los regalos amables del pasado. Esta energía trae reencuentros, calor de infancia y bondad ofrecida sin esperar nada a cambio. Te invita a reconectar con las alegrías sencillas y a dar con generosidad, como lo hacías antes de que el mundo te enseñara a sacar cuentas.",
    shadow: "Invertido, la nostalgia se vuelve jaula. Quizá estés viviendo en el pasado, idealizando lo que fue, o sin poder crecer más allá de una vieja historia. Puede significar aferrarte a un recuerdo en lugar de encontrarte con el presente tal como es.",
  },
  "7-of-cups": {
    energy: "El Siete de Copas es la bruma de las muchas posibilidades: sueños, opciones y la niebla seductora de la imaginación. Esta energía despliega elecciones ante ti, algunas doradas, otras ilusión. Te pide soñar, pero luego mirar de cerca: ¿qué copa guarda alimento verdadero, y cuál es solo un deseo con un disfraz hermoso?",
    shadow: "Invertido, la niebla se aclara. Cortas a través de la fantasía, eliges con claridad y te comprometes con lo real; o sigues perdida entre ensueños e indecisión, paralizada por demasiadas elecciones que brillan.",
  },
  "8-of-cups": {
    energy: "El Ocho de Copas es la partida valiente: alejarte de lo que ya no te llena en busca de algo más hondo. Esta energía no es fracaso, sino discernimiento: dejar atrás lo cómodo y lo medio verdadero para seguir un llamado más callado y honesto. Algunos viajes empiezan solo cuando le das la espalda a lo conocido.",
    shadow: "Invertido, la partida se complica. Quizá vagues sin dirección, temas soltar, o vuelvas una y otra vez a lo que sabes que debes dejar. Puede significar quedarte por obligación, o encontrar al fin el valor de marcharte.",
  },
  "9-of-cups": {
    energy: "El Nueve de Copas es el contento: el deseo cumplido, la satisfacción honda de un corazón en paz. Esta energía es gratitud y abundancia emocional, el placer de saborear aquello por lo que trabajaste. Tómate un momento para disfrutarlo de lleno: tienes permiso de sentirte bien con tu vida.",
    shadow: "Invertido, la satisfacción suena hueca. El placer se vuelve superficial o presumido, o un deseo concedido no alcanza a llenar el hambre más profunda. Puede significar exceso, o medir el contento con la vara equivocada.",
  },
  "10-of-cups": {
    energy: "El Diez de Copas es la plenitud emocional compartida: armonía duradera, familia y la cálida realización del amor dentro de un hogar. Esta energía es el arcoíris tras la lluvia: pertenencia, paz y la alegría de los vínculos que sostienen. Habla de una felicidad que no es pasajera, sino tejida en la trama de una vida construida en común.",
    shadow: "Invertido, el cuadro se agrieta. La armonía cede ante la discordia, los valores desalineados, o una felicidad que se ve entera por fuera pero por dentro se siente vacía. Puede significar un hogar que necesita reparación, o perseguir un ideal que nunca fue del todo tuyo.",
  },
  "page-of-cups": {
    energy: "La Sota de Copas es el corazón todavía joven: curioso, abierto y dispuesto a conmoverse. Esta energía trae chispas creativas, empujones de la intuición y mensajes inesperados del sentimiento. Te invita a seguir tierna e imaginativa, a confiar en la vocecita de tu intuición y a recibir la emoción con asombro en lugar de miedo.",
    shadow: "Invertida, la apertura vacila. Los sentimientos se vuelven inmaduros o cambiantes, la creatividad se atasca, o te refugias en el escapismo y el ensueño. Puede significar un corazón sensible que fue herido, o la imaginación usada para esconderse de lo real.",
  },
  "knight-of-cups": {
    energy: "El Caballero de Copas es el romántico en marcha: seguir al corazón, traer ofertas de amor, belleza e inspiración. Esta energía es encanto, idealismo y el valor de actuar desde el sentimiento. Te invita a guiarte por el corazón, a perseguir lo que amas con gracia y a dejar que la imaginación marque tus pasos.",
    shadow: "Invertido, el idealismo flaquea. El encanto resbala hacia el malhumor o las promesas vacías, los sueños se quedan sin suelo, o el sentimiento manda sin un hilo de razón. Puede significar un corazón que promete de más, o un romance más imaginado que real.",
  },
  "queen-of-cups": {
    energy: "La Reina de Copas es la compasión hecha sabiduría: sentir hondo y sostenerlo con gracia, confiar en la intuición sin miedo. Esta energía es profundidad emocional, empatía y la fuerza serena de quien lo siente todo y aun así permanece firme. Te invita a cuidar de los demás desde una copa llena, y a honrar tus propias mareas interiores.",
    shadow: "Invertida, la copa se derrama. La empatía se vuelve desbordamiento o martirio, los límites se disuelven, y cuidar de los demás te vacía. Puede significar emociones que inundan la razón, o compasión ofrecida hasta que no queda nada para ti.",
  },
  "king-of-cups": {
    energy: "El Rey de Copas es el dominio del corazón: sentir hondo y, aun así, gobernar esas profundidades con calma. Esta energía es equilibrio emocional, diplomacia y la firmeza que sostiene a los demás en medio de sus tormentas. Te invita a guiar con compasión y serenidad, sin ahogarte en el sentimiento ni desconectarte de él.",
    shadow: "Invertido, las aguas calmas se revuelven. La emoción se reprime hasta filtrarse como malhumor o frialdad, o el sentimiento se usa para manipular. Puede significar un corazón sostenido con demasiada fuerza, o una serenidad que se ha vuelto máscara.",
  },

  // ── OROS · tierra · cuerpo, trabajo, recursos, lo material ──────────
  "ace-of-coins": {
    energy: "El As de Oros es la semilla de la abundancia: una nueva oportunidad enraizada en el mundo material —trabajo, dinero, salud u hogar—. Esta energía es potencial hecho tangible, un comienzo concreto que ofrece seguridad y crecimiento. Plántala con cuidado y atiéndela con paciencia; de esta pequeña semilla puede crecer una prosperidad real y duradera.",
    shadow: "Invertido, a la semilla le cuesta arraigar. Una oportunidad se pierde, se demora, o se construye sobre suelo inestable; la seguridad se siente escasa. Puede significar un proyecto mal planeado, o aferrarte a la ganancia rápida en lugar del crecimiento firme.",
  },
  "2-of-coins": {
    energy: "El Dos de Oros es el arte de hacer malabares: equilibrar prioridades, adaptarte y mantener varias cosas en movimiento a la vez. Esta energía es flexibilidad e ingenio, la gracia de seguir en pie mientras el suelo se mueve. Mantente liviana, administra tu tiempo y tus medios con cuidado, y surfea los altibajos sin soltar lo que importa.",
    shadow: "Invertido, las pelotas caen. Demasiadas exigencias se vuelven agobio, desorganización o dinero mal manejado. Puede significar prioridades perdidas, compromisos soltados, o intentar cargar más de lo que dos manos pueden sostener.",
  },
  "3-of-coins": {
    energy: "El Tres de Oros es el oficio de trabajar en conjunto: habilidad, colaboración y la construcción paciente de algo que vale la pena. Esta energía honra la competencia y el trabajo en equipo: cada quien aportando su parte, aprendiendo sobre la marcha y levantando una estructura que nadie podría levantar a solas. Enorgullécete del trabajo y recibe la ayuda de los demás.",
    shadow: "Invertido, la colaboración falla. El trabajo en equipo se quiebra, la calidad baja, o el esfuerzo no se reconoce. Puede significar trabajar en aislamiento, visiones que chocan, o una destreza que se ha vuelto descuidada.",
  },
  "4-of-coins": {
    energy: "El Cuatro de Oros es el agarre de la seguridad: sostener con fuerza lo que tienes, valorar la estabilidad y el control. Esta energía puede ser ahorro sabio y límites firmes, el consuelo de un suelo sólido bajo los pies. También plantea una pregunta: ¿estás protegiendo lo que importa, o apretando tan fuerte que nada puede entrar ni salir?",
    shadow: "Invertido, el agarre se aprieta en avaricia o por fin se afloja. Quizá estés acumulando por miedo, definida por lo que posees; o quizá estés aprendiendo a abrir las manos, a gastar, compartir y dejar que los recursos vuelvan a moverse.",
  },
  "5-of-coins": {
    energy: "El Cinco de Oros es la carencia en el frío: pérdida, falta y la sensación solitaria de quedar afuera. Esta energía nombra una lucha real: apuros de dinero, mala salud o aislamiento. Pero aun en la tormenta, una luz brilla cerca a través de la ventana. La ayuda está más cerca de lo que parece; no tienes que atravesar esto en soledad.",
    shadow: "Invertido, la temporada dura empieza a cambiar. Comienza la recuperación, se encuentra la ayuda y vuelves al calor; o sigues atrapada en una historia de carencia mucho después de que pasó lo peor, sin ver la puerta que se ha abierto.",
  },
  "6-of-coins": {
    energy: "El Seis de Oros es el flujo de dar y recibir: generosidad, justicia y el equilibrio de los recursos entre las manos. Esta energía es caridad ofrecida y recibida con gratitud, el intercambio natural que mantiene entera a una comunidad. Da lo que puedas, acepta lo que se te ofrece, y confía en que la abundancia se mueve en círculos, no en líneas rectas.",
    shadow: "Invertido, la balanza se inclina. El dar viene con condiciones, las deudas quedan sin pagar, o la generosidad esconde una jugada de poder. Puede significar un intercambio desigual, dependencia, o una caridad que hiere el orgullo que pretendía aliviar.",
  },
  "7-of-coins": {
    energy: "El Siete de Oros es la pausa para evaluar: paciencia, perspectiva y la mirada larga sobre un trabajo que crece despacio. Esta energía es la jardinera apoyada en la azada, contemplando lo que ha arraigado. Te pide tener paciencia con tu inversión, juzgar con honestidad qué está prosperando, y confiar en que las cosas buenas maduran a su propio tiempo.",
    shadow: "Invertido, la paciencia se agota. La impaciencia empuja por resultados demasiado pronto, el esfuerzo se siente desperdiciado, o un mal rendimiento despierta preguntas difíciles. Puede significar trabajo volcado en el campo equivocado, o rendirte justo antes de la cosecha.",
  },
  "8-of-coins": {
    energy: "El Ocho de Oros es la devoción al oficio: diligencia, enfoque y la maestría callada que se construye una repetición cuidadosa a la vez. Esta energía es la aprendiz en su mesa, afinando la destreza con trabajo honesto. Te invita a comprometerte con los detalles, a enorgullecerte de hacer las cosas bien y a dejar que la dedicación convierta el talento en maestría.",
    shadow: "Invertido, el trabajo pierde su alma. El perfeccionismo frena el avance, el esfuerzo se vuelve sin inspiración, o se recortan esquinas por ir rápido. Puede significar labor sin sentido, o una destreza descuidada justo cuando más necesita cultivo.",
  },
  "9-of-coins": {
    energy: "El Nueve de Oros es el bienestar ganado: autosuficiencia, refinamiento y el placer sereno de sostenerte por ti misma. Esta energía es la recompensa de la disciplina: una vida hecha hermosa y segura por tu propio esfuerzo. Disfruta los frutos de tu trabajo, saborea tu independencia y descansa en la dignidad de lo que has construido a solas.",
    shadow: "Invertido, el jardín necesita cuidado. El bienestar llega a costa del exceso de trabajo, o la independencia esconde soledad o dependencia económica. Puede significar un lujo que se siente vacío, o un éxito que ha costado más de lo que dio.",
  },
  "10-of-coins": {
    energy: "El Diez de Oros es la riqueza duradera: legado, familia y la seguridad honda de cimientos construidos para perdurar más allá de ti. Esta energía es abundancia que permanece: tradición, herencia y la estabilidad de un hogar y un linaje que sostienen. Habla de éxito a largo plazo, prosperidad compartida y la riqueza que se mide en pertenencia, no solo en oro.",
    shadow: "Invertido, los cimientos se mueven. La inestabilidad económica, el conflicto familiar o un legado en disputa amenazan lo construido. Puede significar una riqueza que resulta pasajera, o perseguir la seguridad a costa de los vínculos que la hacen valiosa.",
  },
  "page-of-coins": {
    energy: "La Sota de Oros es la estudiante de lo tangible: entusiasta, aplicada y lista para convertir una idea en algo real. Esta energía trae nuevos emprendimientos, ambición fresca y la curiosidad paciente de aprender un oficio desde la base. Te invita a fijar una meta práctica, estudiar lo que necesitas y dar el primer paso con los pies en la tierra.",
    shadow: "Invertida, el impulso se atasca. Los planes se quedan en el papel, llega la procrastinación, o una oportunidad pasa sin aprovecharse. Puede significar ambición sin seguimiento, o un aprendizaje que nunca llega a volverse acción.",
  },
  "knight-of-coins": {
    energy: "El Caballero de Oros es la constancia firme: confiable, metódico y comprometido con el trabajo largo y sin brillo que de verdad termina las cosas. Esta energía honra la rutina, cumple con el deber y avanza un paso seguro a la vez. Te invita a ser paciente y digna de confianza, a terminar lo que empiezas y a valorar la constancia por encima del alarde.",
    shadow: "Invertido, la firmeza se entiesa. La rutina se endurece en estancamiento, aburrimiento o terquedad; o la fiabilidad resbala hacia la pereza y la evasión. Puede significar ser tan cautelosa que nada se mueve, o tan cumplidora que la alegría se va escurriendo.",
  },
  "queen-of-coins": {
    energy: "La Reina de Oros es la abundancia que nutre: práctica, con los pies en la tierra y generosa con el bienestar que crea. Esta energía atiende tanto el jardín como a las personas que lo habitan, tejiendo seguridad, calor y bienestar en la vida diaria. Te invita a cuidar del cuerpo y del hogar, a ser ingeniosa y dadivosa, y a encontrar lo sagrado en lo práctico.",
    shadow: "Invertida, el equilibrio se inclina. El cuidado de los demás desplaza el cuidado de ti, o la nutrición se vuelve asfixia; el bienestar resbala hacia el materialismo. Puede significar descuidarte, o medir tu valor por lo que provees.",
  },
  "king-of-coins": {
    energy: "El Rey de Oros es la prosperidad dominada: seguridad, liderazgo y abundancia compartida desde una fuerza sólida. Esta energía es el proveedor firme que ha construido bien y gobierna con sabiduría el terreno material. Te invita a liderar con fiabilidad y generosidad, a disfrutar el éxito sin perder tus raíces, y a hacer de la riqueza un cimiento para los demás.",
    shadow: "Invertido, la abundancia se agria. La seguridad se vuelve avaricia, control o un apego terco al estatus y a las posesiones. Puede significar riqueza usada para dominar, o una fijación en el dinero que desplaza todo lo que estaba destinada a proteger.",
  },

  // ── BASTOS · fuego · pasión, voluntad, energía, creatividad ─────────
  "ace-of-wands": {
    energy: "El As de Bastos es la chispa de la creación: una oleada súbita de inspiración, pasión y energía creativa en bruto. Esta energía es la primera llama de un nuevo proyecto, el impulso de hacer, de empezar, de volcar tu voluntad en algo vivo. Tómala mientras arde brillante: la chispa es real, y quiere volverse fuego.",
    shadow: "Invertido, la chispa chisporrotea. La inspiración se apaga, los planes se atascan, o la energía se dispersa antes de prender. Puede significar un arranque que se demora, un bloqueo creativo, o una pasión que intuyes pero sobre la que aún no logras actuar.",
  },
  "2-of-wands": {
    energy: "El Dos de Bastos es la visión desde el umbral: planear, ambicionar y el primer reconocimiento de un mundo más amplio. Esta energía sostiene el globo en una mano y el futuro en la otra, sopesando hacia dónde ir. Te invita a soñar más allá de lo conocido, a trazar un plan audaz y a dar un paso hacia el horizonte que no dejas de imaginar.",
    shadow: "Invertido, el paso no se da. El miedo a lo desconocido cría indecisión, o juegas a lo seguro y te quedas donde estás. Puede significar un plan abandonado, una ambición encogida hasta la comodidad, o una visión de la que hablas pero nunca persigues.",
  },
  "3-of-wands": {
    energy: "El Tres de Bastos es la expansión en marcha: previsión, avance y la confianza de quien ya tiene sus barcos navegando. Esta energía mira desde lo alto los planes puestos en movimiento, confiando en que volverán recompensados. Te invita a pensar en grande, a actuar sobre tu visión y a recibir las oportunidades más amplias que ahora asoman.",
    shadow: "Invertido, el horizonte se estrecha. Demoras, obstáculos o una planificación corta de vista frenan el avance. Puede significar expectativas que no se cumplen, una expansión intentada demasiado pronto, o una visión demasiado pequeña para el momento que enfrenta.",
  },
  "4-of-wands": {
    energy: "El Cuatro de Bastos es la alegría de la llegada: celebración, regreso a casa y la armonía de un logro alcanzado. Esta energía alza un dosel sobre las buenas noticias: estabilidad, comunidad y un momento que vale la pena marcar. Te invita a detenerte y celebrar, a honrar los cimientos que has construido y a compartir la alegría con quienes te pertenecen.",
    shadow: "Invertido, la celebración se atenúa. La armonía se siente inquieta, una transición altera la calma, o el cimiento es menos sólido de lo que aparenta. Puede significar un regreso a casa que se demora, tensión bajo la fiesta, o un logro que pasa sin alegría.",
  },
  "5-of-wands": {
    energy: "El Cinco de Bastos es el choque de energías: competencia, conflicto y la fricción de muchas voluntades empujando a la vez. Esta energía no es guerra sino refriega: rivalidad, debate, el caos vivo de que todos quieren ser escuchados. Te invita a entrar al duelo con ánimo, a poner a prueba tu fuerza y a descubrir lo que se forja en una lucha sana.",
    shadow: "Invertido, la fricción cambia. El conflicto se evita o por fin se resuelve, la tensión cede y vuelve la cooperación; o la lucha se vuelve hacia dentro, agitándose como un conflicto interior que no puedes soltar.",
  },
  "6-of-wands": {
    energy: "El Seis de Bastos es el triunfo del jinete: victoria, reconocimiento y el orgullo merecido del éxito público. Esta energía es el laurel y la multitud que aclama, el momento en que tu esfuerzo se ve y se premia. Te invita a recibir el aplauso con gracia, a erguirte en tu logro y a dejar que la confianza te lleve hacia la próxima cima.",
    shadow: "Invertido, el desfile flaquea. El reconocimiento se niega, el éxito se demora, o el orgullo se hincha en arrogancia. Puede significar una caída en desgracia, miedo al fracaso, o buscar el aplauso más que el trabajo que lo gana.",
  },
  "7-of-wands": {
    energy: "El Siete de Bastos es la defensa del terreno alto: coraje, convicción y la voluntad de sostener tu posición contra viento y marea. Esta energía se planta firme cuando la desafían, lista para defender lo que crees y lo que has ganado. Te invita a mantenerte en tu sitio, a luchar por tus valores y a confiar en que tu posición más alta vale la pena de proteger.",
    shadow: "Invertido, la guardia se cansa. Llega el agobio, te sientes en desventaja numérica, o cedes el terreno que pensabas sostener. Puede significar el agotamiento de defenderse sin tregua, la duda bajo presión, o rendir una postura que debiste conservar.",
  },
  "8-of-wands": {
    energy: "El Ocho de Bastos es el movimiento veloz: rapidez, impulso y la prisa de las cosas que al fin avanzan rápido. Esta energía son flechas en vuelo: noticias que llegan, planes que se aceleran, hechos que caen velozmente en su lugar. Te invita a actuar mientras corre la corriente, a enviar el mensaje, hacer el viaje y montar el ritmo súbito y vibrante del avance.",
    shadow: "Invertido, el impulso se traba. Demoras, frustración y energía dispersa lo frenan todo. Puede significar malentendidos, planes detenidos en el trayecto, o ir tan rápido que las cosas se te escapan de las manos.",
  },
  "9-of-wands": {
    energy: "El Nueve de Bastos es la resistencia del último esfuerzo: persistencia, temple y la fuerza de seguir cuando ya casi no te quedan reservas. Esta energía es la guardiana herida que se levanta una vez más, en guardia pero no quebrada. Honra lo lejos que has llegado y te pide aguantar un poco más: la meta está más cerca de lo que tu cansancio te deja creer.",
    shadow: "Invertido, las defensas se vuelven contra ti. El agotamiento se ahonda, la cautela se agria en paranoia, o levantas muros que dejan fuera la ayuda junto con el daño. Puede significar pelear batallas ya ganadas, o negarte a bajar la guardia mucho después de que el peligro pasó.",
  },
  "10-of-wands": {
    energy: "El Diez de Bastos es el peso de la carga: responsabilidad, agobio y la determinación de llevarla hasta casa. Esta energía es la figura encorvada bajo un brazado pesado de compromisos, avanzando por pura voluntad. Honra tu dedicación, y te pregunta con suavidad: ¿cuáles de estas cargas son de verdad tuyas, y cuáles puedes por fin soltar?",
    shadow: "Invertido, la carga se atiende. Sueltas lo que nunca fue tuyo, delegas y aligeras el peso; o te derrumbas bajo él, agotada y sin poder admitir que tomaste demasiado.",
  },
  "page-of-wands": {
    energy: "La Sota de Bastos es el espíritu libre en el umbral: entusiasmo, curiosidad y la comezón de explorar algo nuevo. Esta energía trae ideas frescas, una emoción inquieta y el valor de seguir una chispa a donde lleve. Te invita a seguir abierta y aventurera, a perseguir lo que te enciende y a empezar antes de sentirte del todo lista.",
    shadow: "Invertida, la chispa se dispersa. El entusiasmo se desinfla, los planes se quedan en pura palabra, o la impulsividad no lleva a ninguna parte. Puede significar una dirección perdida, una pasión que nunca despega, o una emoción que se apaga apenas empieza el trabajo.",
  },
  "knight-of-wands": {
    energy: "El Caballero de Bastos es la pasión a todo galope: audaz, aventurero y cargado con la energía de actuar sobre lo que te emociona. Esta energía carga hacia sus deseos con carisma y atrevimiento, sin miedo al salto. Te invita a perseguir tus pasiones con audacia, a llevar fuego y movimiento a tus planes, y a vivir con un coraje encendido.",
    shadow: "Invertido, el fuego se desboca. La audacia se vuelve imprudencia, la pasión impaciencia, y la energía se dispersa en demasiadas direcciones. Puede significar actuar sin pensar, abandonar proyectos a medias, o un genio tan rápido como el entusiasmo.",
  },
  "queen-of-wands": {
    energy: "La Reina de Bastos es la confianza radiante: calidez, carisma y la vitalidad magnética que atrae a los demás. Esta energía es segura de sí y generosa, a gusto en su propio fuego, parte coraje y parte alegría. Te invita a hacer tuyo tu valor, a liderar con calidez y audacia, y a dejar que tu luz natural brille sin pedir disculpas.",
    shadow: "Invertida, la llama se vuelve hacia dentro. La confianza se agrieta en inseguridad, celos o la necesidad de dominar; la calidez se agria en exigencia. Puede significar inseguridad disfrazada de control, o energía gastada en buscar aprobación en vez de en expresarse.",
  },
  "king-of-wands": {
    energy: "El Rey de Bastos es el liderazgo visionario: audaz, inspirado y capaz de convertir una gran visión en acción que mueve a los demás. Esta energía manda con carisma y convicción, alumbrando el camino y reuniendo gente en torno a una causa. Te invita a liderar con visión y coraje, a tomar acción decidida y a inspirar por la fuerza de tu propia convicción.",
    shadow: "Invertido, el fuego quema. La visión se vuelve arrogancia, el liderazgo impulsividad o tiranía, y la convicción un rechazo a escuchar a nadie más. Puede significar grandes promesas sin cumplimiento, o un poder que abrasa a quienes debía guiar.",
  },

  // ── ESPADAS · aire · mente, verdad, conflicto, comunicación ─────────
  "ace-of-swords": {
    energy: "El As de Espadas es la hoja de la claridad: la verdad que corta limpio a través de la confusión, un avance de mente y comprensión. Esta energía es el primer pensamiento afilado que nombra las cosas tal como son: juicio claro, comunicación honesta, el poder de ver y de decidir. Alza la espada y deja que la verdad rebane lo que nubla el camino.",
    shadow: "Invertido, la hoja se mella. La confusión nubla la mente, la verdad se enreda o se usa mal, y la claridad se escurre fuera de alcance. Puede significar desinformación, una decisión tomada sobre bases falsas, o palabras afiladas que hieren en vez de aclarar.",
  },
  "2-of-swords": {
    energy: "El Dos de Espadas es la pausa con los ojos vendados: una decisión difícil sostenida en un equilibrio cuidadoso, las emociones apartadas para guardar la paz. Esta energía es la quietud previa a una elección, dos verdades sopesadas con los ojos cerrados. Te invita a encontrar tu centro, a reunir lo que aún no puedes ver, y a saber que la venda tendrá que caer en algún momento.",
    shadow: "Invertido, el punto muerto se rompe. Aflora información oculta, la venda se levanta y una elección se aclara; o la indecisión se prolonga, y los sentimientos bloqueados se desbordan al fin en agobio.",
  },
  "3-of-swords": {
    energy: "El Tres de Espadas es el corazón atravesado: desamor, pena y la claridad afilada de una verdad dolorosa. Esta energía nombra el duelo real: traición, pérdida, el ardor que llega cuando algo verdadero también lastima. No suaviza el dolor, pero lo honra, y te recuerda que hasta un corazón herido, una vez sentido del todo, puede empezar a sanar.",
    shadow: "Invertido, las espadas comienzan a retirarse. La sanación arranca, el dolor se libera y el corazón despacio se recompone; o te aferras a la herida, repitiendo el daño mucho después de que podría empezar a cerrar.",
  },
  "4-of-swords": {
    energy: "El Cuatro de Espadas es el descanso necesario: retiro, recuperación y la quietud que deja sanar a la mente. Esta energía es la figura en reposo que deja a un lado la batalla por un tiempo, recobrando fuerzas en el silencio. Te invita a hacer una pausa, a recuperarte antes de volver a actuar, y a honrar la verdad de que el descanso no es retirada, sino preparación.",
    shadow: "Invertido, el descanso se rechaza o se prolonga de más. La inquietud y el agotamiento te empujan a actuar antes de haber sanado; o te repliegas tanto que el retiro se vuelve evasión. Puede significar un cuerpo y una mente que claman por la pausa que sigues negándoles.",
  },
  "5-of-swords": {
    energy: "El Cinco de Espadas es el costo del conflicto: tensión, derrota y el sabor hueco de ganar a costa de alguien más. Esta energía muestra la batalla ganada y los puentes quemados, el ego que triunfa mientras el corazón pierde. Te pide elegir bien tus batallas, notar lo que de verdad cuesta la victoria, y sopesar si tener la razón vale el precio.",
    shadow: "Invertido, el conflicto busca un final. Te acercas a la reconciliación, sueltas el viejo resentimiento y reparas; o sigues atrapada en una pelea que nadie puede ganar, sin poder dejar las espadas en el suelo.",
  },
  "6-of-swords": {
    energy: "El Seis de Espadas es el paso hacia aguas más calmas: transición, seguir adelante y el viaje lento que aleja del problema. Esta energía es la travesía callada hacia algo mejor, el duelo a cuestas pero el rumbo claro. Te invita a dejar atrás lo que no tiene arreglo, a confiar en el movimiento, y a dejar que orillas más serenas se acerquen con cada remada.",
    shadow: "Invertido, la travesía se atasca. Te resistes a avanzar, sigues atada a las aguas revueltas, o cargas un equipaje sin resolver que hunde el bote. Puede significar una transición bloqueada, o volver al mismo problema que intentabas dejar.",
  },
  "7-of-swords": {
    energy: "El Siete de Espadas es la estratega solitaria: astucia, independencia y el trabajo cuidadoso hecho fuera de la vista. Esta energía es la mente que juega un ángulo ingenioso, que actúa a solas y guarda sus planes cerca. En su mejor versión es estrategia y autosuficiencia; también plantea una pregunta honesta sobre si tus medios son tan limpios como tus fines.",
    shadow: "Invertido, el secreto sale a la luz. Confiesas, la conciencia te alcanza, o se descubre un engaño; o la maquinación se ahonda, alejándose más de la honestidad cuanto más tiempo pasa sin verse.",
  },
  "8-of-swords": {
    energy: "El Ocho de Espadas es la jaula que una misma fabrica: sentirse atrapada, restringida y atada por miedos que aprietan más en la mente que en el mundo. Esta energía es la figura con los ojos vendados rodeada de hojas, sin notar que el camino está abierto. Te invita a cuestionar los límites en los que crees, porque muchas de estas ataduras se aflojan en cuanto eliges mirar.",
    shadow: "Invertido, la venda resbala. Te liberas, encuentras una nueva perspectiva y dejas atrás el miedo que te sujetaba; o la trampa se aprieta mientras te hundes más en la impotencia, confundiendo una prisión de pensamiento con una de piedra.",
  },
  "9-of-swords": {
    energy: "El Nueve de Espadas es el peso de la noche en vela: ansiedad, angustia y los miedos que se agigantan en la oscuridad. Esta energía es la figura sentada en la cama, la cabeza entre las manos, asediada por la preocupación. No niega el sufrimiento, pero susurra una verdad: muchos de estos terrores pesan más en la mente que a la luz de la mañana. No estás tan sola como la noche te hace sentir.",
    shadow: "Invertido, el amanecer se acerca. Los miedos se enfrentan y se nombran, vuelve la esperanza, y lo peor de la angustia empieza a ceder; o el tormento sigue enterrado, negándose a la luz del día que podría al fin aliviarlo.",
  },
  "10-of-swords": {
    energy: "El Diez de Espadas es tocar fondo: un final doloroso, una traición, o el momento en que algo termina del todo, sin remedio. Esta energía no oculta cuánto duele, y sin embargo hay un extraño alivio en ello: cuando has tocado fondo, ya no hay más hacia dónde caer, y el único camino que queda es hacia arriba. El amanecer ya despunta detrás de la figura caída.",
    shadow: "Invertido, empiezas a levantarte. La recuperación toma fuerza, lo peor queda atrás y trepas de vuelta hacia la luz; o te resistes al final, alargando un dolor que ya terminó y negándote a dejarlo cerrar.",
  },
  "page-of-swords": {
    energy: "La Sota de Espadas es la mente joven y afilada: curiosa, vigilante y hambrienta de verdad e ideas nuevas. Esta energía es ágil de ingenio y atenta, ansiosa por aprender, preguntar y hablar. Te invita a mantenerte alerta y honesta, a perseguir el conocimiento con entusiasmo y a usar las palabras como una hoja clara, no descuidada.",
    shadow: "Invertida, el ingenio se vuelve inquieto. La curiosidad se dispersa en chismes o en pura charla sin acción, y la vigilancia se endurece en sospecha. Puede significar palabras afiladas que hieren, pensamiento disperso, o una astucia que nunca se asienta en sabiduría.",
  },
  "knight-of-swords": {
    energy: "El Caballero de Espadas es la carga del puro intelecto: ambicioso, directo y veloz para actuar sobre una idea clara. Esta energía se lanza de cabeza hacia su meta, movida por la convicción y el coraje de sus pensamientos. Te invita a actuar con decisión, a decir tu verdad sin titubear y a llevar un empuje enfocado y sin miedo a lo que persigues.",
    shadow: "Invertido, la carga se vuelve temeraria. La velocidad se vuelve precipitación, la franqueza agresión, y la mente corre por delante de las consecuencias. Puede significar actuar sin pensar, palabras que cortan demasiado hondo, o empujar tan fuerte que atropellas lo que importaba.",
  },
  "queen-of-swords": {
    energy: "La Reina de Espadas es la honestidad de mirada clara: perceptiva, independiente y sin miedo a ver y decir la verdad. Esta energía corta a través de la ilusión con una sabiduría ganada a pulso, valorando la justicia, la franqueza y una mente que piensa por sí misma. Te invita a poner límites limpios, a hablar con claridad y a guiar con una lucidez templada por la comprensión que cuesta aprender.",
    shadow: "Invertida, la claridad se enfría. La honestidad se vuelve fría o cortante, el juicio se endurece, y el dolor viejo se cuaja en amargura. Puede significar muros levantados desde una herida pasada, crítica sin calor, o una lengua afilada que aleja al amor.",
  },
  "king-of-swords": {
    energy: "El Rey de Espadas es la autoridad de la mente: intelecto, verdad y juicio justo sostenidos con mando firme. Esta energía gobierna a través de la claridad y el principio, pesando los hechos sin sesgo y decidiendo con integridad. Te invita a liderar con razón y honestidad, a sostener lo que es justo y a dejar que el pensamiento claro guíe tu poder.",
    shadow: "Invertido, la mente se endurece. La lógica se vuelve fría y rígida, la autoridad resbala hacia la manipulación o el control, y la verdad se convierte en arma. Puede significar ideas impuestas sin compasión, un juicio que ha perdido su justicia, o el intelecto usado para dominar en vez de servir.",
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
console.log(`OK · energy_es+shadow_es aplicados a ${patched} Arcanos Menores`);
