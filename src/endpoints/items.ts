import type {
  ItemShort,
  OrderWithUser,
  StatisticsCollection,
  WFMResponse,
  WFMResponseV1,
} from '../types'

const wfmApiV1Base = 'https://api.warframe.market/v1/'
const wfmApiV2Base = 'https://api.warframe.market/v2/'

type WfmGet = <T>(url: string) => Promise<T | undefined>

export function createItemEndpoints(
  get: WfmGet,
): {
  getList: () => Promise<ItemShort[] | undefined>
  getStatistics: (itemId: string) => Promise<StatisticsCollection | undefined>
  getOrders: (itemId: string) => Promise<OrderWithUser[] | undefined>
} {
  return {
    getList: async () => {
      const response = await get<WFMResponse<ItemShort[]>>(
        `${wfmApiV2Base}items`,
      )
      return response?.data
    },
    getStatistics: async (itemId: string) => {
      const response = await get<WFMResponseV1<StatisticsCollection>>(
        `${wfmApiV1Base}items/${itemId}/statistics`,
      )
      return response?.payload
    },
    getOrders: async (itemId: string) => {
      const response = await get<WFMResponse<OrderWithUser[]>>(
        `${wfmApiV2Base}orders/item/${itemId}`,
      )
      return response?.data
    },
  }
}
