import type { WfmRequest } from '../apis'
import { createV2UserApis } from '../apis'

export function createUserEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2UserApis> {
  return createV2UserApis(request)
}
