import type { ItemShort, OrderWithUser, WFMResponse } from '../../types'
import type { WfmGet } from '../http'
import { WFM_API_V2 } from '../http'

export function createV2ItemApis(get: WfmGet): {
  getList: () => Promise<ItemShort[] | undefined>
  getOrders: (itemId: string) => Promise<OrderWithUser[] | undefined>
} {
  return {
    getList: async () => {
      const response = await get<WFMResponse<ItemShort[]>>(
        `${WFM_API_V2}items`,
      )
      return response?.data
    },
    getOrders: async (itemId: string) => {
      const response = await get<WFMResponse<OrderWithUser[]>>(
        `${WFM_API_V2}orders/item/${itemId}`,
      )
      return response?.data
    },
  }
}
