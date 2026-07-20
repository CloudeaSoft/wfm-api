import { describe, expect, it } from 'vitest'
import {
  achievementsUserPath,
  itemPath,
  ordersItemPath,
  ordersUserPath,
  userPath,
  WFM_API_V1,
  WFM_API_V2,
  WFM_STATIC_ASSETS,
} from '../src/apis/http'

describe('api path helpers', () => {
  it('exposes base URLs', () => {
    expect(WFM_API_V1).toBe('https://api.warframe.market/v1/')
    expect(WFM_API_V2).toBe('https://api.warframe.market/v2/')
    expect(WFM_STATIC_ASSETS).toBe('https://warframe.market/static/assets/')
  })

  it('builds item paths from slug or itemId', () => {
    expect(itemPath({ slug: 'forma' })).toBe(`${WFM_API_V2}item/forma`)
    expect(itemPath({ itemId: 'abc' }, '/set')).toBe(`${WFM_API_V2}itemId/abc/set`)
    expect(itemPath({ slug: 'a/b' })).toBe(`${WFM_API_V2}item/a%2Fb`)
  })

  it('builds orders item paths from slug or itemId', () => {
    expect(ordersItemPath({ slug: 'forma' })).toBe(`${WFM_API_V2}orders/item/forma`)
    expect(ordersItemPath({ itemId: 'abc' }, '/top')).toBe(
      `${WFM_API_V2}orders/itemId/abc/top`,
    )
  })

  it('builds orders user paths from slug or userId', () => {
    expect(ordersUserPath({ slug: 'player' })).toBe(
      `${WFM_API_V2}orders/user/player`,
    )
    expect(ordersUserPath({ userId: 'uid-1' })).toBe(
      `${WFM_API_V2}orders/userId/uid-1`,
    )
  })

  it('builds user and achievement user paths', () => {
    expect(userPath({ slug: 'player' })).toBe(`${WFM_API_V2}user/player`)
    expect(userPath({ userId: 'uid-1' })).toBe(`${WFM_API_V2}userId/uid-1`)
    expect(achievementsUserPath({ slug: 'player' })).toBe(
      `${WFM_API_V2}achievements/user/player`,
    )
    expect(achievementsUserPath({ userId: 'uid-1' })).toBe(
      `${WFM_API_V2}achievements/userId/uid-1`,
    )
  })
})
