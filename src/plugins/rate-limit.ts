import type { WfmPlugin, WfmRequestNext } from '../types'

export interface RateLimitPluginOptions {
  /** Minimum milliseconds between scheduled request starts. Default: 500. */
  minTime?: number
}

function createMinTimeSchedule(minTime: number) {
  let tail: Promise<unknown> = Promise.resolve()
  let lastStart = 0

  return async <T>(fn: () => Promise<T>): Promise<T> => {
    const run = async (): Promise<T> => {
      const wait = Math.max(0, lastStart + minTime - Date.now())
      if (wait > 0)
        await new Promise<void>(resolve => setTimeout(resolve, wait))
      lastStart = Date.now()
      return fn()
    }

    const result = tail.then(run, run)
    tail = result.then(() => undefined, () => undefined)
    return result
  }
}

export function rateLimitPlugin(options: RateLimitPluginOptions = {}): WfmPlugin {
  const schedule = createMinTimeSchedule(options.minTime ?? 500)

  return {
    wrap: (next: WfmRequestNext): WfmRequestNext => {
      return async ctx => schedule(async () => next(ctx))
    },
  }
}
