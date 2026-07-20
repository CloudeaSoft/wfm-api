import type { CallOptions, RivenOrder, WfmRequest } from '../../types'
import { WFM_API_V1 } from '../http'

export function createV1RivenApis(request: WfmRequest): {
  getOrders: (weaponUrlName: string, options?: CallOptions) => Promise<RivenOrder[]>
} {
  return {
    getOrders: async (weaponUrlName, options) => {
      const auctions = await request<{ auctions: RivenOrder[] }>(
        `${WFM_API_V1}auctions/search?type=riven&sort_by=price_asc&weapon_url_name=${encodeURIComponent(weaponUrlName)}`,
        {
          envelope: 'v1',
          context: options,
        },
      )
      return auctions.auctions
    },
  }
}
