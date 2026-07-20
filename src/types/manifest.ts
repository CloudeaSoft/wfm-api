import type { WFMLang } from './common'

export interface VersionApps {
  ios: string
  android: string
  minIos: string
  minAndroid: string
}

export interface VersionCollections {
  items: string
  rivens: string
  liches: string
  sisters: string
  missions: string
  npcs: string
  locations: string
}

export interface Versions {
  id: string
  apps: VersionApps
  collections: VersionCollections
  updatedAt: string
}

export interface LocationI18N {
  nodeName: string
  systemName: string
  icon: string
  thumb: string
}

export interface Location {
  id: string
  slug: string
  gameRef: string
  faction?: string
  minLevel?: number
  maxLevel?: number
  i18n?: Partial<Record<WFMLang, LocationI18N>>
}

export interface NpcI18N {
  name: string
  icon: string
  thumb: string
}

export interface Npc {
  id: string
  slug: string
  gameRef: string
  i18n?: Partial<Record<WFMLang, NpcI18N>>
}

export interface MissionI18N {
  name: string
  icon: string
  thumb: string
}

export interface Mission {
  id: string
  slug: string
  gameRef: string
  i18n?: Partial<Record<WFMLang, MissionI18N>>
}
