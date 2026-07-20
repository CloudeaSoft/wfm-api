import type { CallOptions, Ducatnator, WfmRequest } from '../../types'
import { WFM_API_V1 } from '../http'

export function createV1ToolApis(request: WfmRequest): {
  getDucatnator: (options?: CallOptions) => Promise<{
    day: Ducatnator[]
    hour: Ducatnator[]
  }>
} {
  return {
    getDucatnator: async (options) => {
      const payload = await request<{
        previous_day: Ducatnator[]
        previous_hour: Ducatnator[]
      }>(`${WFM_API_V1}tools/ducats`, {
        envelope: 'v1',
        context: options,
      })

      return {
        day: payload.previous_day,
        hour: payload.previous_hour,
      }
    },
  }
}
