import type { WfmRequest } from '../apis'
import { createV2ManifestApis } from '../apis'

export function createManifestEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2ManifestApis> {
  return createV2ManifestApis(request)
}
