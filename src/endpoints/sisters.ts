import type { WfmRequest } from '../apis'
import { createV2SisterApis } from '../apis'

export function createSisterEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2SisterApis> {
  return createV2SisterApis(request)
}
