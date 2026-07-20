import type {
  Auction,
  RivenAttribute,
  RivenItem,
  RivenOrder,
  WFMResponse,
  WFMResponseV1,
} from '../types'

const wfmApiV1Base = 'https://api.warframe.market/v1/'
const wfmApiV2Base = 'https://api.warframe.market/v2/'

type WfmGet = <T>(url: string) => Promise<T | undefined>

export function createRivenEndpoints(
  get: WfmGet,
): {
  getItems: () => Promise<RivenItem[] | undefined>
  getOrders: (itemId: string) => Promise<RivenOrder[] | undefined>
  getAttributes: () => Promise<RivenAttribute[] | undefined>
} {
  return {
    getItems: async () => {
      const response = await get<WFMResponse<RivenItem[]>>(
        `${wfmApiV2Base}riven/weapons`,
      )
      return response?.data
    },
    getOrders: async (itemId: string) => {
      const response = await get<WFMResponseV1<Auction<RivenOrder>>>(
        `${wfmApiV1Base}auctions/search?type=riven&sort_by=price_asc&weapon_url_name=${itemId}`,
      )
      return response?.payload?.auctions
    },
    getAttributes: async () => {
      const response = await get<WFMResponse<RivenAttribute[]>>(
        `${wfmApiV2Base}riven/attributes`,
      )
      return response?.data
    },
  }
}
