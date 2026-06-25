// Genera data/decks/rws.json a partir de la capa pura, garantizando que los 78
// arcana_id y las rutas de imagen sean exactos, y adjuntando el matiz (deck_nuance)
// en inglés: texto original, fundamentado en la imaginería Waite-Smith de dominio
// público (A.E. Waite & Pamela Colman Smith, 1909 / Pictorial Key, 1911). Describe
// CÓMO el RWS expresa cada carta, no la energía pura (que vive en arcana-pure.json).
//
// deck_nuance_es: traducción fiel del matiz EN (ES natural, descriptivo). Ambos idiomas
// se poblan en cada build → el modo ES ya no cae a inglés en la capa de mazo.
// available=true: el sheet muestra la imagen (assets/decks/rws/<arcana_id>.jpg) o, si
// falta el archivo, degrada con gracia al placeholder.
//
// Convención de imagen: assets/decks/rws/<arcana_id>.jpg
//
// Uso: node scripts/build-rws.mjs
import { readFileSync, writeFileSync } from "node:fs";

const pureUrl = new URL("../data/arcana-pure.json", import.meta.url);
const outUrl = new URL("../data/decks/rws.json", import.meta.url);
const arcana = JSON.parse(readFileSync(pureUrl, "utf8"));

const NUANCE = {
  // ── MAJORS ──────────────────────────────────────────────────────────
  "the-fool": "A young figure in a patterned tunic steps toward a cliff edge, a white rose in one hand and a bundle on a staff over the shoulder, a small dog at his heels. In the RWS the leap is bright and almost weightless — eyes lifted to the sky, the danger underfoot left for the viewer to notice.",
  "the-magician": "One hand raised to heaven and one pointing to earth, the infinity sign above his head and the four suit-tokens on his table. The RWS makes him a channel between worlds, roses and lilies blooming around him — will drawing power down and grounding it into matter.",
  "the-high-priestess": "She sits between two pillars marked B and J, a crescent moon at her feet and a veil of pomegranates behind her, a half-hidden scroll in her lap. The RWS frames her as the guardian of a threshold, holding knowledge shown only in part.",
  "the-empress": "A crowned figure of twelve stars reclines among ripe wheat beside a forest stream, the sign of Venus at her side. The RWS renders the Empress as lush, seated abundance — comfort, fertility, and nature in full bloom.",
  "the-emperor": "He sits on a stone throne carved with rams' heads, armored beneath his robe, an ankh-topped scepter in hand against a barren mountain. The RWS gives the Emperor a hard, fixed solidity — authority that has stopped moving.",
  "the-hierophant": "Between two pillars he raises a hand in blessing over two tonsured figures, a triple cross in hand and crossed keys at his feet. The RWS shows him as the keeper of sanctioned doctrine — wisdom handed down through an institution.",
  "the-lovers": "A man and woman stand beneath an angel in golden light, the tree of flames and the tree of knowledge behind them. The RWS lifts the Lovers from mere romance to a blessed union and a sacred choice, watched over from above.",
  "the-chariot": "An armored prince stands in a canopied chariot drawn by two sphinxes, one black and one white, facing opposite ways. The RWS shows mastery as holding contrary forces in check by will alone, without reins.",
  "strength": "A serene woman crowned with flowers gently closes the jaws of a lion, the infinity sign above her. The RWS makes Strength explicitly tender — power as calm persuasion rather than force.",
  "the-hermit": "A cloaked elder stands on a snowy peak raising a lantern that holds a six-pointed star, steadied by his staff. The RWS shows him lighting the way for others while standing apart — wisdom carried into solitude.",
  "the-wheel": "A great wheel inscribed with letters and alchemical signs turns in the sky, a sphinx atop it and the four fixed creatures reading in the corners. The RWS sets fortune against the heavens — fate as a cosmic mechanism larger than any one life.",
  "justice": "A crowned figure sits between pillars holding an upright sword in one hand and balanced scales in the other. The RWS gives Justice the same frontal authority as the Hierophant — impartial law, sword and scale held in plain sight.",
  "the-hanged-one": "A man hangs serenely by one foot from a living T-cross, hands behind his back, legs crossed into a 4, a halo of light around his head. The RWS makes the suspension peaceful and illuminated — willing surrender, not punishment.",
  "death": "A skeletal rider in black armor on a white horse advances under a white-rose banner; king, child, and bishop meet him as the sun rises between two towers. The RWS shows Death as an unstoppable procession that levels all ranks, with dawn already promised beyond.",
  "temperance": "A winged angel pours liquid between two cups, one foot on land and one in water, an iris-lined path leading to a crowned mountain. The RWS renders Temperance as patient, flowing alchemy — the careful tempering of opposites.",
  "the-devil": "A horned figure perches above a man and woman loosely chained to his block, an inverted torch in hand. The RWS shows the chains hanging loose enough to slip — bondage that, on closer look, is chosen.",
  "the-tower": "Lightning strikes the crown from a tall tower on a crag, flames burst from the windows, and two figures fall headlong. The RWS makes the collapse sudden and total — a false summit struck down by a bolt from above.",
  "the-star": "A naked woman kneels by a pool pouring water onto land and into the water from two jugs, beneath one great star and seven smaller ones. The RWS renders the Star as serene renewal — hope poured out freely under an open sky.",
  "the-moon": "A path runs between two towers past a dog and a wolf baying at the moon, a crayfish crawling from the pool. The RWS fills the Moon with uncertainty — the road into the unknown, watched by instinct and fear.",
  "the-sun": "A child wreathed in sunflowers rides a white horse before a sunlit garden wall, the great sun beaming overhead. The RWS makes the Sun pure, childlike joy — vitality with nothing hidden.",
  "judgement": "An angel sounds a trumpet from the clouds and the dead rise from their tombs, arms lifted in welcome. The RWS shows Judgement as a collective awakening — a summons answered with open arms.",
  "the-world": "A dancing figure wreathed in a laurel oval holds two wands, framed by the four living creatures in the corners. The RWS renders the World as complete, harmonious motion — the journey closed and integrated.",

  // ── CUPS ────────────────────────────────────────────────────────────
  "ace-of-cups": "A hand from a cloud offers an overflowing chalice, a dove descending with a wafer, five streams spilling into a lily pond. The RWS shows emotion as grace poured from above — the cup running over.",
  "2-of-cups": "A man and woman pledge their cups beneath a winged lion's head and the caduceus. The RWS makes the Two a vow between equals — attraction blessed and in balance.",
  "3-of-cups": "Three women raise their cups in a circle amid a harvest. The RWS shows shared celebration — abundance toasted among friends.",
  "4-of-cups": "A youth sits under a tree with crossed arms, ignoring a cup offered from a cloud while three stand before him. The RWS pictures discontent — the gift unseen because the gaze has turned inward.",
  "5-of-cups": "A cloaked figure mourns over three spilled cups, two still standing behind, a bridge and house across the river. The RWS centers the loss while quietly keeping the way home in view.",
  "6-of-cups": "A child offers a cup of flowers to another in a sunlit courtyard. The RWS gives the Six warmth and innocence — kindness remembered from the past.",
  "7-of-cups": "A figure faces seven cups in the clouds, each holding a vision — a face, a castle, jewels, a shrouded shape. The RWS makes the Seven a fog of tempting choices, some treasure and some illusion.",
  "8-of-cups": "A figure walks away under a waning moon, leaving eight stacked cups to climb toward the mountains. The RWS shows the brave departure — turning from the assembled cups toward something farther.",
  "9-of-cups": "A satisfied man sits with folded arms before a curved counter of nine cups. The RWS makes the Nine the 'wish' card — contentment worn openly, comfort earned.",
  "10-of-cups": "A couple raise their arms toward a rainbow of ten cups while two children dance. The RWS renders the Ten as fulfilled domestic joy — lasting harmony under a blessing in the sky.",
  "page-of-cups": "A young figure in a flowered tunic regards a fish rising from the cup in his hand. The RWS gives the Page a whimsical openness — intuition and imagination meeting with surprise.",
  "knight-of-cups": "A calm knight rides slowly forward offering a cup, wings at his helm and heels. The RWS makes him the romantic emissary — feeling carried gently into the world.",
  "queen-of-cups": "She sits at the water's edge gazing into an ornate, lidded cup — the only closed cup in the suit. The RWS shows the Queen wholly absorbed in feeling, her depths held within.",
  "king-of-cups": "He sits on a throne afloat on a turbulent sea, holding a cup, steady though the waters churn. The RWS makes the King mastery over emotion — calm kept above the depths.",

  // ── COINS (Pentacles) ───────────────────────────────────────────────
  "ace-of-coins": "A hand from a cloud holds out a single golden pentacle above a flowering garden, an arched gateway opening to mountains. The RWS shows opportunity as a tangible gift — a doorway onto prosperity.",
  "2-of-coins": "A youth dances juggling two pentacles bound by a figure-eight ribbon, ships rising and falling on the waves behind. The RWS makes the Two playful balance amid changing tides.",
  "3-of-coins": "A sculptor works in a cathedral arch while two others consult the plans. The RWS shows recognized craft — skill, collaboration, and a job taken seriously.",
  "4-of-coins": "A seated figure clutches one pentacle to his chest, one on his crown, and two beneath his feet. The RWS makes the Four about holding tight — security guarded so closely nothing moves.",
  "5-of-coins": "Two ragged figures pass beneath a lit stained-glass window in the snow. The RWS pictures hardship and exclusion, with warmth and aid just out of view.",
  "6-of-coins": "A merchant weighs coins on a scale and gives alms to two kneeling beggars. The RWS shows measured generosity — giving and receiving, with the balance held.",
  "7-of-coins": "A laborer leans on his hoe, regarding seven pentacles ripening on a bush. The RWS captures the pause to assess — patience with slow-growing returns.",
  "8-of-coins": "A craftsman chisels pentacles one by one, his finished work displayed beside him. The RWS makes the Eight devoted, repetitive labor — mastery built piece by piece.",
  "9-of-coins": "An elegant woman stands in a walled vineyard, a hooded falcon on her gloved hand. The RWS renders the Nine as refined self-sufficiency — comfort enjoyed alone, on one's own terms.",
  "10-of-coins": "An elder with two dogs watches a family beneath an archway hung with ten pentacles. The RWS shows legacy and lineage — wealth that spans generations.",
  "page-of-coins": "A youth studies a single pentacle held aloft in a green, flowering field. The RWS gives the Page focused study — an ambition examined and ready to grow.",
  "knight-of-coins": "An armored knight sits still on a heavy black horse, holding a pentacle before a plowed field. The RWS makes him the most static of the suit — steady, reliable, unhurried duty.",
  "queen-of-coins": "She sits in a flowering bower cradling a pentacle, a rabbit at her feet. The RWS shows the Queen as nurturing, grounded abundance — care for the body and the land.",
  "king-of-coins": "He sits enthroned among grapevines, one foot on a boar's head, a pentacle resting in his hand. The RWS renders the King as settled prosperity — wealth fully possessed and secure.",

  // ── WANDS ───────────────────────────────────────────────────────────
  "ace-of-wands": "A hand from a cloud grasps a sprouting wand, leaves falling, a castle on a distant hill. The RWS shows raw creative force budding to life — a living branch, not a dead stick.",
  "2-of-wands": "A figure holds a globe and gazes from a castle wall over land and sea, one wand fixed beside him. The RWS makes the Two the planner's view — the world in hand, the next move weighed.",
  "3-of-wands": "A figure stands on a height with three wands, watching ships sail across the bay. The RWS shows expansion underway — vision sent out and awaiting return.",
  "4-of-wands": "Four wands form a garlanded canopy before a manor, two figures raising flowers in welcome. The RWS renders the Four as celebration and homecoming — a threshold of joy.",
  "5-of-wands": "Five youths brandish wands in a scattered, almost playful scuffle. The RWS makes the Five lively friction — competition and clamor more than real combat.",
  "6-of-wands": "A rider crowned with laurel carries a wreathed wand through a crowd on foot. The RWS shows public victory — recognition and acclaim.",
  "7-of-wands": "A figure on higher ground defends his position against six wands thrust up from below. The RWS captures standing your ground — holding the advantage under challenge.",
  "8-of-wands": "Eight wands fly together in parallel through open sky over a green landscape. The RWS makes the Eight pure motion — swift movement and news in flight.",
  "9-of-wands": "A bandaged figure grips a wand warily, eight others standing like a fence behind him. The RWS shows the wounded but watchful guard — resilience braced for one more push.",
  "10-of-wands": "A man bends under the weight of all ten wands gathered in his arms, a town ahead. The RWS renders the Ten as burden — responsibility carried, almost too much, toward home.",
  "page-of-wands": "A youth in a salamander-patterned tunic gazes up at the wand he holds, desert and pyramids behind. The RWS gives the Page eager curiosity — a spark ready to explore.",
  "knight-of-wands": "A knight on a rearing horse charges forward, wand raised, salamanders on his garment. The RWS makes the Knight bold, restless adventure — passion in full motion.",
  "queen-of-wands": "She sits facing forward with a sunflower and a wand, a black cat at her feet. The RWS shows the Queen as warm, magnetic confidence — vitality others are drawn to.",
  "king-of-wands": "He sits on a throne adorned with lions and salamanders, holding a flowering wand, a lizard at his feet. The RWS renders the King as visionary command — fire directed with authority.",

  // ── SWORDS ──────────────────────────────────────────────────────────
  "ace-of-swords": "A hand from a cloud lifts an upright sword crowned with a wreath, mountains below. The RWS shows mental clarity as a decisive blade — truth raised in triumph.",
  "2-of-swords": "A blindfolded woman sits by the sea holding two crossed swords in balance, a crescent moon above. The RWS makes the Two a tense stalemate — a choice held off behind closed eyes.",
  "3-of-swords": "Three swords pierce a single red heart against a stormy, raining sky. The RWS gives heartbreak its starkest image — sorrow shown plainly, without disguise.",
  "4-of-swords": "A knight lies in repose atop a tomb, hands in prayer, three swords above and one beneath. The RWS shows the Four as necessary rest — recovery in stillness, not death.",
  "5-of-swords": "A smirking figure gathers swords as two others walk away defeated under a ragged sky. The RWS makes the Five a hollow victory — winning at the cost of the bond.",
  "6-of-swords": "A ferryman poles a boat carrying a cloaked figure and child, six swords standing in the hull, toward a calmer shore. The RWS renders the Six as transition — moving on from rough water toward peace.",
  "7-of-swords": "A figure slips away from a camp carrying five swords, leaving two behind, glancing back. The RWS shows stealth and strategy — acting alone, perhaps not quite cleanly.",
  "8-of-swords": "A bound, blindfolded woman stands among eight swords planted around her, the way open at her feet. The RWS makes the Eight a self-made trap — bonds looser than they feel.",
  "9-of-swords": "A figure sits up in bed in the dark, face in hands, nine swords mounted on the wall. The RWS gives anxiety its image — the anguish of the sleepless night.",
  "10-of-swords": "A figure lies face down with ten swords in his back, dawn breaking on the horizon. The RWS shows rock bottom — the painful end, with first light already returning.",
  "page-of-swords": "A youth stands on windswept ground holding a sword upright, alert and watchful. The RWS gives the Page restless vigilance — a quick mind ready for truth and trouble.",
  "knight-of-swords": "A knight charges headlong into the wind, sword raised, his horse at full gallop. The RWS makes the Knight pure forward drive — ideas and ambition rushing ahead.",
  "queen-of-swords": "She sits upright holding a sword, one hand extended, her throne carved with a winged cherub, clouds behind. The RWS shows the Queen as clear, candid perception — wisdom shaped by experience.",
  "king-of-swords": "He sits frontally on a throne marked with butterflies, holding an upright sword slightly tilted. The RWS renders the King as authority of the intellect — truth and judgment in command.",
};

