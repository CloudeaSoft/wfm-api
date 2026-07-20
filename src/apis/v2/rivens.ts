import type { RivenAttribute, RivenItem, WFMResponse } from '../../types'
import type { WfmGet } from '../http'
import { WFM_API_V2 } from '../http'

export function createV2RivenApis(get: WfmGet): {
  getItems: () => Promise<RivenItem[] | undefined>
  getAttributes: () => Promise<RivenAttribute[] | undefined>
} {
  return {
    getItems: async () => {
      const response = await get<WFMResponse<RivenItem[]>>(
        `${WFM_API_V2}riven/weapons`,
      )
      return response?.data
    },
    getAttributes: async () => {
      const response = await get<WFMResponse<RivenAttribute[]>>(
        `${WFM_API_V2}riven/attributes`,
      )
      return response?.data
    },
  }
}
