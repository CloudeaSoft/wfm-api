import type {
  CallOptions,
  DashboardShowcase,
  WfmRequest,
} from '../../types'
import { WFM_API_V2 } from '../http'

export function createV2DashboardApis(request: WfmRequest): {
  getShowcase: (options?: CallOptions) => Promise<DashboardShowcase>
} {
  return {
    getShowcase: async options =>
      request(`${WFM_API_V2}dashboard/showcase`, { context: options }),
  }
}
