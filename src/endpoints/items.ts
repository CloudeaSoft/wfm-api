import type { WfmGet } from '../apis'
import { createV1ItemApis, createV2ItemApis } from '../apis'

export function createItemEndpoints(
  get: WfmGet,
): {
  getList: ReturnType<typeof createV2ItemApis>['getList']
  getStatistics: ReturnType<typeof createV1ItemApis>['getStatistics']
  getOrders: ReturnType<typeof createV2ItemApis>['getOrders']
} {
  const v1 = createV1ItemApis(get)
  const v2 = createV2ItemApis(get)

  return {
    getList: v2.getList,
    getStatistics: v1.getStatistics,
    getOrders: v2.getOrders,
  }
}
