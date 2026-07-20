import type { WfmFetcher, WfmPlugin } from '../src'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createWfmApiClient,
  memoryCachePlugin,
  rateLimitPlugin,
  WfmApiError,
} from '../src'
import { createRequest } from '../src/transport'

function jsonFetcher(
  handler: (input: {
    url: string
    method?: string
    headers?: Record<string, string>
    body?: BodyInit | null
  }) => unknown,
): WfmFetcher {
  return async (input) => {
    const payload = handler(input)
    return {
      status: 200,
      ok: true,
      json: async () => payload,
      text: async () => JSON.stringify(payload),
    }
  }
}

function okEnvelope(data: unknown) {
  return { apiVersion: '0.25.0', data, error: null }
}

describe('request plugins', () => {
  it('keeps success and error paths when plugins are omitted', async () => {
    const successClient = createWfmApiClient({
      fetcher: jsonFetcher(() => okEnvelope([{ id: '1', slug: 'forma' }])),
    })
    await expect(successClient.items.list()).resolves.toEqual([
      { id: '1', slug: 'forma' },
    ])

    const errorClient = createWfmApiClient({
      fetcher: jsonFetcher(() => ({
        apiVersion: '0.25.0',
        data: null,
        error: { request: ['app.errors.unauthorized'] },
      })),
    })
    await expect(errorClient.items.list()).rejects.toBeInstanceOf(WfmApiError)
  })

  it('keeps success and error paths when plugins is empty', async () => {
    const client = createWfmApiClient({
      plugins: [],
      fetcher: jsonFetcher(() => okEnvelope([{ id: '1' }])),
    })
    await expect(client.items.list()).resolves.toEqual([{ id: '1' }])
  })

  it('runs outer plugin wrap before inner (array order = outer → inner)', async () => {
    const order: string[] = []

    const outer: WfmPlugin = {
      wrap: next => async (ctx) => {
        order.push('outer:before')
        const result = await next(ctx)
        order.push('outer:after')
        return result
      },
    }

    const inner: WfmPlugin = {
      wrap: next => async (ctx) => {
        order.push('inner:before')
        const result = await next(ctx)
        order.push('inner:after')
        return result
      },
    }

    const request = createRequest({
      fetcher: jsonFetcher(() => {
        order.push('fetcher')
        return okEnvelope(true)
      }),
      getDefaults: () => ({}),
      plugins: [outer, inner],
    })

    await request('https://example.test/items')
    expect(order).toEqual([
      'outer:before',
      'inner:before',
      'fetcher',
      'inner:after',
      'outer:after',
    ])
  })
})

describe('memoryCachePlugin', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('short-circuits identical successful GET requests without calling fetcher again', async () => {
    const fetcher = vi.fn(jsonFetcher(() => okEnvelope({ hit: 1 })))
    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
      plugins: [memoryCachePlugin({ ttl: 60 })],
    })

    await expect(request('https://example.test/items')).resolves.toEqual({ hit: 1 })
    await expect(request('https://example.test/items')).resolves.toEqual({ hit: 1 })
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('does not cache failed requests so the next call retries', async () => {
    let calls = 0
    const fetcher: WfmFetcher = async () => {
      calls += 1
      if (calls === 1) {
        return {
          status: 500,
          ok: false,
          json: async () => ({ apiVersion: '0.25.0', data: null, error: null }),
          text: async () => '',
        }
      }
      return {
        status: 200,
        ok: true,
        json: async () => okEnvelope({ ok: true }),
        text: async () => '',
      }
    }

    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
      plugins: [memoryCachePlugin({ ttl: 60 })],
    })

    await expect(request('https://example.test/items')).rejects.toBeInstanceOf(WfmApiError)
    await expect(request('https://example.test/items')).resolves.toEqual({ ok: true })
    expect(calls).toBe(2)
  })

  it('includes query string in the cache key', async () => {
    const fetcher = vi.fn(jsonFetcher(() => okEnvelope({ n: 1 })))
    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
      plugins: [memoryCachePlugin({ ttl: 60 })],
    })

    await request('https://example.test/items', { query: { page: 1 } })
    await request('https://example.test/items', { query: { page: 2 } })
    expect(fetcher).toHaveBeenCalledTimes(2)

    await request('https://example.test/items', { query: { page: 1 } })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('separates cache entries by language and platform from effective context', async () => {
    const fetcher = vi.fn(jsonFetcher(() => okEnvelope({ n: 1 })))
    const request = createRequest({
      fetcher,
      getDefaults: () => ({ language: 'en', platform: 'pc' }),
      plugins: [memoryCachePlugin({ ttl: 60 })],
    })

    await request('https://example.test/items')
    await request('https://example.test/items', {
      context: { language: 'zh-hans' },
    })
    expect(fetcher).toHaveBeenCalledTimes(2)

    await request('https://example.test/items')
    expect(fetcher).toHaveBeenCalledTimes(2)

    await request('https://example.test/items', {
      context: { platform: 'ps4' },
    })
    expect(fetcher).toHaveBeenCalledTimes(3)
  })

  it('does not cache non-GET requests', async () => {
    const fetcher = vi.fn(jsonFetcher(() => okEnvelope({ ok: true })))
    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
      plugins: [memoryCachePlugin({ ttl: 60 })],
    })

    await request('https://example.test/items', {
      method: 'POST',
      body: { a: 1 },
    })
    await request('https://example.test/items', {
      method: 'POST',
      body: { a: 1 },
    })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('expires entries after ttl', async () => {
    vi.useFakeTimers()
    const fetcher = vi.fn(jsonFetcher(() => okEnvelope({ hit: 1 })))
    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
      plugins: [memoryCachePlugin({ ttl: 60 })],
    })

    await request('https://example.test/items')
    expect(fetcher).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(60_000)
    await request('https://example.test/items')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})

describe('rateLimitPlugin', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('spaces consecutive requests by minTime', async () => {
    vi.useFakeTimers()
    const startedAt: number[] = []
    const fetcher: WfmFetcher = async () => {
      startedAt.push(Date.now())
      return {
        status: 200,
        ok: true,
        json: async () => okEnvelope(true),
        text: async () => '',
      }
    }

    const request = createRequest({
      fetcher,
      getDefaults: () => ({}),
      plugins: [rateLimitPlugin({ minTime: 500 })],
    })

    const first = request('https://example.test/a')
    const second = request('https://example.test/b')

    await vi.advanceTimersByTimeAsync(0)
    await first
    expect(startedAt).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(499)
    expect(startedAt).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(1)
    await second
    expect(startedAt).toHaveLength(2)
    expect(startedAt[1]! - startedAt[0]!).toBeGreaterThanOrEqual(500)
  })
})
