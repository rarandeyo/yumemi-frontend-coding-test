import type { AppType } from '@/app/api/[[...route]]/route'
import { apiClient } from '@/libs/apiClient'
import { hc } from 'hono/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('apiClient', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('正常系', () => {
    it('apiClientが正しく初期化されること', () => {
      expect(apiClient).toBeDefined()
      expect(apiClient.api).toBeDefined()
      expect(apiClient.api.population).toBeDefined()
    })

    it('BASE_URLが正しく設定されていること', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
      const newApiClient = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL)
      expect(newApiClient.api.population.$url().toString()).toBe(
        'https://example.com/api/population',
      )
    })
  })
})
