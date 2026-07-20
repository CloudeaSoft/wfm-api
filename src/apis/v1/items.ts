import type { StatisticsCollection, WFMResponseV1 } from '../../types'
import type { WfmGet } from '../http'
import { WFM_API_V1 } from '../http'

export function createV1ItemApis(get: WfmGet): {
  getStatistics: (itemId: string) => Promise<StatisticsCollection | undefined>
} {
  return {
    getStatistics: async (itemId: string) => {
      const response = await get<WFMResponseV1<StatisticsCollection>>(
        `${WFM_API_V1}items/${itemId}/statistics`,
      )
      return response?.payload
    },
  }
}
