import type { CallOptions } from './common'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer' | string
  expiresIn: number
}

export interface RefreshSessionBody {
  grantType: 'refresh_token'
  clientId: string
  deviceId: string
  refreshToken: string
}

export type RefreshSessionOptions = CallOptions & {
  /** Required for first-party clients; omit for third-party. */
  appCheckToken?: string
}
