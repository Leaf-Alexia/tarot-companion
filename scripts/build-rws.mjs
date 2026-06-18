// Genera data/decks/rws.json a partir de la capa pura, garantizando que los 78
// arcana_id y las rutas de imagen sean exactos, y adjuntando el matiz (deck_nuance)
// en inglés: texto original, fundamentado en la imaginería Waite-Smith de dominio
// público (A.E. Waite & Pamela Colman Smith, 1909 / Pictorial Key, 1911). Describe
// CÓMO el RWS expresa cada carta, no la energía pura (que vive en arcana-pure.json).
//
// deck_nuance_es queda vacío: se traducirá tras aprobar el contenido EN.
// available=true: el sheet ya muestra la capa del mazo aunque las imágenes aún no
// estén (sheet.js no renderiza la imagen todavía y degrada con gracia).
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

const missing = arcana.filter((c) => !NUANCE[c.id]).map((c) => c.id);
if (missing.length) {
  throw new Error(`Faltan matices para: ${missing.join(", ")}`);
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
    deck_nuance_es: "",
  })),
};

writeFileSync(outUrl, JSON.stringify(deck, null, 2) + "\n", "utf8");
console.log(`OK · rws.json generado con ${deck.cards.length} cartas (matiz EN aplicado, available=true)`);
