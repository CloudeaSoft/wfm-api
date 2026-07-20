import type { WfmFetcher } from '../src'
import { describe, expect, it } from 'vitest'
import { createWfmApiClient, WfmApiError } from '../src'

function jsonFetcher(
  handler: (input: { url: string, method?: string, headers?: Record<string, string>, body?: BodyInit | null }) => unknown,
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

describe('createWfmApiClient', () => {
  it('lists items from v2 envelope', async () => {
    const calls: string[] = []
    const client = createWfmApiClient({
      language: 'zh-hans',
      fetcher: jsonFetcher(({ url, headers }) => {
        calls.push(url)
        expect(headers?.Language).toBe('zh-hans')
        return { apiVersion: '0.25.0', data: [{ id: '1', slug: 'forma' }], error: null }
      }),
    })

    const items = await client.items.list()
    expect(calls[0]).toContain('/v2/items')
    expect(items).toEqual([{ id: '1', slug: 'forma' }])
  })

  it('throws WfmApiError on envelope error', async () => {
    const client = createWfmApiClient({
      fetcher: jsonFetcher(() => ({
        apiVersion: '0.25.0',
        data: null,
        error: { request: ['app.errors.unauthorized'] },
      })),
    })

    await expect(client.items.list()).rejects.toBeInstanceOf(WfmApiError)
  })

  it('requires access token for authenticated routes', async () => {
    const client = createWfmApiClient({
      fetcher: jsonFetcher(() => ({ apiVersion: '0.25.0', data: [], error: null })),
    })

    await expect(client.orders.listMine()).rejects.toThrow(/access token/i)
  })

  it('creates an order with bearer token', async () => {
    const client = createWfmApiClient({
      accessToken: 'token-1',
      fetcher: jsonFetcher(({ method, headers, body }) => {
        expect(method).toBe('POST')
        expect(headers?.Authorization).toBe('Bearer token-1')
        expect(JSON.parse(String(body))).toMatchObject({ itemId: 'abc', type: 'sell' })
        return {
          apiVersion: '0.25.0',
          data: { id: 'order-1', type: 'sell', platinum: 10, quantity: 1, visible: true, createdAt: '', updatedAt: '' },
          error: null,
        }
      }),
    })

    const order = await client.orders.create({
      itemId: 'abc',
      type: 'sell',
      platinum: 10,
      quantity: 1,
    })
    expect(order.id).toBe('order-1')
  })

  it('allows per-call token override', async () => {
    const client = createWfmApiClient({
      accessToken: 'default',
      fetcher: jsonFetcher(({ headers }) => {
        expect(headers?.Authorization).toBe('Bearer override')
        return {
          apiVersion: '0.25.0',
          data: {
            id: 'me',
            role: 'user',
            tier: 'none',
            subscription: false,
            ingameName: 'x',
            slug: 'x',
            about: '',
            aboutRaw: '',
            reputation: 0,
            masteryRank: 0,
            credits: 0,
            lastSeen: '',
            platform: 'pc',
            crossplay: false,
            locale: 'en',
            theme: 'dark',
            syncLocale: false,
            syncTheme: false,
            verification: false,
            checkCode: '',
            unreadNotifications: 0,
            linkedAccounts: {},
          },
          error: null,
        }
      }),
    })

    await client.users.getMe({ accessToken: 'override' })
  })

  it('unwraps v1 payload for statistics by slug', async () => {
    const calls: string[] = []
    const client = createWfmApiClient({
      fetcher: jsonFetcher(({ url }) => {
        calls.push(url)
        return {
          payload: {
            statistics_closed: { '48hours': [], '90days': [] },
            statistics_live: { '48hours': [], '90days': [] },
          },
        }
      }),
    })

    const stats = await client.items.getStatistics('sicarus_prime_receiver')
    expect(calls[0]).toContain('/v1/items/sicarus_prime_receiver/statistics')
    expect(stats.statistics_closed['48hours']).toEqual([])
  })
})
