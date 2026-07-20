import type { WfmGet } from '../apis'
import { createV1RivenApis, createV2RivenApis } from '../apis'

export function createRivenEndpoints(
  get: WfmGet,
): {
  getItems: ReturnType<typeof createV2RivenApis>['getItems']
  getOrders: ReturnType<typeof createV1RivenApis>['getOrders']
  getAttributes: ReturnType<typeof createV2RivenApis>['getAttributes']
} {
  const v1 = createV1RivenApis(get)
  const v2 = createV2RivenApis(get)

  return {
    getItems: v2.getItems,
    getOrders: v1.getOrders,
    getAttributes: v2.getAttributes,
  }
}
