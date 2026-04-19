import type { SyncConfigResponse } from '@/interface'
import { apiFetchDefault } from '@/utils/ofetch'

export const syncConfig = async () => {
  return apiFetchDefault<SyncConfigResponse>('/sync-config')
}
