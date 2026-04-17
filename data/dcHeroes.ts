// ============================================================
// DC Heroes — Self-contained static dataset
// Replaces the unreliable Akabab Superhero API with curated,
// narrative-accurate entries. Image URLs marked TODO should be
// replaced with Wikimedia Commons / official stills before launch.
// ============================================================

export interface Powerstats {
  intelligence: number
  strength: number
  speed: number
  durability: number
  power: number
  combat: number
}

export type Alignment = 'hero' | 'villain'

export interface DCCharacter {
  id: string
  name: string
  realName: string
  title: string
  bio: string
  alignment: Alignment
  affiliation: string[]
  powerstats: Powerstats
  image: string
  firstAppearance: string
  nemesis?: string
}

export const dcHeroes: readonly DCCharacter[] = [
  {
    id: 'batman',
    name: 'Batman',
    realName: 'Bruce Wayne',
    title: 'The Dark Knight',
    bio: "The world's greatest detective. After witnessing his parents' murder as a child, Bruce Wayne forged himself into a symbol of fear for Gotham's criminals. No powers — only preparation, intellect, and an unbreakable will.",
    alignment: 'hero',
    affiliation: ['Justice League', 'Batman Family', 'Wayne Enterprises'],
    powerstats: { intelligence: 100, strength: 26, speed: 27, durability: 50, power: 47, combat: 100 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/batman.jpg',
    firstAppearance: 'Detective Comics #27 (1939)',
    nemesis: 'Joker',
  },
  {
    id: 'superman',
    name: 'Superman',
    realName: 'Clark Kent / Kal-El',
    title: 'The Man of Steel',
    bio: 'The last son of Krypton, raised in Smallville, Kansas. His near-limitless power is equalled only by his discipline and compassion. He is the standard every other hero is measured against.',
    alignment: 'hero',
    affiliation: ['Justice League', 'Daily Planet', 'House of El'],
    powerstats: { intelligence: 94, strength: 100, speed: 100, durability: 100, power: 100, combat: 85 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/superman.jpg',
    firstAppearance: 'Action Comics #1 (1938)',
    nemesis: 'Lex Luthor',
  },
  {
    id: 'wonder-woman',
    name: 'Wonder Woman',
    realName: 'Diana of Themyscira',
    title: 'Princess of the Amazons',
    bio: 'Daughter of Hippolyta, ambassador of Themyscira, wielder of the Lasso of Truth. Diana fights not to conquer but to protect — a warrior sculpted from clay and gifted life by the Olympian gods.',
    alignment: 'hero',
    affiliation: ['Justice League', 'Amazons of Themyscira'],
    powerstats: { intelligence: 88, strength: 100, speed: 79, durability: 100, power: 100, combat: 100 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/wonder-woman.jpg',
    firstAppearance: 'All Star Comics #8 (1941)',
    nemesis: 'Ares',
  },
  {
    id: 'flash',
    name: 'The Flash',
    realName: 'Barry Allen',
    title: 'The Scarlet Speedster',
    bio: 'A Central City forensic scientist struck by lightning and bathed in chemicals, gaining a connection to the Speed Force. Faster than thought — and kind enough to never abuse it.',
    alignment: 'hero',
    affiliation: ['Justice League', 'Central City PD'],
    powerstats: { intelligence: 88, strength: 48, speed: 100, durability: 60, power: 100, combat: 60 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/flash.jpg',
    firstAppearance: 'Showcase #4 (1956)',
    nemesis: 'Reverse-Flash',
  },
  {
    id: 'green-lantern',
    name: 'Green Lantern',
    realName: 'Hal Jordan',
    title: 'Emerald Knight of Sector 2814',
    bio: 'A test pilot chosen by a dying alien to wield the universe\'s most powerful weapon — a ring that converts willpower into hard-light constructs. Courage is the only fuel it runs on.',
    alignment: 'hero',
    affiliation: ['Justice League', 'Green Lantern Corps'],
    powerstats: { intelligence: 80, strength: 90, speed: 75, durability: 90, power: 100, combat: 80 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/green-lantern.jpg',
    firstAppearance: 'Showcase #22 (1959)',
    nemesis: 'Sinestro',
  },
  {
    id: 'aquaman',
    name: 'Aquaman',
    realName: 'Arthur Curry / Orin',
    title: 'King of Atlantis',
    bio: 'Half-human, half-Atlantean, ruler of the seven seas. Master of two worlds and brokered peace between them more than once. Do not mistake the beard for softness — he carries a trident forged by gods.',
    alignment: 'hero',
    affiliation: ['Justice League', 'Atlantis'],
    powerstats: { intelligence: 81, strength: 85, speed: 79, durability: 80, power: 100, combat: 80 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/aquaman.jpg',
    firstAppearance: 'More Fun Comics #73 (1941)',
    nemesis: 'Black Manta',
  },
  {
    id: 'cyborg',
    name: 'Cyborg',
    realName: 'Victor Stone',
    title: 'The Man Machine',
    bio: "A star STAR Labs athlete rebuilt by his father after a cataclysmic accident. Half-flesh, half-Apokoliptian tech — the living bridge between humanity and the technological singularity.",
    alignment: 'hero',
    affiliation: ['Justice League', 'Teen Titans', 'STAR Labs'],
    powerstats: { intelligence: 88, strength: 80, speed: 58, durability: 90, power: 98, combat: 72 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/cyborg.jpg',
    firstAppearance: 'DC Comics Presents #26 (1980)',
    nemesis: 'Grid',
  },
  {
    id: 'nightwing',
    name: 'Nightwing',
    realName: 'Richard "Dick" Grayson',
    title: 'The First Robin',
    bio: 'The original Boy Wonder, now the acrobatic leader of Blüdhaven\'s defenders. He stepped out of the Bat\'s shadow and built something warmer — not a replacement for Batman, but a complement.',
    alignment: 'hero',
    affiliation: ['Batman Family', 'Teen Titans', 'Justice League'],
    powerstats: { intelligence: 85, strength: 30, speed: 33, durability: 40, power: 50, combat: 95 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/nightwing.jpg',
    firstAppearance: 'Tales of the Teen Titans #44 (1984)',
    nemesis: 'Tony Zucco',
  },
  {
    id: 'robin',
    name: 'Robin',
    realName: 'Damian Wayne',
    title: 'The Boy Wonder',
    bio: 'Son of Bruce Wayne and Talia al Ghul, raised by the League of Assassins before finding his father. A prodigy in combat and arrogance alike — still learning that heroism is not inheritance but choice.',
    alignment: 'hero',
    affiliation: ['Batman Family', 'Teen Titans', 'League of Assassins (former)'],
    powerstats: { intelligence: 82, strength: 28, speed: 30, durability: 38, power: 45, combat: 90 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/robin.jpg',
    firstAppearance: 'Batman #655 (2006)',
    nemesis: 'Heretic',
  },
  {
    id: 'green-arrow',
    name: 'Green Arrow',
    realName: 'Oliver Queen',
    title: 'The Emerald Archer',
    bio: 'A billionaire playboy marooned on a hostile island who returned a master archer with a social conscience. Street-level hero of Star City — where a trick arrow still beats a rocket launcher.',
    alignment: 'hero',
    affiliation: ['Justice League', 'Queen Industries'],
    powerstats: { intelligence: 80, strength: 15, speed: 30, durability: 45, power: 50, combat: 95 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/green-arrow.jpg',
    firstAppearance: 'More Fun Comics #73 (1941)',
    nemesis: 'Merlyn',
  },
  {
    id: 'martian-manhunter',
    name: 'Martian Manhunter',
    realName: "J'onn J'onzz",
    title: 'The Last Son of Mars',
    bio: "The sole survivor of Mars, pulled to Earth by a teleportation accident. Telepath, shapeshifter, flight, super-strength — and a loneliness no power can cure. Quiet conscience of the Justice League.",
    alignment: 'hero',
    affiliation: ['Justice League', 'Department of Extranormal Operations'],
    powerstats: { intelligence: 100, strength: 100, speed: 92, durability: 95, power: 100, combat: 85 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/martian-manhunter.jpg',
    firstAppearance: 'Detective Comics #225 (1955)',
    nemesis: "Ma'alefa'ak",
  },
  {
    id: 'shazam',
    name: 'Shazam',
    realName: 'Billy Batson',
    title: 'The Champion of Magic',
    bio: 'A teenage foster kid who shouts a single word — SHAZAM — and transforms into an adult god, gifted the wisdom of Solomon, strength of Hercules, and speed of Mercury. Still, at heart, a boy.',
    alignment: 'hero',
    affiliation: ['Justice League', 'Shazam Family'],
    powerstats: { intelligence: 94, strength: 100, speed: 92, durability: 100, power: 100, combat: 80 },
    // TODO: replace with Wikimedia Commons / official still
    image: '/characters/shazam.jpg',
    firstAppearance: 'Whiz Comics #2 (1940)',
    nemesis: 'Black Adam',
  },
]
