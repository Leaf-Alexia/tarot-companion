// Redacta energy (derecha) + shadow (invertida) en EN para los 56 Arcanos Menores.
// Texto original, deck-agnóstico, fundamentado en la tradición Waite-Smith,
// pensado para leerse en voz alta durante una sesión.
// Uso: node scripts/author-minors-en.mjs
import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../data/arcana-pure.json", import.meta.url);
const arcana = JSON.parse(readFileSync(path, "utf8"));

const EN = {
  // ── CUPS · water · emotion, relationship, intuition ─────────────────
  "ace-of-cups": {
    energy: "The Ace of Cups is the heart opening — a pure spring of feeling, love, and compassion welling up from within. This is the first drop of a new emotional beginning: tenderness offered, intuition flowing, the chance to give and receive with an open heart. Let yourself feel, and let the cup overflow.",
    shadow: "Reversed, the spring is blocked. Feelings are held back, repressed, or pouring out faster than they can be held. It can mean emotional emptiness, a love withheld, or a heart closed against the very thing it longs for.",
  },
  "2-of-cups": {
    energy: "The Two of Cups is connection between equals — the meeting of two hearts in mutual respect and attraction. This energy is partnership, harmony, and the gentle alchemy that happens when two people truly see each other. Whether in love or friendship, it speaks of a bond freely given and freely returned.",
    shadow: "Reversed, the balance falters. A connection sours into tension, misunderstanding, or distance; what was mutual becomes one-sided. It can mean a parting, a bond in need of repair, or harmony you must first restore within yourself.",
  },
  "3-of-cups": {
    energy: "The Three of Cups is joy shared — celebration, friendship, and the warmth of belonging to a circle that cares. This energy raises a glass to good company and common cause: reunions, milestones, and the simple happiness of being among people who lift you up. Let yourself be carried by the gladness of others.",
    shadow: "Reversed, the circle frays. Celebration tips into excess, gossip, or a sense of being left outside the group. It can mean a friendship strained, festivity that rings hollow, or the need to step back from too much noise.",
  },
  "4-of-cups": {
    energy: "The Four of Cups is the pause of discontent — turning inward, weary of what is offered, waiting for something to stir again. This energy invites honest reflection: notice the apathy, but also notice the cup being held out that you have not yet seen. Sometimes the gift you long for is already within reach.",
    shadow: "Reversed, the fog begins to lift. Apathy gives way to renewed interest, and you accept the offer you once ignored. It can also deepen the withdrawal — boredom hardening into avoidance, or refusing connection out of habit.",
  },
  "5-of-cups": {
    energy: "The Five of Cups is the ache of loss — grief, regret, and the eyes fixed on what has spilled. This energy honors real sorrow, yet quietly reminds you that not every cup has fallen. Mourn what is gone, but when you are ready, turn around: something still stands, waiting to be picked up.",
    shadow: "Reversed, the gaze begins to shift. You start to accept the loss, forgive, and gather what remains; or you stay turned toward the spill, unable to let the grief move through and out.",
  },
  "6-of-cups": {
    energy: "The Six of Cups is the sweetness of memory — nostalgia, innocence, and the gentle gifts of the past. This energy brings reunions, childhood warmth, and kindness offered without expectation. It invites you to reconnect with simpler joys and to give freely, the way you once did before the world taught you to count the cost.",
    shadow: "Reversed, nostalgia turns into a cage. You may be living in the past, idealizing what was, or unable to grow beyond an old story. It can mean clinging to a memory rather than meeting the present as it is.",
  },
  "7-of-cups": {
    energy: "The Seven of Cups is the mist of many possibilities — dreams, options, and the seductive fog of imagination. This energy spreads choices before you, some golden, some illusion. It asks you to dream, but then to look closely: which cup holds real nourishment, and which is only a wish in a beautiful disguise?",
    shadow: "Reversed, the fog clears. You cut through fantasy, choose with clarity, and commit to what is real; or you stay lost in daydreams and indecision, paralyzed by too many shimmering choices.",
  },
  "8-of-cups": {
    energy: "The Eight of Cups is the brave departure — walking away from what no longer fulfills you in search of something deeper. This energy is not failure but discernment: leaving behind the comfortable and the half-true to follow a quieter, more honest calling. Some journeys begin only when you turn your back on the familiar.",
    shadow: "Reversed, the leaving is fraught. You may drift without direction, fear letting go, or keep returning to what you know you must leave. It can mean staying out of obligation, or finally finding the courage to go.",
  },
  "9-of-cups": {
    energy: "The Nine of Cups is contentment — the wish fulfilled, the deep satisfaction of a heart at ease. This energy is gratitude and emotional abundance, the pleasure of savoring what you have worked for. Take a moment to enjoy it fully: you are allowed to feel good about your life.",
    shadow: "Reversed, satisfaction rings hollow. Pleasure turns shallow or smug, or a wish granted fails to fill the deeper hunger. It can mean overindulgence, or measuring contentment by the wrong things.",
  },
  "10-of-cups": {
    energy: "The Ten of Cups is emotional fulfillment shared — lasting harmony, family, and the warm completion of love within a home. This energy is the rainbow after the rain: belonging, peace, and the joy of bonds that hold. It speaks of happiness that is not fleeting, but woven into the fabric of a life built together.",
    shadow: "Reversed, the picture cracks. Harmony gives way to discord, misaligned values, or a happiness that looks whole from the outside but feels empty within. It can mean a home in need of mending, or chasing an ideal that was never quite yours.",
  },
  "page-of-cups": {
    energy: "The Page of Cups is the heart still young — curious, open, and ready to be moved. This energy brings creative sparks, intuitive nudges, and unexpected messages of feeling. It invites you to stay tender and imaginative, to trust the small voice of your intuition, and to greet emotion with wonder rather than fear.",
    shadow: "Reversed, the openness wavers. Feelings turn immature or moody, creativity stalls, or you retreat into escapism and daydream. It can mean a sensitive heart bruised, or imagination used to hide from what is real.",
  },
  "knight-of-cups": {
    energy: "The Knight of Cups is the romantic on the move — following the heart, bringing offers of love, beauty, and inspiration. This energy is charm, idealism, and the courage to act on feeling. It invites you to lead with the heart, to pursue what you love with grace, and to let imagination guide your steps.",
    shadow: "Reversed, the idealism falters. Charm slides into moodiness or empty promises, dreams stay ungrounded, or feeling rules without a thread of reason. It can mean a heart that overpromises, or a romance more imagined than real.",
  },
  "queen-of-cups": {
    energy: "The Queen of Cups is compassion made wise — deep feeling held with grace, intuition trusted without fear. This energy is emotional depth, empathy, and the quiet strength of one who feels everything yet stays steady. She invites you to care for others from a full cup, and to honor your inner tides.",
    shadow: "Reversed, the cup spills over. Empathy turns into overwhelm or martyrdom, boundaries dissolve, and caring for others empties you. It can mean emotions that flood reason, or compassion offered until nothing is left for yourself.",
  },
  "king-of-cups": {
    energy: "The King of Cups is mastery of the heart — feeling deeply yet ruling those depths with calm. This energy is emotional balance, diplomacy, and the steadiness that holds others through their storms. He invites you to lead with compassion and composure, neither drowning in feeling nor cut off from it.",
    shadow: "Reversed, the calm waters turn. Emotion is suppressed until it leaks out as moodiness or coldness, or feeling is used to manipulate. It can mean a heart held too tightly, or composure that has become a mask.",
  },

  // ── COINS · earth · body, work, resources, the material ─────────────
  "ace-of-coins": {
    energy: "The Ace of Coins is the seed of abundance — a new opportunity rooted in the material world: work, money, health, or home. This energy is potential made tangible, a tangible beginning offering security and growth. Plant it with care and tend it patiently; from this small seed, real and lasting prosperity can grow.",
    shadow: "Reversed, the seed struggles to take root. An opportunity is missed, delayed, or built on shaky ground; security feels scarce. It can mean a venture poorly planned, or grasping at quick gain instead of steady growth.",
  },
  "2-of-coins": {
    energy: "The Two of Coins is the art of juggling — balancing priorities, adapting, and keeping many things in motion at once. This energy is flexibility and resourcefulness, the grace of staying upright while the ground shifts. Stay light on your feet, manage your time and means with care, and ride the ups and downs without dropping what matters.",
    shadow: "Reversed, the balls fall. Too many demands tip into overwhelm, disorganization, or money mismanaged. It can mean priorities lost, commitments dropped, or trying to carry more than two hands can hold.",
  },
  "3-of-coins": {
    energy: "The Three of Coins is the craft of working together — skill, collaboration, and the steady building of something worthwhile. This energy honors competence and teamwork: each person contributing their part, learning as they go, and raising a structure none could raise alone. Take pride in the work, and welcome the help of others.",
    shadow: "Reversed, the collaboration falters. Teamwork breaks down, quality slips, or effort goes unrecognized. It can mean working in isolation, clashing visions, or skill that has grown careless.",
  },
  "4-of-coins": {
    energy: "The Four of Coins is the grip of security — holding tight to what you have, valuing stability and control. This energy can mean wise saving and firm boundaries, the comfort of solid ground beneath you. It also asks a question: are you protecting what matters, or clutching so hard that nothing can flow in or out?",
    shadow: "Reversed, the grip either tightens into greed or finally loosens. You may be hoarding out of fear, defined by what you own; or you may be learning to open your hands, to spend, share, and let resources move again.",
  },
  "5-of-coins": {
    energy: "The Five of Coins is hardship in the cold — loss, lack, and the lonely feeling of being shut out. This energy names real struggle: money worries, ill health, or isolation. Yet even in the storm, light glows nearby through the window. Help is closer than it seems; you do not have to weather this alone.",
    shadow: "Reversed, the hard season turns. Recovery begins, help is found, and you step back into the warmth; or you stay locked in a story of lack long after the worst has passed, blind to the door that has opened.",
  },
  "6-of-coins": {
    energy: "The Six of Coins is the flow of giving and receiving — generosity, fairness, and the balance of resources between hands. This energy is charity offered and gratefully received, the natural exchange that keeps a community whole. Give what you can, accept what is offered, and trust that abundance moves in circles, not straight lines.",
    shadow: "Reversed, the scales tip. Giving comes with strings, debts go unpaid, or generosity hides a play for power. It can mean unequal exchange, dependence, or charity that wounds the pride it meant to ease.",
  },
  "7-of-coins": {
    energy: "The Seven of Coins is the pause to assess — patience, perspective, and the long view of work that grows slowly. This energy is the gardener leaning on the hoe, surveying what has taken root. It asks you to be patient with your investment, to judge honestly what is thriving, and to trust that good things ripen in their own time.",
    shadow: "Reversed, patience runs thin. Impatience pushes for results too soon, effort feels wasted, or a poor return prompts hard questions. It can mean labor poured into the wrong field, or giving up just before the harvest.",
  },
  "8-of-coins": {
    energy: "The Eight of Coins is devotion to the craft — diligence, focus, and the quiet mastery built one careful repetition at a time. This energy is the apprentice at the bench, refining skill through honest work. It invites you to commit to the details, to take pride in doing things well, and to let dedication turn talent into mastery.",
    shadow: "Reversed, the work loses its soul. Perfectionism stalls progress, effort grows uninspired, or corners get cut for speed. It can mean labor without meaning, or skill neglected when it most needs tending.",
  },
  "9-of-coins": {
    energy: "The Nine of Coins is earned comfort — self-sufficiency, refinement, and the quiet pleasure of standing on your own. This energy is the reward of discipline: a life made beautiful and secure through your own effort. Enjoy the fruits of your labor, savor your independence, and rest in the dignity of what you have built alone.",
    shadow: "Reversed, the garden needs tending. Comfort comes at the cost of overwork, or independence masks loneliness or financial dependence. It can mean luxury that feels empty, or success that has cost more than it gave.",
  },
  "10-of-coins": {
    energy: "The Ten of Coins is lasting wealth — legacy, family, and the deep security of foundations built to outlast you. This energy is abundance that endures: tradition, inheritance, and the stability of a home and lineage that hold. It speaks of long-term success, shared prosperity, and the riches that are measured in belonging, not just gold.",
    shadow: "Reversed, the foundation shifts. Financial instability, family conflict, or a legacy in dispute threatens what was built. It can mean wealth that proves fleeting, or chasing security at the cost of the bonds that make it worth having.",
  },
  "page-of-coins": {
    energy: "The Page of Coins is the student of the tangible — eager, studious, and ready to turn an idea into something real. This energy brings new ventures, fresh ambition, and the patient curiosity to learn a craft from the ground up. It invites you to set a practical goal, study what you need, and take the first grounded step.",
    shadow: "Reversed, momentum stalls. Plans stay on paper, procrastination sets in, or an opportunity slips by unused. It can mean ambition without follow-through, or learning that never quite becomes doing.",
  },
  "knight-of-coins": {
    energy: "The Knight of Coins is steady persistence — reliable, methodical, and committed to the long, unglamorous work that gets things done. This energy is routine honored, duty kept, and progress made one dependable step at a time. It invites you to be patient and trustworthy, to finish what you start, and to value consistency over flash.",
    shadow: "Reversed, the steadiness stiffens. Routine hardens into stagnation, boredom, or stubbornness; or reliability slips into laziness and avoidance. It can mean being so cautious that nothing moves, or so dutiful that joy drains away.",
  },
  "queen-of-coins": {
    energy: "The Queen of Coins is nurturing abundance — practical, grounded, and generous with the comforts she creates. This energy tends both the garden and the people in it, weaving security, warmth, and well-being into daily life. She invites you to care for body and home, to be resourceful and giving, and to find the sacred in the practical.",
    shadow: "Reversed, the balance tips. Care for others crowds out care for yourself, or nurture turns smothering; comfort slides into materialism. It can mean self-neglect, or measuring worth by what you provide.",
  },
  "king-of-coins": {
    energy: "The King of Coins is prosperity mastered — security, leadership, and abundance shared from a place of solid strength. This energy is the steady provider who has built well and rules wisely over the material realm. He invites you to lead with reliability and generosity, to enjoy success without losing your roots, and to make wealth a foundation for others.",
    shadow: "Reversed, abundance curdles. Security becomes greed, control, or stubborn attachment to status and possessions. It can mean wealth used to dominate, or a fixation on money that crowds out everything it was meant to protect.",
  },

  // ── WANDS · fire · passion, will, energy, creativity ────────────────
  "ace-of-wands": {
    energy: "The Ace of Wands is the spark of creation — a sudden surge of inspiration, passion, and raw creative energy. This energy is the first flame of a new venture, the urge to make, to begin, to pour your will into something alive. Seize it while it burns bright: the spark is real, and it wants to become a fire.",
    shadow: "Reversed, the spark sputters. Inspiration fades, plans stall, or energy scatters before it can catch. It can mean a delayed start, creative block, or a passion you sense but cannot yet act upon.",
  },
  "2-of-wands": {
    energy: "The Two of Wands is the vision from the threshold — planning, ambition, and the first survey of a wider world. This energy holds the globe in one hand and the future in the other, weighing where to go next. It invites you to dream beyond the familiar, to make a bold plan, and to step toward the horizon you keep imagining.",
    shadow: "Reversed, the step is not taken. Fear of the unknown breeds indecision, or you play it safe and stay where you are. It can mean a plan abandoned, ambition shrunk to comfort, or a vision you talk about but never pursue.",
  },
  "3-of-wands": {
    energy: "The Three of Wands is expansion underway — foresight, progress, and the confidence of one whose ships are already sailing. This energy looks out from high ground at plans set in motion, trusting they will return rewarded. It invites you to think big, to act on your vision, and to welcome the wider opportunities now coming into view.",
    shadow: "Reversed, the horizon narrows. Delays, obstacles, or shortsighted planning hold progress back. It can mean expectations unmet, expansion attempted too soon, or a vision too small for the moment it faces.",
  },
  "4-of-wands": {
    energy: "The Four of Wands is the joy of arrival — celebration, homecoming, and the harmony of a milestone reached. This energy raises a canopy over good news: stability, community, and a moment worth marking. It invites you to pause and celebrate, to honor the foundation you have built, and to share the gladness with those who belong.",
    shadow: "Reversed, the celebration is muted. Harmony feels unsettled, a transition disrupts the ease, or the foundation is less solid than it looks. It can mean a homecoming delayed, tension beneath the festivity, or a milestone passing without joy.",
  },
  "5-of-wands": {
    energy: "The Five of Wands is the clash of energies — competition, conflict, and the friction of many wills pushing at once. This energy is not war but scuffle: rivalry, debate, the lively chaos of everyone wanting to be heard. It invites you to engage the contest with spirit, to test your strength, and to find what is forged in healthy struggle.",
    shadow: "Reversed, the friction shifts. Conflict is avoided or finally resolved, tension eases, and cooperation returns; or the struggle turns inward, churning as restless inner conflict you cannot put down.",
  },
  "6-of-wands": {
    energy: "The Six of Wands is the rider's triumph — victory, recognition, and the well-earned pride of public success. This energy is the laurel and the cheering crowd, the moment your effort is seen and rewarded. It invites you to accept acclaim with grace, to stand tall in your achievement, and to let confidence carry you toward the next height.",
    shadow: "Reversed, the parade falters. Recognition is withheld, success delayed, or pride swells into arrogance. It can mean a fall from favor, fear of failure, or seeking applause more than the work that earns it.",
  },
  "7-of-wands": {
    energy: "The Seven of Wands is the defense of high ground — courage, conviction, and the will to hold your position against the odds. This energy stands firm when challenged, ready to defend what you believe and what you have earned. It invites you to stand your ground, to fight for your values, and to trust that your higher position is worth protecting.",
    shadow: "Reversed, the guard tires. Overwhelm sets in, you feel outnumbered, or you give up the ground you meant to hold. It can mean exhaustion from constant defense, self-doubt under pressure, or surrendering a stance you should have kept.",
  },
  "8-of-wands": {
    energy: "The Eight of Wands is swift motion — speed, momentum, and the rush of things finally moving fast. This energy is arrows in flight: news arriving, plans accelerating, events falling quickly into place. It invites you to act while the current runs, to send the message, take the trip, and ride the sudden, exhilarating pace of progress.",
    shadow: "Reversed, the momentum jams. Delays, frustration, and scattered energy slow everything down. It can mean miscommunication, plans stalled in transit, or moving so fast that things slip out of your hands.",
  },
  "9-of-wands": {
    energy: "The Nine of Wands is the resilience of the last stand — persistence, grit, and the strength to keep going when you are nearly spent. This energy is the wounded guardian who rises one more time, wary but unbroken. It honors how far you have come and asks you to hold on a little longer: the goal is closer than your tiredness lets you believe.",
    shadow: "Reversed, the defenses turn against you. Exhaustion deepens, wariness curdles into paranoia, or walls go up that keep out help along with harm. It can mean fighting battles already won, or refusing to lower your guard long after the threat has passed.",
  },
  "10-of-wands": {
    energy: "The Ten of Wands is the weight of the load — responsibility, burden, and the determination to carry it all the way home. This energy is the figure bent under a heavy armful of commitments, pressing on through sheer will. It honors your dedication, and gently asks: which of these burdens are truly yours, and which can finally be set down?",
    shadow: "Reversed, the load is addressed. You release what was never yours, delegate, and lighten the weight; or you collapse under it, burned out and unable to admit you took on too much.",
  },
  "page-of-wands": {
    energy: "The Page of Wands is the free spirit at the threshold — enthusiasm, curiosity, and the itch to explore something new. This energy brings fresh ideas, restless excitement, and the courage to follow a spark wherever it leads. It invites you to stay open and adventurous, to chase what lights you up, and to begin before you feel entirely ready.",
    shadow: "Reversed, the spark scatters. Enthusiasm fizzles, plans stay all talk, or impulsiveness leads nowhere. It can mean a direction lost, a passion that never gets off the ground, or excitement that fades the moment work begins.",
  },
  "knight-of-wands": {
    energy: "The Knight of Wands is passion in full gallop — bold, adventurous, and charged with the energy to act on what excites you. This energy charges toward its desires with charisma and daring, unafraid of the leap. It invites you to pursue your passions boldly, to bring fire and movement to your plans, and to live with spirited courage.",
    shadow: "Reversed, the fire runs wild. Boldness turns to recklessness, passion to impatience, and energy scatters in too many directions. It can mean acting without thinking, abandoning projects half-finished, or a temper as quick as the enthusiasm.",
  },
  "queen-of-wands": {
    energy: "The Queen of Wands is radiant confidence — warmth, charisma, and the magnetic vitality that draws others in. This energy is self-assured and generous, at home in her own fire, equal parts courage and joy. She invites you to own your worth, to lead with warmth and boldness, and to let your natural light shine without apology.",
    shadow: "Reversed, the flame turns inward. Confidence cracks into insecurity, jealousy, or the need to dominate; warmth sours into demand. It can mean self-doubt masked as control, or energy spent seeking validation rather than expressing it.",
  },
  "king-of-wands": {
    energy: "The King of Wands is visionary leadership — bold, inspired, and able to turn a grand vision into action that moves others. This energy commands with charisma and conviction, lighting the way and rallying people to a cause. He invites you to lead with vision and courage, to take decisive action, and to inspire by the strength of your own conviction.",
    shadow: "Reversed, the fire scorches. Vision turns to arrogance, leadership to impulsiveness or tyranny, and conviction to a refusal to hear anyone else. It can mean grand promises with no follow-through, or power that burns those it was meant to lead.",
  },

  // ── SWORDS · air · mind, truth, conflict, communication ─────────────
  "ace-of-swords": {
    energy: "The Ace of Swords is the blade of clarity — truth cutting clean through confusion, a breakthrough of mind and insight. This energy is the sharp first thought that names things as they are: clear judgment, honest communication, the power to see and to decide. Raise the sword and let truth cut away what clouds the way forward.",
    shadow: "Reversed, the blade dulls. Confusion clouds the mind, truth is muddled or misused, and clarity slips out of reach. It can mean misinformation, a decision made on faulty grounds, or sharp words that wound instead of clarify.",
  },
  "2-of-swords": {
    energy: "The Two of Swords is the blindfolded pause — a difficult choice held in careful balance, emotions set aside to keep the peace. This energy is the stillness before a decision, two truths weighed with eyes closed. It invites you to find your center, to gather what you cannot yet see, and to know that the blindfold must eventually come off.",
    shadow: "Reversed, the standoff breaks. Hidden information surfaces, the blindfold lifts, and a choice becomes clear; or indecision drags on, the blocked feelings finally spilling over into overwhelm.",
  },
  "3-of-swords": {
    energy: "The Three of Swords is the pierced heart — heartbreak, sorrow, and the sharp clarity of a painful truth. This energy names real grief: betrayal, loss, the ache that comes when something true also hurts. It does not soften the pain, but it honors it — and reminds you that even a wounded heart, once felt fully, can begin to heal.",
    shadow: "Reversed, the swords begin to withdraw. Healing starts, pain is released, and the heart slowly mends; or you cling to the hurt, replaying the wound long after it could begin to close.",
  },
  "4-of-swords": {
    energy: "The Four of Swords is the necessary rest — retreat, recovery, and the quiet that lets the mind heal. This energy is the resting figure laying down the fight for a while, restoring strength in stillness. It invites you to pause, to recover before you act again, and to honor the truth that rest is not retreat but preparation.",
    shadow: "Reversed, the rest is refused or overstayed. Restlessness and burnout push you to act before you have healed; or you withdraw so long that retreat becomes avoidance. It can mean a body and mind crying out for the pause you keep denying them.",
  },
  "5-of-swords": {
    energy: "The Five of Swords is the cost of conflict — tension, defeat, and the hollow taste of winning at someone else's expense. This energy shows the battle won and the bridges burned, the ego that triumphs while the heart loses. It asks you to choose your battles wisely, to notice what victory truly costs, and to weigh whether being right is worth the price.",
    shadow: "Reversed, the conflict seeks an end. You move toward reconciliation, release old resentment, and make amends; or you stay locked in a fight no one can win, unable to lay the swords down.",
  },
  "6-of-swords": {
    energy: "The Six of Swords is the passage to calmer waters — transition, moving on, and the slow journey away from trouble. This energy is the quiet crossing toward something better, the grief carried but the direction clear. It invites you to leave behind what cannot be fixed, to trust the movement, and to let smoother shores draw nearer with each stroke.",
    shadow: "Reversed, the crossing stalls. You resist moving on, stay tied to rough waters, or carry unfinished baggage that weighs the boat down. It can mean a transition blocked, or returning to the very trouble you tried to leave.",
  },
  "7-of-swords": {
    energy: "The Seven of Swords is the lone strategist — cunning, independence, and the careful work done out of sight. This energy is the mind playing a clever angle, acting alone, keeping plans close. At its best it is strategy and self-reliance; it also asks an honest question about whether your means are as clean as your ends.",
    shadow: "Reversed, the secret surfaces. You come clean, your conscience catches up, or a deception is exposed; or the scheming deepens, slipping further from honesty the longer it goes unseen.",
  },
  "8-of-swords": {
    energy: "The Eight of Swords is the self-made cage — feeling trapped, restricted, and bound by fears that are tighter in the mind than in the world. This energy is the blindfolded figure surrounded by blades, not noticing the path is open. It invites you to question the limits you believe in, for many of these bindings loosen the moment you choose to look.",
    shadow: "Reversed, the blindfold slips. You free yourself, find a new perspective, and step past the fear that held you; or the trap tightens as you sink deeper into helplessness, mistaking a prison of thought for a prison of stone.",
  },
  "9-of-swords": {
    energy: "The Nine of Swords is the weight of the sleepless night — anxiety, dread, and the fears that loom largest in the dark. This energy is the figure sitting up, head in hands, besieged by worry. It does not deny the suffering, but it whispers a truth: many of these terrors are heavier in the mind than in the morning light. You are not as alone as the night makes you feel.",
    shadow: "Reversed, the dawn approaches. Fears are faced and named, hope returns, and the worst of the despair begins to lift; or the anguish stays buried, refusing the daylight that could finally ease it.",
  },
  "10-of-swords": {
    energy: "The Ten of Swords is rock bottom — a painful ending, betrayal, or the moment something is finally, fully over. This energy holds nothing back about how much it hurts, yet there is strange relief in it: when you have hit the bottom, there is nowhere to fall, and the only way left is up. The dawn already breaks behind the fallen figure.",
    shadow: "Reversed, you begin to rise. Recovery takes hold, the worst is behind you, and you climb back toward the light; or you resist the ending, dragging out a pain that is already finished and refusing to let it close.",
  },
  "page-of-swords": {
    energy: "The Page of Swords is the sharp young mind — curious, vigilant, and hungry for truth and new ideas. This energy is quick-witted and watchful, eager to learn, question, and speak. It invites you to stay alert and honest, to chase knowledge with enthusiasm, and to use words as a clear blade rather than a careless one.",
    shadow: "Reversed, the wit turns restless. Curiosity scatters into gossip or all talk and no action, and vigilance hardens into suspicion. It can mean sharp words used to wound, scattered thinking, or cleverness that never settles into wisdom.",
  },
  "knight-of-swords": {
    energy: "The Knight of Swords is the charge of pure intellect — ambitious, direct, and fast to act on a clear idea. This energy rushes headlong toward its goal, driven by conviction and the courage of its thoughts. It invites you to act decisively, to speak your truth without flinching, and to bring focused, fearless drive to what you pursue.",
    shadow: "Reversed, the charge turns reckless. Speed becomes haste, directness becomes aggression, and the mind races past the consequences. It can mean acting without thinking, words that cut too deep, or driving so hard you trample what mattered.",
  },
  "queen-of-swords": {
    energy: "The Queen of Swords is clear-eyed honesty — perceptive, independent, and unafraid to see and speak the truth. This energy cuts through illusion with wisdom earned the hard way, valuing fairness, candor, and a mind that thinks for itself. She invites you to set clean boundaries, to speak plainly, and to lead with clarity tempered by hard-won understanding.",
    shadow: "Reversed, the clarity chills. Honesty turns cold or cutting, judgment grows harsh, and old pain hardens into bitterness. It can mean walls built from past hurt, criticism without warmth, or a sharp tongue that pushes love away.",
  },
  "king-of-swords": {
    energy: "The King of Swords is the authority of the mind — intellect, truth, and fair judgment held with steady command. This energy rules through clarity and principle, weighing facts without bias and deciding with integrity. He invites you to lead with reason and honesty, to uphold what is just, and to let clear thinking guide your power.",
    shadow: "Reversed, the mind hardens. Logic turns cold and rigid, authority slides into manipulation or control, and truth becomes a weapon. It can mean ideas imposed without compassion, judgment that has lost its fairness, or intellect used to dominate rather than to serve.",
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
console.log(`OK · energy+shadow EN aplicados a ${patched} Arcanos Menores`);
