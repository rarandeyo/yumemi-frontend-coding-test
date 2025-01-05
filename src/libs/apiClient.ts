import { hc } from 'hono/client'

import type { AppType } from '@/app/api/[[...route]]/route'
import { BASE_URL } from '@/config/envNextjsBaseUrl'

export const apiClient = hc<AppType>(BASE_URL)
