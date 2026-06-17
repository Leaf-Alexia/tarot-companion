// Redacta energy (derecha) + shadow (invertida) en EN para los 22 Arcanos Mayores.
// Texto original, deck-agnóstico, fundamentado en la tradición Waite-Smith,
// pensado para leerse en voz alta durante una sesión.
// Uso: node scripts/author-majors-en.mjs
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../data/arcana-pure.json", import.meta.url);
const arcana = JSON.parse(readFileSync(path, "utf8"));

const EN = {
  "the-fool": {
    energy: "The Fool is the pure spark of beginning — the step taken before the path is known. There is innocence here, and trust: a willingness to leap into the unknown with open hands and a light heart. This energy invites you to follow your curiosity, to embrace freedom and possibility, and to start fresh without the weight of what came before.",
    shadow: "Reversed, the leap becomes a stumble. Spontaneity tips into recklessness, and openness into naivety — moving without looking, ignoring real risks, or refusing to grow. It can also mean holding back from a beginning you are afraid to take.",
  },
  "the-magician": {
    energy: "The Magician is focused will made manifest. You have everything you need — mind, heart, body, and craft — and the power to channel intention into the material world. This is the energy of creation and concentration: name what you want, gather your resources, and act with confidence, knowing you are the one who turns possibility into reality.",
    shadow: "Reversed, power loses its center. Talent scatters across too many things, or skill bends toward manipulation, illusion, and empty promises. It can signal untapped potential, self-doubt, or a gap between what you say and what you actually do.",
  },
  "the-high-priestess": {
    energy: "The High Priestess is the keeper of inner knowing. She speaks in the quiet — through intuition, dreams, and the wisdom you sense but cannot yet explain. This energy asks you to be still, to trust the voice beneath the noise, and to honor the mysteries that logic alone cannot solve. Some doors open only from within.",
    shadow: "Reversed, the inner voice is drowned out. You may be ignoring your intuition, lost in confusion, or cut off from your own depths. It can also mean secrets held too tightly, or wisdom withheld and turned into cold judgment.",
  },
  "the-empress": {
    energy: "The Empress is the abundance of life itself — creativity, nurture, and the lush fullness of the senses. She invites you to create and to care, to receive beauty and pleasure without guilt, and to let what you tend grow in its own time. This is fertile ground: ideas, relationships, and projects flourish when met with warmth and patience.",
    shadow: "Reversed, abundance turns possessive or depleted. Care becomes smothering, or you pour out so much for others that nothing is left for you. It can point to creative block, neglect of the self, or beauty lived as vanity rather than nourishment.",
  },
  "the-emperor": {
    energy: "The Emperor is steady authority and the order that protects what matters. This is the energy of structure, discipline, and clear boundaries — taking charge of a situation, building something durable, and leading with experience rather than impulse. Stand firm in your principles, and let earned respect, not fear, be the source of your power.",
    shadow: "Reversed, authority hardens into tyranny or rigidity. Control rules by fear instead of respect, or stubbornness blocks all change. It can also mean a loss of command — feeling powerless, undisciplined, or without solid ground beneath you.",
  },
  "the-hierophant": {
    energy: "The Hierophant is the wisdom passed down — tradition, teaching, and the shared beliefs that give a community its shape. This energy points to mentors and time-tested paths, to learning within a structure and finding your place among others. There is comfort and meaning in belonging, in ritual, and in a road that many have walked before you.",
    shadow: "Reversed, tradition becomes a cage. Rules are followed without question, dogma replaces understanding, or you bend to expectation at the cost of your own truth. It can also be the call to break from convention and find your own way.",
  },
  "the-lovers": {
    energy: "The Lovers is union and the choices that bind us. This is the energy of deep connection — attraction, harmony, and meeting another as a true equal — but also of decision: choosing in alignment with your values and your heart. When you choose from love rather than fear, even the heaviest commitment becomes worth its weight.",
    shadow: "Reversed, harmony fractures. Distance, indecision, or misaligned values strain the bond; you may be choosing from fear, avoiding commitment, or out of step with what you truly want. It can mark a relationship out of balance or a choice you keep postponing.",
  },
  "the-chariot": {
    energy: "The Chariot is willpower in motion — focus, drive, and the determination to steer opposing forces toward a single goal. This energy asks you to take the reins, face challenges head-on, and move forward with confidence and discipline. Victory comes not from force alone, but from holding your direction steady when the road pulls you sideways.",
    shadow: "Reversed, control slips. You may be moving without direction, forcing a situation instead of facing it, or pulled apart by competing urges. It can also mean stalled momentum — energy that scatters, or a goal abandoned just short of the finish.",
  },
  "strength": {
    energy: "Strength is the quiet power that tames without force. This is courage of the heart — patience, composure, and the gentle confidence that meets fear and passion with compassion rather than violence. True power lives in a steady spirit: when you hold your calm, even the wildest situation softens in your hands.",
    shadow: "Reversed, inner strength wavers. Calm gives way to anger, self-doubt, or reactions you cannot quite govern. It can mean feeling overpowered by a situation, or forcing control where patience was the answer.",
  },
  "the-hermit": {
    energy: "The Hermit is the wisdom found in solitude. This energy invites you to step back from the noise, turn inward, and let your own inner light guide the way. There is no rush here — only reflection, prudence, and the deep self-knowledge that comes from walking your own path alone for a while. Seek within, and you will find the answer you already carry.",
    shadow: "Reversed, withdrawal becomes isolation. Solitude curdles into loneliness or avoidance, or you refuse all guidance — your own and everyone else's. It can also mean re-emerging too soon, before the inner work is done.",
  },
  "the-wheel": {
    energy: "The Wheel of Fortune is the great turning of life — cycles, change, and the moments when fate shifts the ground beneath you. This energy reminds you that nothing stays fixed: what rises will fall, and what falls will rise again. When the wheel turns in your favor, ride it; when it turns away, trust the flow, for movement itself is the law of life.",
    shadow: "Reversed, you fight the turning. Resistance to change prolongs a hard cycle, or a run of bad luck feels like a sentence rather than a season. It can mean clinging to what is passing, or trying to force a wheel that turns on its own time.",
  },
  "justice": {
    energy: "Justice is truth weighed without bias. This is the energy of fairness, accountability, and clear cause and effect — every action returns to meet its consequence. It asks you to act with integrity, to see a situation as it truly is, and to take responsibility for your part. Do what is right for its own sake, and let the outcome follow.",
    shadow: "Reversed, the scales tip. Judgment turns biased, decisions grow cold or unfair, or you dodge accountability for your actions. It can also mean truth avoided, or logic applied without a trace of compassion.",
  },
  "the-hanged-one": {
    energy: "The Hanged One is the wisdom of the pause. By surrendering control and hanging in stillness, you gain a new angle on everything you thought you knew. This energy asks you to let go, to stop pushing, and to see the situation upside-down — for sometimes the only way forward is to release, wait, and let understanding arrive on its own.",
    shadow: "Reversed, the pause becomes paralysis. Surrender turns to stalling, or you resist the shift in perspective the moment requires. It can mean useless sacrifice, stagnation, or clinging to control when letting go is the only way through.",
  },
  "death": {
    energy: "Death is the great threshold — the ending that clears the way for what comes next. This energy is not loss for its own sake but transformation: something must close so that something truer can begin. Face the ending honestly, release what has run its course, and let yourself be made new. Every passage leaves room for life.",
    shadow: "Reversed, the ending is resisted. Fear of change prolongs the pain, or you cling to what is already over. It can mean a transition stalled halfway, or a part of you that refuses to let the old self die.",
  },
  "temperance": {
    energy: "Temperance is the art of balance. This energy blends opposites into harmony — patience over haste, moderation over excess, the steady mixing of forces until something whole and healing emerges. Find the middle way, temper your impulses, and let calm and care guide the slow work of bringing your life back into balance.",
    shadow: "Reversed, balance is lost. Excess, impatience, or extremes pull you off center, and the parts no longer blend. It can mean a healing rushed, opposing forces poorly mixed, or a life out of rhythm with itself.",
  },
  "the-devil": {
    energy: "The Devil reveals the chains we choose. This energy is about attachment and desire — the pleasures, habits, and dependencies that can either enrich life or quietly enslave it. It asks you to look honestly at what holds you: enjoy your passions, but know the difference between savoring and being consumed. The chains are often looser than they look.",
    shadow: "Reversed, the grip begins to break — or tightens unseen. You may be confronting an attachment, releasing what bound you, or refusing to admit how deep the hold goes. It can mark the painful, freeing moment of naming what owns you.",
  },
  "the-tower": {
    energy: "The Tower is the sudden lightning that brings false structures down. This energy is upheaval — a shock that shatters what was built on shaky ground, often without warning. It can feel like ruin, yet it is also liberation: only when the unstable falls can something truer be raised. Let the old structure go; the collapse is clearing space.",
    shadow: "Reversed, the upheaval is delayed or denied. You may be clinging to a structure already cracking, fearing a change that must come, or moving through disaster while refusing its lesson. The longer the fall is resisted, the harder it lands.",
  },
  "the-star": {
    energy: "The Star is hope after the storm. This gentle energy brings renewal, faith, and the quiet certainty that the pieces will fall into place. It shines brightest when the night is darkest — a reminder to heal, to trust, and to keep walking toward the luminous dream that guides you. Open yourself; you are exactly where you need to be.",
    shadow: "Reversed, the light dims. Hope fades into discouragement, doubt, or a sense of being lost and uninspired. It can mean faith withdrawn, a dream abandoned, or losing trust that things will come right.",
  },
  "the-moon": {
    energy: "The Moon is the realm of dream and intuition, where nothing is quite what it seems. This energy asks you to move by feeling rather than logic, to trust your instincts through the fog, and to face the fears and fantasies the subconscious stirs up. Not every door opens to reason — let your inner sense lead you through the uncertain dark.",
    shadow: "Reversed, the fog begins to lift — or thickens. Confusion and self-deception may be clearing and hidden truths surfacing; or anxiety, illusion, and fear may be clouding the way more than ever. Look carefully at what you have been afraid to see.",
  },
  "the-sun": {
    energy: "The Sun is pure radiance — joy, vitality, and the warm clarity that brings everything into the light. This energy is success and honesty, the simple happiness of being fully alive. Pour your enthusiasm into what you love and let yourself shine, freely and without arrogance. This is a time of growth, truth, and celebration.",
    shadow: "Reversed, the light is veiled. Joy feels forced, or shines outward while something inside stays empty; vanity or a passing gloom dims the glow. It can mean success delayed, or a brightness you are not letting yourself feel.",
  },
  "judgement": {
    energy: "Judgement is the call you cannot ignore — a moment of awakening, reckoning, and rebirth. This energy asks you to look honestly at your life, answer the deeper calling that has been sounding, and rise renewed. The past is weighed, the lessons are claimed, and you are offered the chance to begin again, clear and absolved. Listen — the bell is tolling for you.",
    shadow: "Reversed, the call goes unanswered. You may be avoiding self-reflection, harsh with yourself, or afraid of being judged. It can mean clinging to the past, doubting your worth, or ignoring an awakening that keeps knocking.",
  },
  "the-world": {
    energy: "The World is completion and wholeness — the journey come full circle, the goal achieved, all the pieces integrated at last. This energy is fulfillment and well-earned reward, the deep satisfaction of arriving. Honor how far you have come, celebrate the accomplishment, and let this ending become the threshold of the next great beginning.",
    shadow: "Reversed, completion feels just out of reach. A cycle stays unfinished, closure is delayed, or success arrives hollow and unsatisfying. It can mean clinging to a chapter that needs to end, or stalling on the last step before the finish.",
  },
};

let patched = 0;
for (const card of arcana) {
  const t = EN[card.id];
  if (!t) continue;
  card.energy = t.energy;
  card.shadow = t.shadow;
  patched++;
}

const expected = Object.keys(EN).length;
if (patched !== expected) {
  const missing = Object.keys(EN).filter((id) => !arcana.some((c) => c.id === id));
  throw new Error(`Apliqué ${patched}/${expected}. Ids sin coincidencia: ${missing.join(", ")}`);
}

writeFileSync(path, JSON.stringify(arcana, null, 2) + "\n", "utf8");
console.log(`OK · energy+shadow EN aplicados a ${patched} Arcanos Mayores`);
