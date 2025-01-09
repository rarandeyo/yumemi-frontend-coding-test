import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('BASE_URL', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('正常系', () => {
    it('NEXT_PUBLIC_BASE_URLが設定されている場合、その値を返却すること', async () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'

      const { BASE_URL } = await import('../envNextjsBaseUrl')
      expect(BASE_URL).toBe('https://example.com')
    })

    it('NEXT_PUBLIC_BASE_URLが未定義の場合、デフォルト値を返却すること', async () => {
      process.env.NEXT_PUBLIC_BASE_URL = undefined

      const { BASE_URL } = await import('../envNextjsBaseUrl')
      expect(BASE_URL).toBe('http://localhost:3000')
    })
  })
})
