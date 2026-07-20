import { describe, expect, it } from 'vitest'
import { WfmApiError } from '../src/errors'

describe('wfmApiError', () => {
  it('sets name, message, and metadata', () => {
    const cause = new Error('boom')
    const error = new WfmApiError('failed', {
      status: 401,
      url: 'https://api.warframe.market/v2/me',
      error: {
        request: ['app.errors.unauthorized'],
        inputs: { platinum: 'app.field.tooSmall' },
      },
      cause,
    })

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(WfmApiError)
    expect(error.name).toBe('WfmApiError')
    expect(error.message).toBe('failed')
    expect(error.status).toBe(401)
    expect(error.url).toBe('https://api.warframe.market/v2/me')
    expect(error.error).toEqual({
      request: ['app.errors.unauthorized'],
      inputs: { platinum: 'app.field.tooSmall' },
    })
    expect(error.cause).toBe(cause)
  })

  it('allows status and error body to be omitted', () => {
    const error = new WfmApiError('missing token', {
      url: 'https://api.warframe.market/v2/orders/my',
    })

    expect(error.status).toBeUndefined()
    expect(error.error).toBeUndefined()
    expect(error.cause).toBeUndefined()
  })
})
