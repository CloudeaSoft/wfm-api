import type { WfmRequest } from '../apis'
import { createV1RivenApis, createV2RivenApis } from '../apis'

export function createRivenEndpoints(
  request: WfmRequest,
): ReturnType<typeof createV2RivenApis> & ReturnType<typeof createV1RivenApis> {
  const v1 = createV1RivenApis(request)
  const v2 = createV2RivenApis(request)
  return {
    listWeapons: v2.listWeapons,
    getWeapon: v2.getWeapon,
    listAttributes: v2.listAttributes,
    getOrders: v1.getOrders,
  }
}
