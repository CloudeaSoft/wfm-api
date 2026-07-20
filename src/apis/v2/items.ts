import type {
  CallOptions,
  Item,
  ItemRef,
  ItemSet,
  WfmRequest,
} from '../../types'
import { itemPath, WFM_API_V2 } from '../http'

export function createV2ItemApis(request: WfmRequest): {
  list: (options?: CallOptions) => Promise<Item[]>
  get: (ref: ItemRef, options?: CallOptions) => Promise<Item>
  getSet: (ref: ItemRef, options?: CallOptions) => Promise<ItemSet>
} {
  return {
    list: async options =>
      request(`${WFM_API_V2}items`, { context: options }),
    get: async (ref, options) =>
      request(itemPath(ref), { context: options }),
    getSet: async (ref, options) =>
      request(itemPath(ref, '/set'), { context: options }),
  }
}
