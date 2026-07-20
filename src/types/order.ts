import type { OrderType, Platform, UserStatus, WFMLang } from './common'

export interface Activity {
  type: string
  details?: string
  startedAt?: string
}

export interface UserShort {
  id: string
  ingameName: string
  slug: string
  reputation: number
  platform: Platform | string
  crossplay: boolean
  locale: WFMLang | string
  status: UserStatus | string
  avatar?: string
  activity: Activity | null
  lastSeen: string
}

export interface Order {
  id: string
  type: OrderType | string
  platinum: number
  quantity: number
  perTrade?: number
  subtype?: string
  rank?: number
  charges?: number
  amberStars?: number
  cyanStars?: number
  visible: boolean
  createdAt: string
  updatedAt: string
  itemId?: string
  groupId?: string
  user?: UserShort
}

/** @deprecated Prefer Order */
export type OrderWithUser = Order

export interface TxItem {
  id?: string
  rank?: number
  charges?: number
  subtype?: string
  amberStars?: number
  cyanStars?: number
}

export interface Transaction {
  id: string
  type: string
  originId: string
  platinum: number
  quantity: number
  createdAt: string
  updatedAt: string
  item?: TxItem
  user?: UserShort
}

export interface CreateOrderBody {
  itemId: string
  type: OrderType
  platinum: number
  quantity: number
  visible?: boolean
  perTrade?: number
  rank?: number
  charges?: number
  subtype?: string
  amberStars?: number
  cyanStars?: number
}

export interface UpdateOrderBody {
  platinum?: number
  quantity?: number
  visible?: boolean
  perTrade?: number
  rank?: number
  charges?: number
  subtype?: string
  amberStars?: number
  cyanStars?: number
}

export interface CloseOrderBody {
  quantity: number
}

export interface UpdateOrderGroupVisibilityBody {
  visible?: boolean
  type?: OrderType
}

export interface TopOrdersQuery {
  rank?: number
  rankLt?: number
  charges?: number
  chargesLt?: number
  amberStars?: number
  amberStarsLt?: number
  cyanStars?: number
  cyanStarsLt?: number
  subtype?: string
}

export interface TopOrders {
  sell: Order[]
  buy: Order[]
}
