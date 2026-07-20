import type { WfmRequest } from '../apis'
import { createV2LichApis } from '../apis'

export function createLichEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2LichApis> {
  return createV2LichApis(request)
}
