import type {
  AuthTokens,
  CallOptions,
  RefreshSessionBody,
  RefreshSessionOptions,
  WfmRequest,
} from '../types'
import { WFM_API_AUTH } from './http'

export function createAuthApis(
  request: WfmRequest,
  hooks?: {
    onTokens?: (tokens: AuthTokens) => void
    onSignOut?: () => void
  },
): {
  refresh: (
    body: RefreshSessionBody,
    options?: RefreshSessionOptions,
  ) => Promise<AuthTokens>
  signOut: (options?: CallOptions) => Promise<void>
} {
  return {
    refresh: async (body, options) => {
      const { appCheckToken, ...context } = options ?? {}
      const tokens = await request<AuthTokens>(`${WFM_API_AUTH}refresh`, {
        method: 'POST',
        body,
        omitAuthorization: true,
        appCheckToken,
        context,
      })
      hooks?.onTokens?.(tokens)
      return tokens
    },
    signOut: async (options) => {
      await request<void>(`${WFM_API_AUTH}signout`, {
        method: 'POST',
        auth: true,
        envelope: 'empty',
        context: options,
      })
      hooks?.onSignOut?.()
    },
  }
}
