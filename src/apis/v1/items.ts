import type { CallOptions, StatisticsCollection, WfmRequest } from '../../types'
import { WFM_API_V1 } from '../http'

export function createV1ItemApis(request: WfmRequest): {
  getStatistics: (slug: string, options?: CallOptions) => Promise<StatisticsCollection>
} {
  return {
    getStatistics: async (slug, options) =>
      request(`${WFM_API_V1}items/${encodeURIComponent(slug)}/statistics`, {
        envelope: 'v1',
        context: options,
      }),
  }
}