// Versión en español del matiz (deck_nuance_es): traducción fiel del EN, describe
// CÓMO el RWS expresa visualmente cada carta. Texto descriptivo (sin segunda persona),
// español natural. Idempotente: poblado en cada build.
const NUANCE_ES = {
  // ── MAYORES ─────────────────────────────────────────────────────────
  "the-fool": "Una figura joven con túnica estampada avanza hacia el borde de un acantilado, una rosa blanca en una mano y un hatillo al hombro sobre un bastón, un perrito a sus talones. En el RWS el salto es luminoso y casi ingrávido: los ojos alzados al cielo, el peligro a sus pies dejado para que lo note quien mira.",
  "the-magician": "Una mano alzada al cielo y otra señalando la tierra, el signo del infinito sobre su cabeza y los cuatro emblemas de los palos sobre su mesa. El RWS lo hace un canal entre mundos, con rosas y lirios floreciendo a su alrededor: la voluntad que atrae el poder hacia abajo y lo asienta en la materia.",
  "the-high-priestess": "Se sienta entre dos pilares marcados con B y J, una luna creciente a sus pies y un velo de granadas detrás, un pergamino entrevisto en su regazo. El RWS la enmarca como la guardiana de un umbral, que sostiene un saber mostrado solo en parte.",
  "the-empress": "Una figura coronada de doce estrellas reposa entre trigo maduro junto a un arroyo del bosque, el signo de Venus a su lado. El RWS retrata a la Emperatriz como abundancia exuberante y sentada: comodidad, fertilidad y naturaleza en plena floración.",
  "the-emperor": "Se sienta en un trono de piedra tallado con cabezas de carnero, armado bajo el manto, un cetro rematado en anj en la mano frente a una montaña árida. El RWS le da al Emperador una solidez dura y fija: autoridad que ha dejado de moverse.",
  "the-hierophant": "Entre dos pilares alza la mano en bendición sobre dos figuras tonsuradas, una cruz triple en la mano y llaves cruzadas a sus pies. El RWS lo muestra como el guardián de la doctrina sancionada: la sabiduría transmitida a través de una institución.",
  "the-lovers": "Un hombre y una mujer están bajo un ángel en luz dorada, el árbol de las llamas y el árbol del conocimiento detrás de ellos. El RWS eleva a los Enamorados del mero romance a una unión bendecida y una elección sagrada, vigilada desde lo alto.",
  "the-chariot": "Un príncipe armado se yergue en un carro con dosel tirado por dos esfinges, una negra y otra blanca, mirando en sentidos opuestos. El RWS muestra el dominio como sostener fuerzas contrarias a raya por pura voluntad, sin riendas.",
  "strength": "Una mujer serena coronada de flores cierra con suavidad las fauces de un león, el signo del infinito sobre ella. El RWS hace a la Fuerza explícitamente tierna: el poder como persuasión calma en lugar de violencia.",
  "the-hermit": "Un anciano encapuchado se yergue sobre una cima nevada alzando una linterna que guarda una estrella de seis puntas, sostenido por su bastón. El RWS lo muestra alumbrando el camino a los demás mientras permanece aparte: sabiduría llevada a la soledad.",
  "the-wheel": "Una gran rueda inscrita con letras y signos alquímicos gira en el cielo, una esfinge en lo alto y las cuatro criaturas fijas leyendo en las esquinas. El RWS sitúa la fortuna contra los cielos: el destino como un mecanismo cósmico mayor que cualquier vida.",
  "justice": "Una figura coronada se sienta entre pilares sosteniendo una espada erguida en una mano y una balanza equilibrada en la otra. El RWS le da a la Justicia la misma autoridad frontal que al Hierofante: ley imparcial, espada y balanza a la vista de todos.",
  "the-hanged-one": "Un hombre cuelga sereno por un pie de una cruz en forma de T viva, las manos tras la espalda, las piernas cruzadas en un 4, un halo de luz en torno a su cabeza. El RWS hace de la suspensión algo apacible e iluminado: entrega voluntaria, no castigo.",
  "death": "Un jinete esquelético con armadura negra sobre un caballo blanco avanza bajo un estandarte de rosa blanca; un rey, un niño y un obispo lo reciben mientras el sol se alza entre dos torres. El RWS muestra a la Muerte como una procesión imparable que nivela todos los rangos, con el alba ya prometida más allá.",
  "temperance": "Un ángel alado vierte líquido entre dos copas, un pie en tierra y otro en el agua, un sendero bordeado de lirios que lleva a una montaña coronada. El RWS retrata a la Templanza como una alquimia paciente y fluida: el cuidadoso atemperar de los opuestos.",
  "the-devil": "Una figura cornuda se encarama sobre un hombre y una mujer encadenados sin apretar a su pedestal, una antorcha invertida en la mano. El RWS muestra las cadenas colgando lo bastante flojas como para zafarse: una atadura que, mirada de cerca, es elegida.",
  "the-tower": "Un rayo arranca la corona de una torre alta sobre un peñasco, las llamas brotan de las ventanas y dos figuras caen de cabeza. El RWS hace el derrumbe súbito y total: una cima falsa abatida por un relámpago desde lo alto.",
  "the-star": "Una mujer desnuda se arrodilla junto a un estanque vertiendo agua sobre la tierra y sobre el agua desde dos cántaros, bajo una gran estrella y siete más pequeñas. El RWS retrata a la Estrella como renovación serena: esperanza derramada con generosidad bajo un cielo abierto.",
  "the-moon": "Un sendero corre entre dos torres pasando junto a un perro y un lobo que aúllan a la luna, un cangrejo de río que sale del estanque. El RWS llena a la Luna de incertidumbre: el camino hacia lo desconocido, vigilado por el instinto y el miedo.",
  "the-sun": "Un niño coronado de girasoles cabalga un caballo blanco frente a un muro de jardín bañado de sol, el gran sol resplandeciendo en lo alto. El RWS hace del Sol una alegría pura e infantil: vitalidad sin nada escondido.",
  "judgement": "Un ángel hace sonar una trompeta entre las nubes y los muertos se alzan de sus tumbas, los brazos en alto en señal de bienvenida. El RWS muestra el Juicio como un despertar colectivo: una llamada respondida con los brazos abiertos.",
  "the-world": "Una figura danzante envuelta en una guirnalda ovalada de laurel sostiene dos varas, enmarcada por las cuatro criaturas vivientes en las esquinas. El RWS retrata al Mundo como movimiento completo y armonioso: el viaje cerrado e integrado.",

  // ── COPAS ───────────────────────────────────────────────────────────
  "ace-of-cups": "Una mano que sale de una nube ofrece un cáliz desbordante, una paloma desciende con una hostia, cinco chorros se vierten en un estanque de lirios. El RWS muestra la emoción como gracia derramada desde lo alto: la copa que rebosa.",
  "2-of-cups": "Un hombre y una mujer intercambian sus copas bajo una cabeza de león alada y el caduceo. El RWS hace del Dos un voto entre iguales: atracción bendecida y en equilibrio.",
  "3-of-cups": "Tres mujeres alzan sus copas en círculo en medio de una cosecha. El RWS muestra la celebración compartida: la abundancia brindada entre amigas.",
  "4-of-cups": "Un joven se sienta bajo un árbol con los brazos cruzados, ignorando una copa que le ofrece una nube mientras otras tres están ante él. El RWS retrata el descontento: el regalo que no se ve porque la mirada se ha vuelto hacia dentro.",
  "5-of-cups": "Una figura encapuchada llora sobre tres copas derramadas, dos aún en pie tras ella, un puente y una casa al otro lado del río. El RWS centra la pérdida mientras mantiene en silencio el camino a casa a la vista.",
  "6-of-cups": "Un niño ofrece una copa de flores a otro en un patio soleado. El RWS le da al Seis calidez e inocencia: la bondad recordada del pasado.",
  "7-of-cups": "Una figura se enfrenta a siete copas en las nubes, cada una con una visión: un rostro, un castillo, joyas, una forma cubierta. El RWS hace del Siete una niebla de elecciones tentadoras, parte tesoro y parte ilusión.",
  "8-of-cups": "Una figura se aleja bajo una luna menguante, dejando ocho copas apiladas para trepar hacia las montañas. El RWS muestra la partida valiente: dar la espalda a las copas reunidas hacia algo más lejano.",
  "9-of-cups": "Un hombre satisfecho se sienta con los brazos cruzados ante un mostrador curvo de nueve copas. El RWS hace del Nueve la carta del 'deseo': el contento llevado a la vista, la comodidad ganada.",
  "10-of-cups": "Una pareja alza los brazos hacia un arcoíris de diez copas mientras dos niños bailan. El RWS retrata el Diez como alegría doméstica realizada: armonía duradera bajo una bendición en el cielo.",
  "page-of-cups": "Una figura joven con túnica florida contempla un pez que asoma de la copa en su mano. El RWS le da a la Sota una apertura risueña: la intuición y la imaginación que se encuentran con una sorpresa.",
  "knight-of-cups": "Un caballero tranquilo avanza despacio ofreciendo una copa, alas en su yelmo y en sus talones. El RWS lo hace el emisario romántico: el sentimiento llevado con suavidad al mundo.",
  "queen-of-cups": "Se sienta a la orilla del agua mirando una copa ornamentada y con tapa, la única copa cerrada del palo. El RWS muestra a la Reina por entero absorta en el sentimiento, sus profundidades guardadas dentro.",
  "king-of-cups": "Se sienta en un trono que flota sobre un mar turbulento, sosteniendo una copa, firme aunque las aguas se agiten. El RWS hace del Rey el dominio de la emoción: la calma mantenida por encima de las profundidades.",

  // ── OROS (Pentáculos) ───────────────────────────────────────────────
  "ace-of-coins": "Una mano que sale de una nube sostiene un solo pentáculo dorado sobre un jardín en flor, un arco se abre hacia las montañas. El RWS muestra la oportunidad como un regalo tangible: un umbral hacia la prosperidad.",
  "2-of-coins": "Un joven baila haciendo malabares con dos pentáculos unidos por una cinta en forma de ocho, barcos que suben y bajan sobre las olas detrás. El RWS hace del Dos un equilibrio juguetón en medio de las mareas cambiantes.",
  "3-of-coins": "Un escultor trabaja en el arco de una catedral mientras otros dos consultan los planos. El RWS muestra el oficio reconocido: destreza, colaboración y un trabajo tomado en serio.",
  "4-of-coins": "Una figura sentada aprieta un pentáculo contra el pecho, uno sobre la corona y dos bajo los pies. El RWS hace del Cuatro el sostener con fuerza: la seguridad guardada tan de cerca que nada se mueve.",
  "5-of-coins": "Dos figuras andrajosas pasan bajo una vidriera iluminada en la nieve. El RWS retrata la penuria y la exclusión, con el calor y la ayuda justo fuera de la vista.",
  "6-of-coins": "Un mercader pesa monedas en una balanza y da limosna a dos mendigos arrodillados. El RWS muestra la generosidad medida: dar y recibir, con el equilibrio sostenido.",
  "7-of-coins": "Un labrador se apoya en su azada, contemplando siete pentáculos que maduran en un arbusto. El RWS capta la pausa para evaluar: paciencia con los frutos que crecen despacio.",
  "8-of-coins": "Un artesano cincela pentáculos uno a uno, su obra terminada expuesta a su lado. El RWS hace del Ocho la labor entregada y repetitiva: la maestría construida pieza por pieza.",
  "9-of-coins": "Una mujer elegante está en un viñedo amurallado, un halcón encapuchado sobre su mano enguantada. El RWS retrata el Nueve como autosuficiencia refinada: la comodidad disfrutada a solas, en sus propios términos.",
  "10-of-coins": "Un anciano con dos perros observa a una familia bajo un arco colgado de diez pentáculos. El RWS muestra el legado y el linaje: la riqueza que abarca generaciones.",
  "page-of-coins": "Un joven estudia un solo pentáculo que sostiene en alto en un campo verde y florido. El RWS le da a la Sota el estudio concentrado: una ambición examinada y lista para crecer.",
  "knight-of-coins": "Un caballero con armadura se mantiene quieto sobre un pesado caballo negro, sosteniendo un pentáculo ante un campo arado. El RWS lo hace el más estático del palo: deber firme, fiable y sin prisa.",
  "queen-of-coins": "Se sienta en un cenador florido acunando un pentáculo, un conejo a sus pies. El RWS muestra a la Reina como abundancia nutricia y arraigada: cuidado del cuerpo y de la tierra.",
  "king-of-coins": "Se sienta entronizado entre vides, un pie sobre la cabeza de un jabalí, un pentáculo descansando en su mano. El RWS retrata al Rey como prosperidad asentada: riqueza plenamente poseída y segura.",

  // ── BASTOS ──────────────────────────────────────────────────────────
  "ace-of-wands": "Una mano que sale de una nube empuña una vara que brota, hojas cayendo, un castillo sobre una colina lejana. El RWS muestra la fuerza creativa en bruto despertando a la vida: una rama viva, no un palo muerto.",
  "2-of-wands": "Una figura sostiene un globo y contempla desde la muralla de un castillo la tierra y el mar, una vara fija a su lado. El RWS hace del Dos la mirada de quien planea: el mundo en la mano, el próximo paso sopesado.",
  "3-of-wands": "Una figura está en lo alto con tres varas, observando los barcos que cruzan la bahía. El RWS muestra la expansión en marcha: la visión enviada al mundo a la espera de su retorno.",
  "4-of-wands": "Cuatro varas forman un dosel adornado de guirnaldas ante una casona, dos figuras alzando flores en bienvenida. El RWS retrata el Cuatro como celebración y regreso a casa: un umbral de alegría.",
  "5-of-wands": "Cinco jóvenes blanden varas en una refriega dispersa y casi juguetona. El RWS hace del Cinco una fricción animada: competencia y bullicio más que verdadero combate.",
  "6-of-wands": "Un jinete coronado de laurel lleva una vara enguirnaldada entre una multitud a pie. El RWS muestra la victoria pública: reconocimiento y aclamación.",
  "7-of-wands": "Una figura en terreno elevado defiende su posición contra seis varas que se alzan desde abajo. El RWS capta el sostener el terreno: mantener la ventaja bajo el desafío.",
  "8-of-wands": "Ocho varas vuelan juntas en paralelo por el cielo abierto sobre un paisaje verde. El RWS hace del Ocho puro movimiento: avance veloz y noticias en vuelo.",
  "9-of-wands": "Una figura vendada empuña una vara con recelo, otras ocho de pie como una cerca tras ella. El RWS muestra al guardián herido pero vigilante: resiliencia preparada para un último empujón.",
  "10-of-wands": "Un hombre se dobla bajo el peso de las diez varas reunidas en sus brazos, un pueblo más adelante. El RWS retrata el Diez como carga: responsabilidad llevada, casi en exceso, camino a casa.",
  "page-of-wands": "Un joven con túnica estampada de salamandras alza la vista a la vara que sostiene, desierto y pirámides detrás. El RWS le da a la Sota una curiosidad ansiosa: una chispa lista para explorar.",
  "knight-of-wands": "Un caballero sobre un caballo encabritado carga hacia adelante, la vara en alto, salamandras en su atuendo. El RWS hace del Caballero una aventura audaz e inquieta: la pasión en pleno movimiento.",
  "queen-of-wands": "Se sienta de frente con un girasol y una vara, un gato negro a sus pies. El RWS muestra a la Reina como confianza cálida y magnética: una vitalidad que atrae a los demás.",
  "king-of-wands": "Se sienta en un trono adornado con leones y salamandras, sosteniendo una vara florida, un lagarto a sus pies. El RWS retrata al Rey como mando visionario: el fuego dirigido con autoridad.",

  // ── ESPADAS ─────────────────────────────────────────────────────────
  "ace-of-swords": "Una mano que sale de una nube alza una espada erguida coronada por una guirnalda, montañas abajo. El RWS muestra la claridad mental como una hoja decisiva: la verdad alzada en triunfo.",
  "2-of-swords": "Una mujer con los ojos vendados se sienta junto al mar sosteniendo dos espadas cruzadas en equilibrio, una luna creciente arriba. El RWS hace del Dos un punto muerto tenso: una elección aplazada tras los ojos cerrados.",
  "3-of-swords": "Tres espadas atraviesan un solo corazón rojo contra un cielo tormentoso y lluvioso. El RWS le da al desamor su imagen más cruda: la pena mostrada con claridad, sin disfraz.",
  "4-of-swords": "Un caballero yace en reposo sobre una tumba, las manos en oración, tres espadas arriba y una debajo. El RWS muestra el Cuatro como descanso necesario: recuperación en la quietud, no muerte.",
  "5-of-swords": "Una figura con una sonrisa burlona recoge espadas mientras otras dos se alejan vencidas bajo un cielo desgarrado. El RWS hace del Cinco una victoria hueca: ganar a costa del vínculo.",
  "6-of-swords": "Un barquero impulsa con la pértiga una barca que lleva a una figura encapuchada y un niño, seis espadas clavadas en el casco, hacia una orilla más calma. El RWS retrata el Seis como transición: alejarse de las aguas revueltas hacia la paz.",
  "7-of-swords": "Una figura se escabulle de un campamento cargando cinco espadas, dejando dos atrás, mirando hacia atrás. El RWS muestra el sigilo y la estrategia: actuar a solas, quizá no del todo limpiamente.",
  "8-of-swords": "Una mujer atada y con los ojos vendados está entre ocho espadas clavadas a su alrededor, el camino abierto a sus pies. El RWS hace del Ocho una trampa fabricada por una misma: ataduras más flojas de lo que se sienten.",
  "9-of-swords": "Una figura se incorpora en la cama en la oscuridad, el rostro entre las manos, nueve espadas montadas en la pared. El RWS le da a la angustia su imagen: el tormento de la noche en vela.",
  "10-of-swords": "Una figura yace boca abajo con diez espadas en la espalda, el alba rompiendo en el horizonte. El RWS muestra tocar fondo: el final doloroso, con la primera luz ya de regreso.",
  "page-of-swords": "Un joven se yergue en un terreno azotado por el viento sosteniendo una espada en alto, alerta y vigilante. El RWS le da a la Sota una vigilancia inquieta: una mente rápida lista para la verdad y el conflicto.",
  "knight-of-swords": "Un caballero carga de frente contra el viento, la espada en alto, su caballo a pleno galope. El RWS hace del Caballero puro empuje hacia adelante: ideas y ambición lanzándose por delante.",
  "queen-of-swords": "Se sienta erguida sosteniendo una espada, una mano extendida, su trono tallado con un querubín alado, nubes detrás. El RWS muestra a la Reina como percepción clara y franca: sabiduría forjada por la experiencia.",
  "king-of-swords": "Se sienta de frente en un trono marcado con mariposas, sosteniendo una espada erguida ligeramente inclinada. El RWS retrata al Rey como autoridad del intelecto: verdad y juicio al mando.",
};

