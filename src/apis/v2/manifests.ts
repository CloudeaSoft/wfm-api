import type {
  CallOptions,
  Location,
  Mission,
  Npc,
  Versions,
  WfmRequest,
} from '../../types'
import { WFM_API_V2 } from '../http'

export function createV2ManifestApis(request: WfmRequest): {
  getVersions: (options?: CallOptions) => Promise<Versions>
  listLocations: (options?: CallOptions) => Promise<Location[]>
  listNpcs: (options?: CallOptions) => Promise<Npc[]>
  listMissions: (options?: CallOptions) => Promise<Mission[]>
} {
  return {
    getVersions: async options =>
      request(`${WFM_API_V2}versions`, { context: options }),
    listLocations: async options =>
      request(`${WFM_API_V2}locations`, { context: options }),
    listNpcs: async options =>
      request(`${WFM_API_V2}npcs`, { context: options }),
    listMissions: async options =>
      request(`${WFM_API_V2}missions`, { context: options }),
  }
}
