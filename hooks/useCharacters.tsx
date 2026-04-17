'use client'

import { useState, useEffect } from 'react'
import {
  fetchCharacters,
  HERO_IDS,
  VILLAIN_IDS,
  type SuperheroAPIResponse,
} from '@/lib/dcApi'
import { dcHeroes, type DCCharacter } from '@/data/dcHeroes'
import { dcVillains } from '@/data/dcVillains'

/** Static character data enriched with API images and powerstats. */
export interface Character extends DCCharacter {
  apiId: number
  powerstats: SuperheroAPIResponse['powerstats'] | null
  images: SuperheroAPIResponse['images'] | null
}

function mergeWithStatic(
  apiData: SuperheroAPIResponse[],
  staticData: readonly DCCharacter[],
  idMap: Record<string, number>,
): Character[] {
  const entries = Object.entries(idMap)
  return entries.map((entry, i) => {
    const [key, apiId] = entry
    const api = apiData[i]
    const local = staticData.find((c) => c.id === key)

    return {
      id: key,
      name: local?.name ?? api?.name ?? key,
      realName: local?.realName ?? api?.biography.fullName ?? '',
      title: local?.title ?? '',
      skillMapped: local?.skillMapped ?? '',
      bio: local?.bio ?? '',
      stats: local?.stats ?? {},
      apiId,
      powerstats: api?.powerstats ?? null,
      images: api?.images ?? null,
    }
  })
}

export function useHeroes() {
  const [heroes, setHeroes] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ids = Object.values(HERO_IDS)
    fetchCharacters([...ids])
      .then((data) => setHeroes(mergeWithStatic(data, dcHeroes, HERO_IDS)))
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Failed to fetch heroes'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  return { heroes, loading, error }
}

export function useVillains() {
  const [villains, setVillains] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ids = Object.values(VILLAIN_IDS)
    fetchCharacters([...ids])
      .then((data) =>
        setVillains(mergeWithStatic(data, dcVillains, VILLAIN_IDS)),
      )
      .catch((e: unknown) => {
        const msg =
          e instanceof Error ? e.message : 'Failed to fetch villains'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  return { villains, loading, error }
}
