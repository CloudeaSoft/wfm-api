import type { WfmFetcher, WfmFetchResult } from '../src/types'
import { describe, expect, it, vi } from 'vitest'
import { WfmApiError } from '../src/errors'
import { createRequest, mergeContext } from '../src/transport'

function mockFetcher(
  impl: (input: Parameters<WfmFetcher>[0]) => Partial<WfmFetchResult> & {
    payload?: unknown
  },
): WfmFetcher {
  return async (input) => {
    const result = impl(input)
    const payload = 'payload' in result ? result.payload : { apiVersion: '0.25.0', data: null, error: null }
    return {
      status: result.status ?? 200,
      ok: result.ok ?? true,
      json: result.json ?? (async () => payload),
      text: result.text ?? (async () => JSON.stringify(payload)),
    }
  }
}

describe('mergeContext', () => {
  it('keeps defaults when override is omitted', () => {
    expect(mergeContext({
      accessToken: 't',
      language: 'en',
      platform: 'pc',
      crossplay: true,
    })).toEqual({
      accessToken: 't',
      language: 'en',
      platform: 'pc',
      crossplay: true,
    })
  })

  it('overrides only provided fields', () => {
    expect(mergeContext(
      {
        accessToken: 'default',
        language: 'en',
        platform: 'pc',
        crossplay: false,
      },
      {
        accessToken: 'override',
        language: 'zh-hans',
      },
    )).toEqual({
      accessToken: 'override',
      language: 'zh-hans',
      platform: 'pc',
      crossplay: false,
    })
  })
})

