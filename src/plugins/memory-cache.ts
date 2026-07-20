import type { WfmPlugin, WfmRequestContext, WfmRequestNext } from '../types'

export interface MemoryCachePluginOptions {
  /** Max cached entries. Default: 1024. */
  maxSize?: number
  /** TTL in seconds. Default: 60. */
  ttl?: number
  /** Override cache key. Default includes method, url, language, platform, crossplay. */
  keyFor?: (ctx: WfmRequestContext) => string
}

interface CacheEntry {
  expiresAt: number
  value?: unknown
  promise?: Promise<unknown>
}

function defaultKeyFor(ctx: WfmRequestContext): string {
  const method = ctx.init.method ?? 'GET'
  const { language, platform, crossplay } = ctx.context
  return [
    method,
    ctx.url,
    `lang=${language ?? ''}`,
    `platform=${platform ?? ''}`,
    `crossplay=${crossplay ?? ''}`,
  ].join(' ')
}

function isCacheable(ctx: WfmRequestContext): boolean {
  const method = ctx.init.method ?? 'GET'
  return method === 'GET'
}

export function memoryCachePlugin(options: MemoryCachePluginOptions = {}): WfmPlugin {
  const maxSize = options.maxSize ?? 1024
  const ttlSeconds = options.ttl ?? 60
  const keyFor = options.keyFor ?? defaultKeyFor
  const cache = new Map<string, CacheEntry>()

  function touch(key: string, entry: CacheEntry): void {
    cache.delete(key)
    cache.set(key, entry)
  }

  function trim(): void {
    while (cache.size > maxSize) {
      const oldest = cache.keys().next().value
      if (oldest === undefined)
        break
      cache.delete(oldest)
    }
  }

  return {
    wrap: (next: WfmRequestNext): WfmRequestNext => {
      return async (ctx) => {
        if (!isCacheable(ctx))
          return next(ctx)

        const key = keyFor(ctx)
        const existing = cache.get(key)

        if (existing) {
          if (existing.promise)
            return existing.promise

          if (existing.expiresAt > Date.now()) {
            touch(key, existing)
            return existing.value
          }

          cache.delete(key)
        }

        const ttlMs = ttlSeconds * 1000
        const promise = next(ctx).then(
          (value) => {
            const entry: CacheEntry = {
              value,
              expiresAt: Date.now() + ttlMs,
            }
            touch(key, entry)
            trim()
            return value
          },
          (error) => {
            cache.delete(key)
            throw error
          },
        )

        cache.set(key, {
          promise,
          expiresAt: Number.POSITIVE_INFINITY,
        })
        trim()
        return promise
      }
    },
  }
}
