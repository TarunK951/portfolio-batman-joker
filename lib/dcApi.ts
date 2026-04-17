// ============================================================
// DC Characters — Static data adapter
// Previously fetched from the Akabab Superhero API, which was
// unreliable and incomplete. Now resolves synchronously from the
// curated datasets in `data/dcHeroes.ts` and `data/dcVillains.ts`.
// Async signatures are preserved so existing consumers don't break.
// ============================================================

import { dcHeroes, type DCCharacter, type Powerstats } from '@/data/dcHeroes'
import { dcVillains } from '@/data/dcVillains'

export type { Powerstats, DCCharacter } from '@/data/dcHeroes'

export interface SuperheroImages {
  xs: string
  sm: string
  md: string
  lg: string
}

/**
 * Shape kept backwards-compatible with the old Akabab response so
 * downstream consumers (hooks, components) don't need rewrites.
 */
export interface SuperheroAPIResponse {
  id: string
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

// Indexed lookup map — both arrays combined.
const ALL: readonly DCCharacter[] = [...dcHeroes, ...dcVillains]
const BY_ID = new Map(ALL.map((c) => [c.id, c]))

// Maintain the old id-map exports for any code still importing them.
// Keys are kebab-case character ids; values mirror the id for
// signature compatibility (old code used numeric Akabab ids).
export const HERO_IDS = Object.freeze(
  Object.fromEntries(dcHeroes.map((h) => [h.id, h.id])),
) as Readonly<Record<string, string>>

export const VILLAIN_IDS = Object.freeze(
  Object.fromEntries(dcVillains.map((v) => [v.id, v.id])),
) as Readonly<Record<string, string>>

function toApiResponse(c: DCCharacter): SuperheroAPIResponse {
  const images: SuperheroImages = {
    xs: c.image,
    sm: c.image,
    md: c.image,
    lg: c.image,
  }
  return {
    id: c.id,
    name: c.name,
    slug: c.id,
    powerstats: c.powerstats,
    appearance: {
      gender: '-',
      race: '-',
      height: ['-', '-'],
      weight: ['-', '-'],
      eyeColor: '-',
      hairColor: '-',
    },
    biography: {
      fullName: c.realName,
      alterEgos: '-',
      aliases: [],
      placeOfBirth: '-',
      firstAppearance: c.firstAppearance,
      publisher: 'DC Comics',
      alignment: c.alignment === 'hero' ? 'good' : 'bad',
    },
    work: {
      occupation: c.title,
      base: '-',
    },
    connections: {
      groupAffiliation: c.affiliation.join(', '),
      relatives: '-',
    },
    images,
  }
}

/**
 * Resolve a single character by kebab-case id.
 * Returns a promise to preserve the original async signature.
 */
export function fetchCharacter(
  id: string | number,
): Promise<SuperheroAPIResponse> {
  const key = String(id)
  const character = BY_ID.get(key)
  if (!character) {
    return Promise.reject(new Error(`Unknown DC character id: ${key}`))
  }
  return Promise.resolve(toApiResponse(character))
}

export function fetchCharacters(
  ids: ReadonlyArray<string | number>,
): Promise<SuperheroAPIResponse[]> {
  return Promise.all(ids.map(fetchCharacter))
}

/** Direct synchronous accessors — preferred for new code. */
export function getHeroes(): readonly DCCharacter[] {
  return dcHeroes
}

export function getVillains(): readonly DCCharacter[] {
  return dcVillains
}

export function getCharacterById(id: string): DCCharacter | undefined {
  return BY_ID.get(id)
}
