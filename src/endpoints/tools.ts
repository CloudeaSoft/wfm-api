import type { WfmGet } from '../apis'
import { createV1ToolApis } from '../apis'

export function createToolEndpoints(
  get: WfmGet,
): ReturnType<typeof createV1ToolApis> {
  return createV1ToolApis(get)
}