const missing = arcana.filter((c) => !NUANCE[c.id]).map((c) => c.id);
const missingEs = arcana.filter((c) => !NUANCE_ES[c.id]).map((c) => c.id);
if (missing.length) {
  throw new Error(`Faltan matices EN para: ${missing.join(", ")}`);
}
if (missingEs.length) {
  throw new Error(`Faltan matices ES para: ${missingEs.join(", ")}`);
}

const deck = {
  id: "rws",
  name: "Tarot Waite-Smith",
  subtitle: "Clásico 1909 · Dominio público",
  theme: "rws",
  available: true,
  credits: {
    deck: "Tarot Waite-Smith (RWS Clásico 1909)",
    note: "Imágenes originales en blanco y negro de Pamela Colman Smith (1909), dominio público en EE.UU. desde 1966. No usar el nombre 'Rider-Waite' (marca registrada de US Games).",
  },
  cards: arcana.map((c) => ({
    arcana_id: c.id,
    image: `assets/decks/rws/${c.id}.jpg`,
    deck_nuance: NUANCE[c.id],
    deck_nuance_es: NUANCE_ES[c.id],
  })),
};

writeFileSync(outUrl, JSON.stringify(deck, null, 2) + "\n", "utf8");
console.log(`OK · rws.json generado con ${deck.cards.length} cartas (matiz EN aplicado, available=true)`);
