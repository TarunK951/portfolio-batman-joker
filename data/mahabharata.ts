// ============================================================
// Mahabharata — Static character dataset for the Ancient-India theme
// Adherent to the Vyasa text. Image URLs marked TODO should be
// swapped for Wikimedia Commons Raja Ravi Varma / public-domain
// paintings before production launch.
// ============================================================

export type MahabharataFaction = 'Pandava' | 'Kaurava' | 'Neutral' | 'Divine'

export interface MahabharataStats {
  valor: number
  wisdom: number
  devotion: number
  strategy: number
  martial: number
  influence: number
}

export interface MahabharataCharacter {
  id: string
  name: string
  nameDevanagari: string
  epithet: string
  faction: MahabharataFaction
  sideInWar: 'Pandava' | 'Kaurava' | 'Neither'
  parents: { father: string; mother: string }
  spouse?: string[]
  children?: string[]
  siblings?: string[]
  weapons: string[]
  bio: string
  deathCause?: string
  deathBy?: string
  keyMoment: string
  image: string
  stats: MahabharataStats
}

export const mahabharataCharacters: readonly MahabharataCharacter[] = [
  // ── Pandavas ──────────────────────────────────────────────
  {
    id: 'yudhishthira',
    name: 'Yudhishthira',
    nameDevanagari: 'युधिष्ठिर',
    epithet: 'Dharmaraja — King of Righteousness',
    faction: 'Pandava',
    sideInWar: 'Pandava',
    parents: { father: 'Yama (Dharma)', mother: 'Kunti' },
    spouse: ['Draupadi', 'Devika'],
    children: ['Prativindhya', 'Yaudheya'],
    siblings: ['Bhima', 'Arjuna', 'Nakula', 'Sahadeva', 'Karna (unknown to him)'],
    weapons: ['Spear'],
    bio: 'The eldest Pandava, son of Yama. Incapable of speaking a lie — his chariot was said to hover a finger\'s breadth above the ground until the half-truth "Ashwatthama hatah, kunjarah" during the war. His addiction to dice cost Indraprastha and thirteen years of exile.',
    deathCause: 'Ascended Mount Sumeru with his brothers; only he and the dog (Yama in disguise) reached the gates of Svarga alive',
    deathBy: 'Natural ascension (Mahaprasthana)',
    keyMoment: 'Answering the Yaksha\'s riddles at the lake to revive his slain brothers',
    // TODO: replace with Wikimedia Commons Raja Ravi Varma painting
    image: '/mahabharata/yudhishthira.jpg',
    stats: { valor: 78, wisdom: 96, devotion: 94, strategy: 80, martial: 75, influence: 92 },
  },
  {
    id: 'bhima',
    name: 'Bhima',
    nameDevanagari: 'भीम',
    epithet: 'Vrikodara — The Wolf-Bellied',
    faction: 'Pandava',
    sideInWar: 'Pandava',
    parents: { father: 'Vayu (Wind God)', mother: 'Kunti' },
    spouse: ['Hidimbi', 'Draupadi', 'Valandhara'],
    children: ['Ghatotkacha', 'Sutasoma', 'Sarvaga'],
    siblings: ['Yudhishthira', 'Arjuna', 'Nakula', 'Sahadeva'],
    weapons: ['Mace (Gada)'],
    bio: "The second Pandava, son of the Wind God. The strength of ten thousand elephants and an appetite to match. He swore two terrible oaths in the dice-hall — to tear open Dushasana's chest and drink his blood, and to shatter Duryodhana's thigh — and he kept both.",
    deathCause: "Fell on the Himalayan ascent due to the sin of pride in his strength and gluttony",
    deathBy: 'Natural ascension (Mahaprasthana)',
    keyMoment: 'Killing Dushasana and drinking his blood on day 16 of Kurukshetra',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/bhima.jpg',
    stats: { valor: 98, wisdom: 62, devotion: 82, strategy: 65, martial: 99, influence: 78 },
  },
  {
    id: 'arjuna',
    name: 'Arjuna',
    nameDevanagari: 'अर्जुन',
    epithet: 'Savyasachi — The Ambidextrous Archer',
    faction: 'Pandava',
    sideInWar: 'Pandava',
    parents: { father: 'Indra (King of Gods)', mother: 'Kunti' },
    spouse: ['Draupadi', 'Subhadra', 'Ulupi', 'Chitrangada'],
    children: ['Abhimanyu', 'Shrutakarma', 'Iravan', 'Babhruvahana'],
    siblings: ['Yudhishthira', 'Bhima', 'Nakula', 'Sahadeva'],
    weapons: ['Gandiva bow', 'Pashupatastra', 'Brahmastra', 'Agneyastra'],
    bio: "The third Pandava, Indra's son, Krishna's dearest friend, and the greatest archer of the age. On Kurukshetra's first day his bow slipped from his hand at the sight of his kin across the field — and from that hesitation was born the Bhagavad Gita.",
    deathCause: 'Fell on the Himalayan ascent, carrying the sin of pride that none could equal him in archery',
    deathBy: 'Natural ascension (Mahaprasthana)',
    keyMoment: 'Receiving the Bhagavad Gita from Krishna on the battlefield before the war began',
    // TODO: replace with Wikimedia Commons Raja Ravi Varma painting
    image: '/mahabharata/arjuna.jpg',
    stats: { valor: 99, wisdom: 88, devotion: 96, strategy: 90, martial: 100, influence: 94 },
  },
  {
    id: 'nakula',
    name: 'Nakula',
    nameDevanagari: 'नकुल',
    epithet: 'The Handsomest of the Pandavas',
    faction: 'Pandava',
    sideInWar: 'Pandava',
    parents: { father: 'Ashwini Kumaras', mother: 'Madri' },
    spouse: ['Draupadi', 'Karenumati'],
    children: ['Shatanika', 'Niramitra'],
    siblings: ['Yudhishthira', 'Bhima', 'Arjuna', 'Sahadeva'],
    weapons: ['Sword'],
    bio: 'Twin to Sahadeva, son of the divine Ashwini physicians. Master swordsman, unmatched horseman, and said to be the most beautiful man of his age. Kept the Pandava horses through their exile disguised as Granthika.',
    deathCause: 'Fell on the Himalayan ascent, carrying the sin of vanity over his beauty',
    deathBy: 'Natural ascension (Mahaprasthana)',
    keyMoment: 'Defeating Karna in a duel during the Virata war (sparing him on Yudhishthira\'s count)',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/nakula.jpg',
    stats: { valor: 84, wisdom: 72, devotion: 88, strategy: 74, martial: 88, influence: 70 },
  },
  {
    id: 'sahadeva',
    name: 'Sahadeva',
    nameDevanagari: 'सहदेव',
    epithet: 'The Wisest of the Pandavas',
    faction: 'Pandava',
    sideInWar: 'Pandava',
    parents: { father: 'Ashwini Kumaras', mother: 'Madri' },
    spouse: ['Draupadi', 'Vijaya'],
    children: ['Shrutasena', 'Suhotra'],
    siblings: ['Yudhishthira', 'Bhima', 'Arjuna', 'Nakula'],
    weapons: ['Sword'],
    bio: "Nakula's twin, astrologer and gentlest of the brothers. Cursed with omniscience he could never volunteer — he knew the war's outcome before it began, but was forbidden to speak it unasked. Slew Shakuni on the eighteenth day.",
    deathCause: 'Fell on the Himalayan ascent, carrying the sin of intellectual pride',
    deathBy: 'Natural ascension (Mahaprasthana)',
    keyMoment: 'Killing Shakuni — the architect of the dice-game — on day 18',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/sahadeva.jpg',
    stats: { valor: 82, wisdom: 95, devotion: 90, strategy: 92, martial: 84, influence: 72 },
  },

  // ── Kauravas ──────────────────────────────────────────────
  {
    id: 'duryodhana',
    name: 'Duryodhana',
    nameDevanagari: 'दुर्योधन',
    epithet: 'Suyodhana — The Unconquerable',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'Dhritarashtra', mother: 'Gandhari' },
    spouse: ['Bhanumati'],
    children: ['Lakshmana Kumara', 'Lakshmanaa'],
    siblings: ['Dushasana', 'Vikarna', 'and 97 others', 'Dushala (sister)'],
    weapons: ['Mace (Gada)'],
    bio: 'The eldest Kaurava, born of Gandhari after a two-year gestation of iron. His hatred of the Pandavas was visceral, his loyalty to his friends (especially Karna) absolute. Mace student of Balarama — a match for Bhima on any honest ground.',
    deathCause: 'Thigh shattered by Bhima\'s mace on day 18 — a blow below the navel, forbidden by mace-duel rules, struck on Krishna\'s signal to fulfil Bhima\'s oath',
    deathBy: 'bhima',
    keyMoment: 'The dice-game at Hastinapura that disrobed Draupadi and set the war in motion',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/duryodhana.jpg',
    stats: { valor: 92, wisdom: 70, devotion: 65, strategy: 82, martial: 95, influence: 90 },
  },
  {
    id: 'dushasana',
    name: 'Dushasana',
    nameDevanagari: 'दुःशासन',
    epithet: "Duryodhana's Right Hand",
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'Dhritarashtra', mother: 'Gandhari' },
    siblings: ['Duryodhana', 'Vikarna', 'and 97 others', 'Dushala (sister)'],
    weapons: ['Bow', 'Sword'],
    bio: "Second-born of the Kauravas and chief instrument of his brother's cruelty. It was his hand that dragged Draupadi by the hair into the assembly and tried to strip her sari — a moment that sealed the Pandavas' vengeance and the Kurus' doom.",
    deathCause: "Chest torn open and blood drunk by Bhima on day 16, fulfilling Bhima's Kuru Sabha oath",
    deathBy: 'bhima',
    keyMoment: 'The attempted disrobing of Draupadi in the Kuru Sabha',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/dushasana.jpg',
    stats: { valor: 80, wisdom: 48, devotion: 55, strategy: 60, martial: 84, influence: 70 },
  },
  {
    id: 'vikarna',
    name: 'Vikarna',
    nameDevanagari: 'विकर्ण',
    epithet: 'The Righteous Kaurava',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'Dhritarashtra', mother: 'Gandhari' },
    siblings: ['Duryodhana', 'Dushasana', 'and 97 others', 'Dushala (sister)'],
    weapons: ['Bow'],
    bio: 'Third-born Kaurava and the lone voice of conscience at the dice-game — he alone rose to declare Draupadi\'s disrobing unlawful. He still fought for his brother\'s side, bound by loyalty over conviction, and died the noble death of a divided man.',
    deathCause: "Slain by Bhima on day 13 — who wept openly over his body, acknowledging Vikarna's righteousness",
    deathBy: 'bhima',
    keyMoment: "Standing in the Kuru Sabha to declare Draupadi's disrobing adharmic",
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/vikarna.jpg',
    stats: { valor: 86, wisdom: 88, devotion: 82, strategy: 72, martial: 82, influence: 68 },
  },

  // ── Kaurava-side Great Warriors ───────────────────────────
  {
    id: 'bhishma',
    name: 'Bhishma',
    nameDevanagari: 'भीष्म',
    epithet: 'Pitamaha — Grandsire of the Kurus',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'King Shantanu', mother: 'Ganga' },
    weapons: ['Bow', 'Celestial arrows'],
    bio: 'Born Devavrata, son of Ganga. He took the terrible vow of lifelong celibacy so his father could marry Satyavati — earning the name Bhishma ("he of the terrible oath") and the boon of dying only when he willed it. Commander of the Kaurava army for ten days.',
    deathCause: 'Felled by a hailstorm of arrows from Arjuna, who fired from behind Shikhandi (whom Bhishma would not strike) on day 10; he lay on a bed of arrows until the winter solstice before choosing to die',
    deathBy: 'arjuna',
    keyMoment: "Telling Yudhishthira how to defeat him — honouring dharma over his own life — on the eve of day 10",
    // TODO: replace with Wikimedia Commons Raja Ravi Varma painting
    image: '/mahabharata/bhishma.jpg',
    stats: { valor: 98, wisdom: 98, devotion: 96, strategy: 96, martial: 99, influence: 100 },
  },
  {
    id: 'dronacharya',
    name: 'Dronacharya',
    nameDevanagari: 'द्रोणाचार्य',
    epithet: 'Guru of the Kurus',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'Sage Bharadwaja', mother: 'Unknown' },
    spouse: ['Kripi'],
    children: ['Ashwatthama'],
    weapons: ['Bow', 'Brahmastra', 'Brahmashirsha astra'],
    bio: 'Brahmin master of arms, teacher to both Kauravas and Pandavas. His love for his son Ashwatthama was his one undoing — when told "Ashwatthama is dead" (the elephant, not the man), he laid down his weapons and was beheaded.',
    deathCause: 'Beheaded by Dhrishtadyumna on day 15 after he laid down his arms, having been tricked by Yudhishthira\'s half-truth about Ashwatthama',
    deathBy: 'dhrishtadyumna',
    keyMoment: 'Demanding Ekalavya\'s thumb as gurudakshina — and later, his own devastating rampage as commander on days 11–15',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/dronacharya.jpg',
    stats: { valor: 92, wisdom: 94, devotion: 80, strategy: 98, martial: 96, influence: 94 },
  },
  {
    id: 'karna',
    name: 'Karna',
    nameDevanagari: 'कर्ण',
    epithet: 'Daanveer — Hero of the Sun',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'Surya (Sun God)', mother: 'Kunti' },
    spouse: ['Vrushali', 'Supriya'],
    children: ['Vrishasena', 'Vrishaketu', 'Sudama'],
    siblings: ['Yudhishthira', 'Bhima', 'Arjuna', 'Nakula', 'Sahadeva (half-brothers, unknown to him until near the end)'],
    weapons: ['Vijaya bow', 'Vasavi Shakti', 'Bhargavastra'],
    bio: "Born of the Sun to an unwed Kunti, cast into the river as an infant and raised by a charioteer. The finest archer alive after Arjuna — and in many accounts his equal — but born with every curse that mattered: his teacher's, his kavacha given away, his chariot-wheel stuck at the final hour.",
    deathCause: "Beheaded by Arjuna's Anjalika astra on day 17 while Karna was dismounted trying to free his chariot wheel from the mud — Krishna invoked Karna's own lapses of dharma to justify the otherwise adharmic strike",
    deathBy: 'arjuna',
    keyMoment: 'Giving away his divine golden armour (kavacha-kundala) to Indra disguised as a brahmin, knowing it meant his death',
    // User-provided B&W line-art sketch (transparent bg, red tilak)
    image: '/mahabharata/karna.png',
    stats: { valor: 100, wisdom: 85, devotion: 96, strategy: 88, martial: 99, influence: 92 },
  },
  {
    id: 'ashwatthama',
    name: 'Ashwatthama',
    nameDevanagari: 'अश्वत्थामा',
    epithet: 'The Immortal Chiranjivi',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'Dronacharya', mother: 'Kripi' },
    weapons: ['Bow', 'Narayanastra', 'Brahmashirsha astra', 'The gem on his forehead'],
    bio: 'Born with a jewel in his forehead that protected him from hunger, thirst and fatigue. Avenged his father\'s death by slaughtering the sleeping Pandava camp on the final night — killing Dhrishtadyumna, Shikhandi and the five sons of Draupadi while they slept.',
    deathCause: 'Cursed by Krishna to wander the earth immortal — wounded, friendless, and gem-stripped — until the end of the Kali Yuga',
    keyMoment: 'The massacre of the sleeping Pandava camp on the night after day 18',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/ashwatthama.jpg',
    stats: { valor: 96, wisdom: 72, devotion: 68, strategy: 86, martial: 98, influence: 80 },
  },
  {
    id: 'shakuni',
    name: 'Shakuni',
    nameDevanagari: 'शकुनि',
    epithet: 'Prince of Gandhara',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'King Subala of Gandhara', mother: 'Sudarma' },
    siblings: ['Gandhari'],
    weapons: ['Loaded dice', 'Sword'],
    bio: "Gandhari's brother, and the slow poison in Dhritarashtra's court. His dice — carved, legend says, from his dying father's thighbone — would roll whatever number he called. Every step to Kurukshetra passed through his hands first.",
    deathCause: 'Slain by Sahadeva on day 18, fulfilling an oath Sahadeva had sworn in silence on the night of the dice-game',
    deathBy: 'sahadeva',
    keyMoment: 'Rigging the dice-game that cost the Pandavas their kingdom, wife, and thirteen years',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/shakuni.jpg',
    stats: { valor: 58, wisdom: 84, devotion: 40, strategy: 98, martial: 62, influence: 88 },
  },

  // ── Divine / Neutral ──────────────────────────────────────
  {
    id: 'krishna',
    name: 'Krishna',
    nameDevanagari: 'कृष्ण',
    epithet: 'Vasudeva — The Eighth Avatar of Vishnu',
    faction: 'Divine',
    sideInWar: 'Pandava',
    parents: { father: 'Vasudeva', mother: 'Devaki' },
    spouse: ['Rukmini', 'Satyabhama', 'Jambavati', 'and others'],
    children: ['Pradyumna', 'Samba', 'and others'],
    siblings: ['Balarama', 'Subhadra'],
    weapons: ['Sudarshana Chakra', 'Kaumodaki mace', 'Panchajanya conch'],
    bio: "Cowherd, king, diplomat, charioteer, god. He took no weapon onto Kurukshetra — only the reins of Arjuna's chariot — and from that seat delivered the Bhagavad Gita: eighteen chapters on dharma, karma, and the soul. Every pivotal act of the war bent through him.",
    deathCause: "Shot in the heel — his one vulnerable spot — by the hunter Jara, who mistook Krishna's foot for a deer through the forest leaves. Krishna accepted it as the fulfilment of Gandhari's curse and departed the mortal realm.",
    deathBy: 'Jara the hunter',
    keyMoment: 'Delivering the Bhagavad Gita to Arjuna between the two armies on the first day of Kurukshetra',
    // TODO: replace with Wikimedia Commons Raja Ravi Varma painting
    image: '/mahabharata/krishna.jpg',
    stats: { valor: 96, wisdom: 100, devotion: 100, strategy: 100, martial: 98, influence: 100 },
  },
  {
    id: 'vyasa',
    name: 'Vyasa',
    nameDevanagari: 'व्यास',
    epithet: 'Krishna Dvaipayana — The Compiler',
    faction: 'Divine',
    sideInWar: 'Neither',
    parents: { father: 'Sage Parashara', mother: 'Satyavati' },
    children: ['Dhritarashtra', 'Pandu', 'Vidura', 'Shuka'],
    weapons: ['Pen (the Mahabharata itself)'],
    bio: 'Grandfather of both the Kauravas and the Pandavas by right of niyoga, and the poet who composed the Mahabharata itself — dictating the eighteen-parva epic to Ganesha, who wrote it down on a condition of unbroken speed. He is both author and character of his own story.',
    deathCause: 'A Chiranjivi — one of the seven immortals who will remain until the end of the age',
    keyMoment: 'Granting Sanjaya divine sight to narrate the war, blow by blow, to the blind king Dhritarashtra',
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/vyasa.jpg',
    stats: { valor: 70, wisdom: 100, devotion: 98, strategy: 94, martial: 60, influence: 98 },
  },

  // ── Women of the Epic ────────────────────────────────────
  {
    id: 'draupadi',
    name: 'Draupadi',
    nameDevanagari: 'द्रौपदी',
    epithet: 'Panchali — Fire-Born Queen of the Pandavas',
    faction: 'Pandava',
    sideInWar: 'Pandava',
    parents: { father: 'King Drupada (born of sacrificial fire)', mother: 'From the yajna-kund' },
    spouse: ['Yudhishthira', 'Bhima', 'Arjuna', 'Nakula', 'Sahadeva'],
    children: ['Prativindhya', 'Sutasoma', 'Shrutakarma', 'Shatanika', 'Shrutasena (the Upapandavas)'],
    siblings: ['Dhrishtadyumna', 'Shikhandi'],
    weapons: ['Her vow', 'Her unbound hair'],
    bio: "Born of fire, won by Arjuna's aim and shared by five brothers at Kunti's inadvertent word. Dragged into the Kuru Sabha during her menstrual period and nearly disrobed, she vowed to bind her hair only after washing it in Dushasana's blood — a vow Bhima kept for her fourteen years later.",
    deathCause: 'First of the Pandavas to fall on the Himalayan ascent, said to carry the sin of partiality towards Arjuna',
    deathBy: 'Natural ascension (Mahaprasthana)',
    keyMoment: 'Her unanswered question in the Kuru Sabha — "Did my husband lose himself first, or me?" — which no elder could answer and which pulled the war onto its final course',
    // TODO: replace with Wikimedia Commons Raja Ravi Varma painting
    image: '/mahabharata/draupadi.jpg',
    stats: { valor: 92, wisdom: 94, devotion: 96, strategy: 82, martial: 55, influence: 96 },
  },
  {
    id: 'kunti',
    name: 'Kunti',
    nameDevanagari: 'कुन्ती',
    epithet: 'Prithā — Mother of the Pandavas',
    faction: 'Pandava',
    sideInWar: 'Pandava',
    parents: { father: 'King Shurasena (adopted by Kuntibhoja)', mother: 'Marisha' },
    spouse: ['King Pandu'],
    children: ['Karna (pre-marriage, by Surya)', 'Yudhishthira', 'Bhima', 'Arjuna'],
    siblings: ['Vasudeva (Krishna\'s father)'],
    weapons: ['The mantra given by Sage Durvasa'],
    bio: "As a girl she was given a mantra by Sage Durvasa that could summon any god and bear his child. She tested it once on Surya — bore Karna — and in terror cast him adrift on the river. That secret she kept until the eve of the war, and it cost her every son a brother.",
    deathCause: 'Perished in a forest fire alongside Dhritarashtra and Gandhari during their vanaprastha',
    keyMoment: "Revealing to Karna on the riverbank, before Kurukshetra, that he was her first-born and the Pandavas' elder brother — and still failing to stop the war",
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/kunti.jpg',
    stats: { valor: 80, wisdom: 94, devotion: 92, strategy: 78, martial: 45, influence: 90 },
  },
  {
    id: 'gandhari',
    name: 'Gandhari',
    nameDevanagari: 'गान्धारी',
    epithet: 'The Blindfolded Queen',
    faction: 'Kaurava',
    sideInWar: 'Kaurava',
    parents: { father: 'King Subala of Gandhara', mother: 'Sudarma' },
    spouse: ['Dhritarashtra'],
    children: ['Duryodhana', 'Dushasana', 'and 98 others', 'Dushala (daughter)'],
    siblings: ['Shakuni'],
    weapons: ['Tapasvic power', 'Her curse'],
    bio: 'When told her husband Dhritarashtra was blind, she bound her own eyes for life rather than see what he could not — a vow of devotion that became the Kurus\' great tragedy, for she never truly saw her hundred sons. After the war she cursed Krishna — and through him the Yadava line — to destruction.',
    deathCause: 'Perished in a forest fire with Dhritarashtra and Kunti during their vanaprastha',
    keyMoment: "Cursing Krishna after the war that his own clan would annihilate itself — a curse fulfilled thirty-six years later at Prabhasa",
    // TODO: replace with Wikimedia Commons painting
    image: '/mahabharata/gandhari.jpg',
    stats: { valor: 72, wisdom: 96, devotion: 100, strategy: 70, martial: 40, influence: 92 },
  },
]

