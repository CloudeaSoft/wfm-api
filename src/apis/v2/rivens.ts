import type {
  CallOptions,
  RivenAttribute,
  RivenItem,
  WfmRequest,
} from '../../types'
import { WFM_API_V2 } from '../http'

export function createV2RivenApis(request: WfmRequest): {
  listWeapons: (options?: CallOptions) => Promise<RivenItem[]>
  getWeapon: (slug: string, options?: CallOptions) => Promise<RivenItem>
  listAttributes: (options?: CallOptions) => Promise<RivenAttribute[]>
} {
  return {
    listWeapons: async options =>
      request(`${WFM_API_V2}riven/weapons`, { context: options }),
    getWeapon: async (slug, options) =>
      request(`${WFM_API_V2}riven/weapon/${encodeURIComponent(slug)}`, {
        context: options,
      }),
    listAttributes: async options =>
      request(`${WFM_API_V2}riven/attributes`, { context: options }),
  }
}
