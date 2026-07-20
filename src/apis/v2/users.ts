import type {
  CallOptions,
  UpdateMeBody,
  UploadBody,
  User,
  UserPrivate,
  UserRef,
  WfmRequest,
} from '../../types'
import { userPath, WFM_API_V2 } from '../http'

export function createV2UserApis(request: WfmRequest): {
  getMe: (options?: CallOptions) => Promise<UserPrivate>
  updateMe: (body: UpdateMeBody, options?: CallOptions) => Promise<UserPrivate>
  uploadAvatar: (
    file: UploadBody,
    filename?: string,
    options?: CallOptions,
  ) => Promise<UserPrivate>
  uploadBackground: (
    file: UploadBody,
    filename?: string,
    options?: CallOptions,
  ) => Promise<UserPrivate>
  get: (ref: UserRef, options?: CallOptions) => Promise<User>
} {
  return {
    getMe: async options =>
      request(`${WFM_API_V2}me`, {
        auth: true,
        context: options,
      }),
    updateMe: async (body, options) =>
      request(`${WFM_API_V2}me`, {
        method: 'PATCH',
        body,
        auth: true,
        context: options,
      }),
    uploadAvatar: async (file, filename = 'avatar.png', options) => {
      const formData = new FormData()
      formData.append('avatar', toBlob(file), filename)
      return request(`${WFM_API_V2}me/avatar`, {
        method: 'POST',
        formData,
        auth: true,
        context: options,
      })
    },
    uploadBackground: async (file, filename = 'background.png', options) => {
      const formData = new FormData()
      formData.append('background', toBlob(file), filename)
      return request(`${WFM_API_V2}me/background`, {
        method: 'POST',
        formData,
        auth: true,
        context: options,
      })
    },
    get: async (ref, options) =>
      request(userPath(ref), { context: options }),
  }
}

function toBlob(file: UploadBody): Blob {
  if (file instanceof Blob)
    return file
  if (file instanceof ArrayBuffer)
    return new Blob([file])

  const copy = new Uint8Array(file.byteLength)
  copy.set(file)
  return new Blob([copy])
}
