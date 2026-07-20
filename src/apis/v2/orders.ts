import type {
  CallOptions,
  CloseOrderBody,
  CreateOrderBody,
  ItemRef,
  Order,
  TopOrders,
  TopOrdersQuery,
  Transaction,
  UpdateOrderBody,
  UpdateOrderGroupVisibilityBody,
  UserRef,
  WfmRequest,
} from '../../types'
import { ordersItemPath, ordersUserPath, WFM_API_V2 } from '../http'

export function createV2OrderApis(request: WfmRequest): {
  getRecent: (options?: CallOptions) => Promise<Order[]>
  listByItem: (ref: ItemRef, options?: CallOptions) => Promise<Order[]>
  getTopByItem: (
    ref: ItemRef,
    query?: TopOrdersQuery,
    options?: CallOptions,
  ) => Promise<TopOrders>
  listByUser: (ref: UserRef, options?: CallOptions) => Promise<Order[]>
  listMine: (options?: CallOptions) => Promise<Order[]>
  get: (id: string, options?: CallOptions) => Promise<Order>
  create: (body: CreateOrderBody, options?: CallOptions) => Promise<Order>
  update: (
    id: string,
    body: UpdateOrderBody,
    options?: CallOptions,
  ) => Promise<Order>
  delete: (id: string, options?: CallOptions) => Promise<Order>
  close: (
    id: string,
    body: CloseOrderBody,
    options?: CallOptions,
  ) => Promise<Transaction>
  updateGroupVisibility: (
    id: string,
    body: UpdateOrderGroupVisibilityBody,
    options?: CallOptions,
  ) => Promise<{ updated: number }>
} {
  return {
    getRecent: async options =>
      request(`${WFM_API_V2}orders/recent`, { context: options }),
    listByItem: async (ref, options) =>
      request(ordersItemPath(ref), { context: options }),
    getTopByItem: async (ref, query, options) =>
      request(ordersItemPath(ref, '/top'), {
        query: query as Record<string, string | number | boolean | undefined> | undefined,
        context: options,
      }),
    listByUser: async (ref, options) =>
      request(ordersUserPath(ref), { context: options }),
    listMine: async options =>
      request(`${WFM_API_V2}orders/my`, {
        auth: true,
        context: options,
      }),
    get: async (id, options) =>
      request(`${WFM_API_V2}order/${encodeURIComponent(id)}`, {
        context: options,
      }),
    create: async (body, options) =>
      request(`${WFM_API_V2}order`, {
        method: 'POST',
        body,
        auth: true,
        context: options,
      }),
    update: async (id, body, options) =>
      request(`${WFM_API_V2}order/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body,
        auth: true,
        context: options,
      }),
    delete: async (id, options) =>
      request(`${WFM_API_V2}order/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        auth: true,
        context: options,
      }),
    close: async (id, body, options) =>
      request(`${WFM_API_V2}order/${encodeURIComponent(id)}/close`, {
        method: 'POST',
        body,
        auth: true,
        context: options,
      }),
    updateGroupVisibility: async (id, body, options) =>
      request(`${WFM_API_V2}orders/group/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body,
        auth: true,
        context: options,
      }),
  }
}
