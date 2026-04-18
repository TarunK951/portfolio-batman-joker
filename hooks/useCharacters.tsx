'use client'

import {
  type SuperheroAPIResponse,
  type SuperheroImages,
} from '@/lib/dcApi'
import {
  dcHeroes,
  type DCCharacter,
  type Powerstats,
} from '@/data/dcHeroes'
import { dcVillains } from '@/data/dcVillains'

/**
 * Character shape consumed by the DC Grid section.
 * Kept backwards-compatible with the old Akabab-enriched shape so
 * existing components keep working. `apiId` now mirrors the id
 * string; `powerstats`/`images` are always present (never null).
 */
export interface Character extends DCCharacter {
  apiId: string
  powerstats: Powerstats
  images: SuperheroImages
  /** @deprecated retained for legacy display code — mirrors `powerstats`. */
  stats: Record<string, number>
  /** @deprecated previously held a skill-keyword string for UI badges. */
  skillMapped: string
}

// Akabab Superhero API CDN — free, no key, hosts character art for the
// canonical numeric ids. We map our kebab-case ids to the numeric ids
// here so the UI always has a real image (with SmartImage fallback for
// any 404s).
const AKABAB_ID: Readonly<Record<string, number>> = {
  // heroes
  batman: 70,
  superman: 644,
  'wonder-woman': 720,
  flash: 213,
  'green-lantern': 263,
  aquaman: 40,
  cyborg: 148,
  nightwing: 496,
  robin: 562,
  'green-arrow': 271,
  'martian-manhunter': 429,
  shazam: 620,
  // villains
  joker: 370,
  harley: 301,
  'harley-quinn': 301,
  bane: 65,
  riddler: 578,
  scarecrow: 607,
  'poison-ivy': 543,
  'mr-freeze': 469,
  'two-face': 680,
  deathstroke: 195,
  'lex-luthor': 405,
  darkseid: 173,
  'black-adam': 62,
  'reverse-flash': 561,
  'killer-croc': 380,
  brainiac: 99,
}

function akababUrl(id: string, size: 'xs' | 'sm' | 'md' | 'lg'): string {
  const n = AKABAB_ID[id]
  if (!n) return `/characters/${id}.jpg` // SmartImage will fall back to initials
  return `https://akabab.github.io/superhero-api/api/images/${size}/${n}.jpg`
}

function toCharacter(c: DCCharacter): Character {
  const images: SuperheroImages = {
    xs: akababUrl(c.id, 'xs'),
    sm: akababUrl(c.id, 'sm'),
    md: akababUrl(c.id, 'md'),
    lg: akababUrl(c.id, 'lg'),
  }
  return {
    ...c,
    apiId: c.id,
    powerstats: c.powerstats,
    images,
    stats: {
      INTELLIGENCE: c.powerstats.intelligence,
      STRENGTH: c.powerstats.strength,
      SPEED: c.powerstats.speed,
      DURABILITY: c.powerstats.durability,
      POWER: c.powerstats.power,
      COMBAT: c.powerstats.combat,
    },
    skillMapped: c.title,
  }
}

const HEROES: readonly Character[] = dcHeroes.map(toCharacter)
const VILLAINS: readonly Character[] = dcVillains.map(toCharacter)

/**
 * Returns heroes from the static dataset.
 * `loading`/`error` are preserved for consumer compatibility but
 * are no-ops — data resolves synchronously.
 */
export function useHeroes(): {
  heroes: readonly Character[]
  loading: false
  error: null
} {
  return { heroes: HEROES, loading: false, error: null }
}

export function useVillains(): {
  villains: readonly Character[]
  loading: false
  error: null
} {
  return { villains: VILLAINS, loading: false, error: null }
}

export type { SuperheroAPIResponse }
