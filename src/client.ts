import type { WfmApiClientOptions } from './types'
import { createItemEndpoints, createRivenEndpoints, createToolEndpoints } from './endpoints'
import { defaultFetcher } from './transport'

export function createWfmApiClient(
  options: WfmApiClientOptions = {},
): {
  items: ReturnType<typeof createItemEndpoints>
  rivens: ReturnType<typeof createRivenEndpoints>
  tools: ReturnType<typeof createToolEndpoints>
} {
  const fetcher = options.fetcher ?? defaultFetcher

  async function get<T>(url: string): Promise<T | undefined> {
    try {
      return await fetcher<T>(url)
    }
    catch {
      return undefined
    }
  }

  return {
    items: createItemEndpoints(get),
    rivens: createRivenEndpoints(get),
    tools: createToolEndpoints(get),
  }
}

export type WfmApiClient = ReturnType<typeof createWfmApiClient>
