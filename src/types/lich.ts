import type { WFMLang } from './common'

export interface LichWeaponI18N {
  name: string
  wikiLink: string
  icon: string
  thumb: string
}

export interface LichWeapon {
  id: string
  slug: string
  gameRef: string
  reqMasteryRank: number
  i18n?: Partial<Record<WFMLang, LichWeaponI18N>>
}

export interface LichEphemeraI18N {
  name: string
  icon: string
  thumb: string
}

export interface LichEphemera {
  id: string
  slug: string
  gameRef: string
  animation: string
  element: string
  i18n?: Partial<Record<WFMLang, LichEphemeraI18N>>
}

export interface LichQuirkI18N {
  name: string
  description: string
  icon: string
  thumb: string
}

export interface LichQuirk {
  id: string
  slug: string
  group?: string
  i18n?: Partial<Record<WFMLang, LichQuirkI18N>>
}
