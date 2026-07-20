import type { WfmRequest } from '../apis'
import { createV2AchievementApis } from '../apis'

export function createAchievementEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2AchievementApis> {
  return createV2AchievementApis(request)
}
