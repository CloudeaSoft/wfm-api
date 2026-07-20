import type {
  Platform,
  UserRole,
  UserStatus,
  UserTier,
  WFMLang,
} from './common'
import type { Activity } from './order'

export interface NameHistory {
  name: string
  until?: string
}

export interface User {
  id: string
  role: UserRole | string
  tier: UserTier | string
  ingameName: string
  slug: string
  avatar?: string
  background?: string
  about: string
  reputation: number
  masteryRank: number
  status: UserStatus | string
  activity: Activity | null
  lastSeen: string
  platform: Platform | string
  crossplay: boolean
  locale: WFMLang | string
  banned?: boolean
  banUntil?: string
  banMessage?: string
  createdAt?: string
  warned?: boolean
  warnMessage?: string
  warnedBy?: string
  warnedAt?: string
  bannedBy?: string
  bannedAt?: string
  nameHistory?: NameHistory[]
  uid?: string
}

export interface UserPrivate {
  id: string
  role: string
  tier: string
  subscription: boolean
  ingameName: string
  slug: string
  avatar?: string
  background?: string
  about: string
  aboutRaw: string
  reputation: number
  masteryRank: number
  credits: number
  lastSeen: string
  platform: string
  crossplay: boolean
  locale: string
  theme: string
  syncLocale: boolean
  syncTheme: boolean
  verification: boolean
  checkCode: string
  createdAt?: string
  warned?: boolean
  warnMessage?: string
  warnedBy?: string
  banned?: boolean
  banUntil?: string
  banMessage?: string
  bannedBy?: string
  unreadNotifications: number
  deleteInProgress?: boolean
  deleteAt?: string
  linkedAccounts: Record<string, unknown>
  hasEmail?: boolean
  email?: string
}

export interface UpdateMeBody {
  about?: string
  platform?: Platform
  crossplay?: boolean
  locale?: WFMLang
  theme?: 'light' | 'dark' | 'system'
  syncLocale?: boolean
  syncTheme?: boolean
}
