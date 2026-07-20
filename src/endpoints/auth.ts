import type { WfmRequest } from '../apis'
import type { AuthTokens } from '../types'
import { createAuthApis } from '../apis'

export function createAuthEndpoints(
  request: WfmRequest,
  hooks?: {
    onTokens?: (tokens: AuthTokens) => void
    onSignOut?: () => void
  },
): ReturnType<typeof createAuthApis> {
  return createAuthApis(request, hooks)
}
