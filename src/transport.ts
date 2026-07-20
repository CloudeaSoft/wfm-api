import type {
  CallOptions,
  RequestContext,
  WfmApiClientOptions,
  WfmFetcher,
  WfmFetchInput,
  WfmFetchResult,
  WfmRequest,
  WfmRequestInit,
  WFMResponse,
  WFMResponseV1,
} from './types'
import { WfmApiError } from './errors'

const DEFAULT_TIMEOUT_MS = 10_000

export function createDefaultFetcher(timeoutMs = DEFAULT_TIMEOUT_MS): WfmFetcher {
  return async (input: WfmFetchInput): Promise<WfmFetchResult> => {
    const response = await fetch(input.url, {
      method: input.method,
      headers: input.headers,
      body: input.body,
      signal: input.signal ?? AbortSignal.timeout(timeoutMs),
    })

    return {
      status: response.status,
      ok: response.ok,
      json: async () => response.json() as Promise<unknown>,
      text: async () => response.text(),
    }
  }
}

export function mergeContext(
  defaults: RequestContext,
  override?: CallOptions,
): RequestContext {
  return {
    accessToken: override?.accessToken ?? defaults.accessToken,
    language: override?.language ?? defaults.language,
    platform: override?.platform ?? defaults.platform,
    crossplay: override?.crossplay ?? defaults.crossplay,
  }
}

export function createRequest(options: {
  fetcher: WfmFetcher
  getDefaults: () => RequestContext
}): WfmRequest {
  const { fetcher, getDefaults } = options

  return async <T>(url: string, init: WfmRequestInit = {}): Promise<T> => {
    const context = mergeContext(getDefaults(), init.context)
    const envelope = init.envelope ?? 'v2'

    if (init.auth && !context.accessToken) {
      throw new WfmApiError('Missing access token for authenticated request', {
        url,
      })
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    if (context.language)
      headers.Language = context.language
    if (context.platform)
      headers.Platform = context.platform
    if (context.crossplay != null)
      headers.Crossplay = String(context.crossplay)
    if (context.accessToken)
      headers.Authorization = `Bearer ${context.accessToken}`

    let body: BodyInit | null | undefined
    if (init.formData) {
      body = init.formData
    }
    else if (init.body !== undefined) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(init.body)
    }

    const finalUrl = appendQuery(url, init.query)

    let result: WfmFetchResult
    try {
      result = await fetcher({
        url: finalUrl,
        method: init.method ?? 'GET',
        headers,
        body,
      })
    }
    catch (cause) {
      throw new WfmApiError('Network request failed', {
        url: finalUrl,
        cause,
      })
    }

    if (result.status === 204) {
      return undefined as T
    }

    let payload: unknown
    try {
      payload = await result.json()
    }
    catch (cause) {
      if (!result.ok) {
        throw new WfmApiError(`HTTP ${result.status}`, {
          status: result.status,
          url: finalUrl,
          cause,
        })
      }
      throw new WfmApiError('Failed to parse JSON response', {
        status: result.status,
        url: finalUrl,
        cause,
      })
    }

    if (envelope === 'none') {
      if (!result.ok) {
        throw new WfmApiError(`HTTP ${result.status}`, {
          status: result.status,
          url: finalUrl,
        })
      }
      return payload as T
    }

    if (envelope === 'v1') {
      if (!result.ok) {
        throw new WfmApiError(`HTTP ${result.status}`, {
          status: result.status,
          url: finalUrl,
        })
      }
      const v1 = payload as WFMResponseV1<T>
      return v1.payload
    }

    const v2 = payload as WFMResponse<T>
    if (v2.error) {
      throw new WfmApiError(v2.error.request?.[0] ?? `HTTP ${result.status}`, {
        status: result.status,
        url: finalUrl,
        error: v2.error,
      })
    }

    if (!result.ok) {
      throw new WfmApiError(`HTTP ${result.status}`, {
        status: result.status,
        url: finalUrl,
        error: v2.error ?? undefined,
      })
    }

    return v2.data
  }
}

function appendQuery(
  url: string,
  query?: WfmRequestInit['query'],
): string {
  if (!query)
    return url

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null)
      continue
    if (typeof value === 'boolean') {
      if (value)
        params.append(key, 'true')
      continue
    }
    params.append(key, String(value))
  }

  const qs = params.toString()
  if (!qs)
    return url
  return url.includes('?') ? `${url}&${qs}` : `${url}?${qs}`
}

export type { WfmApiClientOptions }
