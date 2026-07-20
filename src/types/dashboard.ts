import type { WFMLang } from './common'

export interface DashboardShowcaseItem {
  item: string
  background: string
  bigCard: boolean
  label?: string
  labelPosition?: string
}

export interface DashboardShowcase {
  i18n?: Partial<Record<WFMLang, Record<string, string>>> | null
  items: DashboardShowcaseItem[]
}
