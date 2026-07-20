import type { WfmRequest } from '../apis'
import { createV2DashboardApis } from '../apis'

export function createDashboardEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2DashboardApis> {
  return createV2DashboardApis(request)
}
