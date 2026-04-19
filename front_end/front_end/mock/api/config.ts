import { defineFakeRoute } from 'vite-plugin-fake-server/client'

import {
  configVerdicts,
  configTags,
  configDifficulties,
  configUserLangs,
  configCodeLangs,
} from '../data'
import type { SyncConfigResponse } from '../interface'

export default defineFakeRoute([
  {
    url: '/api/sync-config',
    method: 'get',
    response: () => {
      const response: SyncConfigResponse = {
        difficulties: configDifficulties,
        userLangs: configUserLangs,
        codeLangs: configCodeLangs,
        tags: configTags,
        verdicts: configVerdicts,
      }
      return response
    },
  },
])
