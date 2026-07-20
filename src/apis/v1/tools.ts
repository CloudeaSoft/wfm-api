import type { Ducatnator, WFMResponseV1 } from '../../types'
import type { WfmGet } from '../http'
import { WFM_API_V1 } from '../http'

export function createV1ToolApis(get: WfmGet): {
  getDucatnator: () => Promise<
    | {
      day: Ducatnator[]
      hour: Ducatnator[]
    }
    | undefined
  >
} {
  return {
    getDucatnator: async () => {
      const response = await get<WFMResponseV1<{
        previous_day: Ducatnator[]
        previous_hour: Ducatnator[]
      }>>(
        `${WFM_API_V1}tools/ducats`,
      )

      if (!response?.payload)
        return undefined

      return {
        day: response.payload.previous_day,
        hour: response.payload.previous_hour,
      }
    },
  }
}
