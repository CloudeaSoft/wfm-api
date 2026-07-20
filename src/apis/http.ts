export const WFM_API_V1 = 'https://api.warframe.market/v1/'
export const WFM_API_V2 = 'https://api.warframe.market/v2/'

export type WfmGet = <T>(url: string) => Promise<T | undefined>
