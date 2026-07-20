import type {
  CallOptions,
  LichEphemera,
  LichQuirk,
  LichWeapon,
  WfmRequest,
} from '../../types'
import { WFM_API_V2 } from '../http'

export function createV2LichApis(request: WfmRequest): {
  listWeapons: (options?: CallOptions) => Promise<LichWeapon[]>
  getWeapon: (slug: string, options?: CallOptions) => Promise<LichWeapon>
  listEphemeras: (options?: CallOptions) => Promise<LichEphemera[]>
  listQuirks: (options?: CallOptions) => Promise<LichQuirk[]>
} {
  return {
    listWeapons: async options =>
      request(`${WFM_API_V2}lich/weapons`, { context: options }),
    getWeapon: async (slug, options) =>
      request(`${WFM_API_V2}lich/weapon/${encodeURIComponent(slug)}`, {
        context: options,
      }),
    listEphemeras: async options =>
      request(`${WFM_API_V2}lich/ephemeras`, { context: options }),
    listQuirks: async options =>
      request(`${WFM_API_V2}lich/quirks`, { context: options }),
  }
}
