import type { ItemRef, UserRef, WfmRequest } from '../types'

export const WFM_API_V1 = 'https://api.warframe.market/v1/'
export const WFM_API_V2 = 'https://api.warframe.market/v2/'
export const WFM_API_AUTH = 'https://api.warframe.market/auth/'
export const WFM_STATIC_ASSETS = 'https://warframe.market/static/assets/'

export function itemPath(ref: ItemRef, suffix = ''): string {
  const base = 'slug' in ref
    ? `item/${encodeURIComponent(ref.slug)}`
    : `itemId/${encodeURIComponent(ref.itemId)}`
  return `${WFM_API_V2}${base}${suffix}`
}

export function ordersItemPath(ref: ItemRef, suffix = ''): string {
  const base = 'slug' in ref
    ? `orders/item/${encodeURIComponent(ref.slug)}`
    : `orders/itemId/${encodeURIComponent(ref.itemId)}`
  return `${WFM_API_V2}${base}${suffix}`
}

export function ordersUserPath(ref: UserRef): string {
  return 'slug' in ref
    ? `${WFM_API_V2}orders/user/${encodeURIComponent(ref.slug)}`
    : `${WFM_API_V2}orders/userId/${encodeURIComponent(ref.userId)}`
}

export function userPath(ref: UserRef): string {
  return 'slug' in ref
    ? `${WFM_API_V2}user/${encodeURIComponent(ref.slug)}`
    : `${WFM_API_V2}userId/${encodeURIComponent(ref.userId)}`
}

export function achievementsUserPath(ref: UserRef): string {
  return 'slug' in ref
    ? `${WFM_API_V2}achievements/user/${encodeURIComponent(ref.slug)}`
    : `${WFM_API_V2}achievements/userId/${encodeURIComponent(ref.userId)}`
}

export type { WfmRequest }
