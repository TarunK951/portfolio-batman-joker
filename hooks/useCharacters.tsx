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

function toCharacter(c: DCCharacter): Character {
  const images: SuperheroImages = {
    xs: c.image,
    sm: c.image,
    md: c.image,
    lg: c.image,
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