// ─── Faction metadata ──────────────────────────────────────
export const mahabharataFactions: Record<
  MahabharataFaction,
  { label: string; devanagari: string; color: string; description: string }
> = {
  Pandava: {
    label: 'Pandavas',
    devanagari: 'पाण्डव',
    color: '#f5d76e', // golden dharma
    description: "The five sons of Pandu — exiled princes of Indraprastha, champions of dharma, and the rightful Kuru heirs.",
  },
  Kaurava: {
    label: 'Kauravas',
    devanagari: 'कौरव',
    color: '#8b0000', // blood red
    description: "The hundred sons of Dhritarashtra, led by Duryodhana from Hastinapura — claimants of the throne through usurpation.",
  },
  Neutral: {
    label: 'Neutral',
    devanagari: 'तटस्थ',
    color: '#c0c0c0',
    description: 'Sages, seers and kings who took no side in the war itself but shaped the epic from its margins.',
  },
  Divine: {
    label: 'Divine',
    devanagari: 'दिव्य',
    color: '#4a6fa5', // celestial indigo
    description: 'Avatars, immortals and gods whose presence in the epic reshapes what humans can achieve.',
  },
}

// ─── Key days of the Kurukshetra war ─────────────────────
export const mahabharataWarDays: ReadonlyArray<{
  day: number
  title: string
  event: string
}> = [
  {
    day: 1,
    title: 'The Gita is Sung',
    event: "Arjuna's despair at the sight of his kin; Krishna delivers the Bhagavad Gita between the two armies. Bhishma commands the Kauravas; Uttara falls to Shalya.",
  },
  {
    day: 10,
    title: 'The Grandsire Falls',
    event: 'Arjuna — firing from behind Shikhandi, whom Bhishma will not strike — brings the Pitamaha down onto a bed of arrows. He waits for the winter solstice before choosing to die.',
  },
  {
    day: 13,
    title: "Abhimanyu's Chakravyuha",
    event: "Arjuna's young son Abhimanyu breaches the lotus formation alone and is killed by seven Kaurava maharathis — a massacre that reshapes Arjuna's heart.",
  },
  {
    day: 15,
    title: 'The Fall of Drona',
    event: 'Yudhishthira utters the half-truth "Ashwatthama hatah, kunjarah." Drona lays down his weapons in grief; Dhrishtadyumna beheads him.',
  },
  {
    day: 17,
    title: "Karna's Final Hour",
    event: "Karna's chariot wheel sinks into the Kurukshetra mud. Dismounted, unarmoured, calling for fair combat — he is beheaded by Arjuna's Anjalika astra at Krishna's insistence.",
  },
  {
    day: 18,
    title: 'The Shattered Thigh',
    event: "Shakuni falls to Sahadeva. Sahadeva's brothers slay the remaining Kauravas. Bhima breaks Duryodhana's thigh in mace-duel — ending the war and the age of the Kurus.",
  },
]
