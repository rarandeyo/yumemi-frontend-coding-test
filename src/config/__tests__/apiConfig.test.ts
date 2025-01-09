import { getApiConfig } from '@/config/apiConfig'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => {
  return {
    default: undefined,
  }
})

describe('getApiConfig', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('正常系', () => {
    it('環境変数が正しく設定されている場合、設定値を返却すること', () => {
      process.env.YUMEMI_BASE_URL = 'https://api.example.com'
      process.env.YUMEMI_API_KEY = 'test-api-key'

      const config = getApiConfig()

      expect(config).toEqual({
        baseUrl: 'https://api.example.com',
        apiKey: 'test-api-key',
      })
    })
  })

  describe('異常系', () => {
    it('YUMEMI_BASE_URLが未定義の場合、エラーを投げること', () => {
      process.env.YUMEMI_API_KEY = 'test-api-key'
      process.env.YUMEMI_BASE_URL = undefined

      expect(() => getApiConfig()).toThrow('YUMEMI_BASE_URL is not defined')
    })

    it('YUMEMI_API_KEYが未定義の場合、エラーを投げること', () => {
      process.env.YUMEMI_BASE_URL = 'https://api.example.com'
      process.env.YUMEMI_API_KEY = undefined

      expect(() => getApiConfig()).toThrow('YUMEMI_API_KEY is not defined')
    })

    it('YUMEMI_API_KEYが空文字列の場合、エラーを投げること', () => {
      process.env.YUMEMI_BASE_URL = 'https://api.example.com'
      process.env.YUMEMI_API_KEY = ''

      expect(() => getApiConfig()).toThrow('YUMEMI_API_KEY is not defined')
    })
  })
})
