// ============================================================
// DC Characters — Akabab Superhero API
// FREE — No API key needed
// Docs: https://akabab.github.io/superhero-api/api/
// ============================================================

const BASE = 'https://akabab.github.io/superhero-api/api'

export interface Powerstats {
  intelligence: number
  strength: number
  speed: number
  durability: number
  power: number
  combat: number
}

export interface SuperheroImages {
  xs: string // 32px
  sm: string // 100px
  md: string // 200px
  lg: string // 400px — primary display size
}

export interface SuperheroAPIResponse {
  id: number
  name: string
  slug: string
  powerstats: Powerstats
  appearance: {
    gender: string
    race: string
    height: string[]
    weight: string[]
    eyeColor: string
    hairColor: string
  }
  biography: {
    fullName: string
    alterEgos: string
    aliases: string[]
    placeOfBirth: string
    firstAppearance: string
    publisher: string
    alignment: string
  }
  work: {
    occupation: string
    base: string
  }
  connections: {
    groupAffiliation: string
    relatives: string
  }
  images: SuperheroImages
}

export async function fetchCharacter(
  id: number,
): Promise<SuperheroAPIResponse> {
  const res = await fetch(`${BASE}/id/${id}.json`)
  if (!res.ok) throw new Error(`Failed to fetch character ${id}`)
  return res.json() as Promise<SuperheroAPIResponse>
}

export async function fetchCharacters(
  ids: number[],
): Promise<SuperheroAPIResponse[]> {
  return Promise.all(ids.map(fetchCharacter))
}

// ── Character IDs (Akabab Superhero API) ───────────────────
export const HERO_IDS = {
  batman: 69,
  superman: 644,
  'wonder-woman': 720,
  flash: 213,
  'green-lantern': 263,
  aquaman: 40,
  cyborg: 148,
  nightwing: 496,
} as const satisfies Record<string, number>

export const VILLAIN_IDS = {
  joker: 370,
  harley: 301,
  bane: 65,
  riddler: 578,
  scarecrow: 607,
  'poison-ivy': 543,
  'mr-freeze': 469,
  'two-face': 680,
} as const satisfies Record<string, number>
