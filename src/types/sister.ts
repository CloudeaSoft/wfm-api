import type { WFMLang } from './common'

export interface SisterWeaponI18N {
  name: string
  wikiLink: string
  icon: string
  thumb: string
}

export interface SisterWeapon {
  id: string
  slug: string
  gameRef: string
  reqMasteryRank: number
  i18n?: Partial<Record<WFMLang, SisterWeaponI18N>>
}

export interface SisterEphemeraI18N {
  name: string
  icon: string
  thumb: string
}

export interface SisterEphemera {
  id: string
  slug: string
  gameRef: string
  animation: string
  element: string
  i18n?: Partial<Record<WFMLang, SisterEphemeraI18N>>
}

export interface SisterQuirkI18N {
  name: string
  description: string
  icon: string
  thumb: string
}

export interface SisterQuirk {
  id: string
  slug: string
  group?: string
  i18n?: Partial<Record<WFMLang, SisterQuirkI18N>>
}
