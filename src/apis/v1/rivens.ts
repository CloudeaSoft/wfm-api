import type { Auction, RivenOrder, WFMResponseV1 } from '../../types'
import type { WfmGet } from '../http'
import { WFM_API_V1 } from '../http'

export function createV1RivenApis(get: WfmGet): {
  getOrders: (itemId: string) => Promise<RivenOrder[] | undefined>
} {
  return {
    getOrders: async (itemId: string) => {
      const response = await get<WFMResponseV1<Auction<RivenOrder>>>(
        `${WFM_API_V1}auctions/search?type=riven&sort_by=price_asc&weapon_url_name=${itemId}`,
      )
      return response?.payload?.auctions
    },
  }
}
