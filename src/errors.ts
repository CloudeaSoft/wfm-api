export interface WfmApiErrorBody {
  request?: string[]
  inputs?: Record<string, string>
}

export class WfmApiError extends Error {
  readonly status?: number
  readonly url: string
  readonly error?: WfmApiErrorBody
  override readonly cause?: unknown

  constructor(
    message: string,
    options: {
      status?: number
      url: string
      error?: WfmApiErrorBody
      cause?: unknown
    },
  ) {
    super(message)
    this.name = 'WfmApiError'
    this.status = options.status
    this.url = options.url
    this.error = options.error
    this.cause = options.cause
  }
}
