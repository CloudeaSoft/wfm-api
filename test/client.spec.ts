import type { WfmFetcher } from '../src'
import { describe, expect, it } from 'vitest'
import { createWfmApiClient } from '../src'

describe('createWfmApiClient', () => {
  it('returns payload data from fetcher', async () => {
    const calls: string[] = []
    const fetcher: WfmFetcher = async <T>(url: string): Promise<T> => {
      calls.push(url)
      if (url.endsWith('/v2/items')) {
        return { data: [{ id: '1', urlName: 'forma' }] } as T
      }
      throw new Error(`unexpected url: ${url}`)
    }

    const client = createWfmApiClient({ fetcher })
    const items = await client.items.getList()

    expect(calls).toHaveLength(1)
    expect(items).toEqual([{ id: '1', urlName: 'forma' }])
  })

  it('returns undefined when fetcher throws', async () => {
    const client = createWfmApiClient({
      fetcher: async () => {
        throw new Error('network')
      },
    })

    await expect(client.items.getList()).resolves.toBeUndefined()
  })
})
