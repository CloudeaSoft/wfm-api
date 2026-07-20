import type { WfmRequest } from '../apis'
import { createV2OrderApis } from '../apis'

export function createOrderEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2OrderApis> {
  return createV2OrderApis(request)
}
