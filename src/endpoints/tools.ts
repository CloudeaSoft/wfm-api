import type { WfmRequest } from '../apis'
import { createV1ToolApis } from '../apis'

export function createToolEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV1ToolApis> {
  return createV1ToolApis(request)
}
