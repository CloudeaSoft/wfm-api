import type { WFMLang } from './common'

export type RivenAttributeUnit = 'percent' | 'multiply' | 'seconds' | string

export interface RivenItemI18N {
  name: string
  wikiLink?: string
  icon: string
  thumb: string
  subIcon?: string
}

export interface RivenItem {
  id: string
  slug: string
  gameRef: string
  group?: string
  rivenType?: string
  disposition: number
  reqMasteryRank: number
  i18n?: Partial<Record<WFMLang, RivenItemI18N | null>>
}

export interface RivenAttributeI18N {
  name?: string
  icon?: string
  thumb?: string
}

export interface RivenAttribute {
  id: string
  slug: string
  gameRef: string
  group?: string
  prefix: string
  suffix: string
  exclusiveTo?: string[]
  positiveIsNegative?: boolean
  unit?: RivenAttributeUnit
  positiveOnly?: boolean
  negativeOnly?: boolean
  i18n?: Partial<Record<WFMLang, RivenAttributeI18N>>
}

interface Riven {
  polarity: string
  mod_rank: number
  re_rolls: number
  attributes: Array<{
    value: number
    positive: boolean
    url_name: string
  }>
  type: string
  name: string
  weapon_url_name: string
  mastery_level: number
}

interface RivenUser {
  reputation: number
  platform: string
  locale: string
  avatar: string | null
  last_seen: string
  crossplay: boolean
  ingame_name: string
  slug: string
  status: 'offline' | 'online' | 'ingame' | string
  id: string
  region: string
}

export interface RivenOrder {
  buyout_price: number | null
  visible: boolean
  minimal_reputation: number
  starting_price: number
  note: string
  platform: string
  crossplay: boolean
  closed: boolean
  top_bid: number | null
  is_marked_for: string | null
  marked_operation_at: string | null
  created: string
  updated: string
  note_raw: string
  is_direct_sell: boolean
  id: string
  owner: RivenUser
  winner: RivenUser | null
  item: Riven
  private: boolean
}
