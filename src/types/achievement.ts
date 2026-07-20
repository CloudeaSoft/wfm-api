import type { WFMLang } from './common'

export interface AchievementState {
  featured?: boolean
  hidden?: boolean
  progress?: number | null
  completedAt?: string
}

export interface AchievementI18N {
  name?: string
  description?: string
  icon?: string
  thumb?: string
}

export interface Achievement {
  id: string
  slug: string
  type: string
  secret?: boolean
  reputationBonus?: number
  goal?: number
  i18n: Partial<Record<WFMLang, AchievementI18N>>
  state?: AchievementState | null
}
