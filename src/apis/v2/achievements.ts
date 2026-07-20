import type {
  Achievement,
  CallOptions,
  UserRef,
  WfmRequest,
} from '../../types'
import { achievementsUserPath, WFM_API_V2 } from '../http'

export function createV2AchievementApis(request: WfmRequest): {
  list: (options?: CallOptions) => Promise<Achievement[]>
  listByUser: (
    ref: UserRef,
    query?: { featured?: boolean },
    options?: CallOptions,
  ) => Promise<Achievement[]>
} {
  return {
    list: async options =>
      request(`${WFM_API_V2}achievements`, { context: options }),
    listByUser: async (ref, query, options) =>
      request(achievementsUserPath(ref), {
        query: query?.featured ? { featured: true } : undefined,
        context: options,
      }),
  }
}
