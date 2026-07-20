import type {
  CallOptions,
  SisterEphemera,
  SisterQuirk,
  SisterWeapon,
  WfmRequest,
} from '../../types'
import { WFM_API_V2 } from '../http'

export function createV2SisterApis(request: WfmRequest): {
  listWeapons: (options?: CallOptions) => Promise<SisterWeapon[]>
  getWeapon: (slug: string, options?: CallOptions) => Promise<SisterWeapon>
  listEphemeras: (options?: CallOptions) => Promise<SisterEphemera[]>
  listQuirks: (options?: CallOptions) => Promise<SisterQuirk[]>
} {
  return {
    listWeapons: async options =>
      request(`${WFM_API_V2}sister/weapons`, { context: options }),
    getWeapon: async (slug, options) =>
      request(`${WFM_API_V2}sister/weapon/${encodeURIComponent(slug)}`, {
        context: options,
      }),
    listEphemeras: async options =>
      request(`${WFM_API_V2}sister/ephemeras`, { context: options }),
    listQuirks: async options =>
      request(`${WFM_API_V2}sister/quirks`, { context: options }),
  }
}