describe('createRequest', () => {
  it('sends merged headers, method, and json body', async () => {
    const fetcher = vi.fn(mockFetcher((input) => {
      expect(input.method).toBe('POST')
      expect(input.headers).toMatchObject({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Language': 'zh-hans',
        'Platform': 'pc',
        'Crossplay': 'true',
        'Authorization': 'Bearer token',
      })
      expect(input.body).toBe(JSON.stringify({ platinum: 10 }))
      return {
        payload: { apiVersion: '0.25.0', data: { ok: true }, error: null },
      }
    }))

    const request = createRequest({
      fetcher,
      getDefaults: () => ({
        accessToken: 'token',
        language: 'zh-hans',
        platform: 'pc',
        crossplay: true,
      }),
    })

    await expect(request('/v2/order', {
      method: 'POST',
      body: { platinum: 10 },
    })).resolves.toEqual({ ok: true })
  })

  it('appends query params and skips nullish or false booleans', async () => {
    const fetcher = vi.fn(mockFetcher((input) => {
      expect(input.url).toBe('https://example.test/items?rank=1&featured=true&name=forma')
      return {
        payload: { apiVersion: '0.25.0', data: [], error: null },
      }
    }))

    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
    })

    await request('https://example.test/items', {
      query: {
        rank: 1,
        featured: true,
        hidden: false,
        empty: undefined,
        missing: null,
        name: 'forma',
      },
    })
  })

  it('appends query to urls that already contain search params', async () => {
    const fetcher = vi.fn(mockFetcher((input) => {
      expect(input.url).toBe('https://example.test/search?type=riven&sort=asc')
      return {
        payload: { apiVersion: '0.25.0', data: [], error: null },
      }
    }))

    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
    })

    await request('https://example.test/search?type=riven', {
      query: { sort: 'asc' },
    })
  })

  it('throws when auth is required without access token', async () => {
    const request = createRequest({
      fetcher: mockFetcher(() => ({ payload: {} })),
      getDefaults: () => ({}),
    })

    await expect(request('/v2/me', { auth: true })).rejects.toMatchObject({
      message: 'Missing access token for authenticated request',
      url: '/v2/me',
    })
  })

  it('wraps network failures as WfmApiError', async () => {
    const request = createRequest({
      fetcher: async () => {
        throw new Error('offline')
      },
      getDefaults: () => ({}),
    })

    await expect(request('https://example.test')).rejects.toMatchObject({
      name: 'WfmApiError',
      message: 'Network request failed',
      url: 'https://example.test',
    })
  })

  it('returns undefined for 204 responses', async () => {
    const request = createRequest({
      fetcher: mockFetcher(() => ({
        status: 204,
        ok: true,
        json: async () => {
          throw new Error('no body')
        },
      })),
      getDefaults: () => ({}),
    })

    await expect(request('https://example.test')).resolves.toBeUndefined()
  })

  it('unwraps v1 payload envelope', async () => {
    const request = createRequest({
      fetcher: mockFetcher(() => ({
        payload: { payload: { value: 1 } },
      })),
      getDefaults: () => ({}),
    })

    await expect(request('https://example.test', { envelope: 'v1' }))
      .resolves
      .toEqual({ value: 1 })
  })

  it('returns raw payload for none envelope', async () => {
    const request = createRequest({
      fetcher: mockFetcher(() => ({
        payload: { hello: 'world' },
      })),
      getDefaults: () => ({}),
    })

    await expect(request('https://example.test', { envelope: 'none' }))
      .resolves
      .toEqual({ hello: 'world' })
  })

  it('throws on v2 envelope error', async () => {
    const request = createRequest({
      fetcher: mockFetcher(() => ({
        payload: {
          apiVersion: '0.25.0',
          data: null,
          error: { request: ['app.errors.forbidden'], inputs: { q: 'bad' } },
        },
      })),
      getDefaults: () => ({}),
    })

    await expect(request('https://example.test')).rejects.toBeInstanceOf(WfmApiError)
    await expect(request('https://example.test')).rejects.toMatchObject({
      message: 'app.errors.forbidden',
      error: {
        request: ['app.errors.forbidden'],
        inputs: { q: 'bad' },
      },
    })
  })

  it('throws on non-ok http status for v2', async () => {
    const request = createRequest({
      fetcher: mockFetcher(() => ({
        status: 500,
        ok: false,
        payload: { apiVersion: '0.25.0', data: null, error: null },
      })),
      getDefaults: () => ({}),
    })

    await expect(request('https://example.test')).rejects.toMatchObject({
      message: 'HTTP 500',
      status: 500,
    })
  })

  it('throws when json parsing fails on ok response', async () => {
    const request = createRequest({
      fetcher: mockFetcher(() => ({
        status: 200,
        ok: true,
        json: async () => {
          throw new Error('invalid json')
        },
      })),
      getDefaults: () => ({}),
    })

    await expect(request('https://example.test')).rejects.toMatchObject({
      message: 'Failed to parse JSON response',
      status: 200,
    })
  })

  it('passes formData without setting json content type', async () => {
    const formData = new FormData()
    formData.append('avatar', new Blob(['x']), 'a.png')

    const fetcher = vi.fn(mockFetcher((input) => {
      expect(input.body).toBe(formData)
      expect(input.headers?.['Content-Type']).toBeUndefined()
      return {
        payload: { apiVersion: '0.25.0', data: { id: 'me' }, error: null },
      }
    }))

    const request = createRequest({
      fetcher,
      getDefaults: () => ({ accessToken: 't' }),
    })

    await request('https://example.test/me/avatar', {
      method: 'POST',
      formData,
      auth: true,
    })
  })

  it('applies per-call context overrides', async () => {
    const fetcher = vi.fn(mockFetcher((input) => {
      expect(input.headers?.Authorization).toBe('Bearer call-token')
      expect(input.headers?.Language).toBe('ja')
      return {
        payload: { apiVersion: '0.25.0', data: true, error: null },
      }
    }))

    const request = createRequest({
      fetcher,
      getDefaults: () => ({
        accessToken: 'default',
        language: 'en',
      }),
    })

    await request('https://example.test', {
      context: {
        accessToken: 'call-token',
        language: 'ja',
      },
    })
  })
})
