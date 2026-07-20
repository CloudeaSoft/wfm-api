import type { CallOptions, StatisticsCollection, WfmRequest } from '../../types'
import { WFM_API_V1 } from '../http'

export function createV1ItemApis(request: WfmRequest): {
  getStatistics: (itemId: string, options?: CallOptions) => Promise<StatisticsCollection>
} {
  return {
    getStatistics: async (itemId, options) =>
      request(`${WFM_API_V1}items/${encodeURIComponent(itemId)}/statistics`, {
        envelope: 'v1',
        context: options,
      }),
  }
}
