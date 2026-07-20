import type { WfmFetcher } from './types'

export const defaultFetcher: WfmFetcher = async <T>(
  url: string,
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json,text/plain;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Language': 'zh-hans',
    },
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
