import { PrefecturesResponseSchema } from '@/features/populationDashboard/types/PrefectureSchema'
import { yumemiApiFetcher } from '@/features/populationDashboard/utils/yumemiApiFetcher'
import { HttpError } from '@/types/Errors'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/config/apiConfig', () => ({
  getApiConfig: vi.fn(() => ({
    baseUrl: 'https://test-api.example.com',
    apiKey: 'test-api-key',
  })),
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('yumemiApiFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('APIからデータを取得し、バリデーションを通過して返却できること', async () => {
      const mockData = {
        message: null,
        result: [{ prefCode: 1, prefName: '北海道' }],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await yumemiApiFetcher('/test', PrefecturesResponseSchema)

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('https://test-api.example.com/test', {
        headers: {
          'X-API-KEY': 'test-api-key',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
    })

    it('キャッシュオプションが正しく渡されること', async () => {
      const mockData = {
        message: null,
        result: [{ prefCode: 1, prefName: '北海道' }],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await yumemiApiFetcher('/test', PrefecturesResponseSchema, { cache: 'force-cache' })

      expect(mockFetch).toHaveBeenCalledWith('https://test-api.example.com/test', {
        headers: {
          'X-API-KEY': 'test-api-key',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      })
    })
  })

  describe('異常系', () => {
    it('APIがエラーレスポンスを返した場合、HttpErrorがスローされること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(yumemiApiFetcher('/test', PrefecturesResponseSchema)).rejects.toThrow(HttpError)
    })

    it('レスポンスデータがスキーマバリデーションに失敗した場合、エラーがスローされること', async () => {
      const invalidData = {
        message: null,
        result: [{ prefCode: 999, prefName: '存在しない県' }],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidData),
      })

      await expect(yumemiApiFetcher('/test', PrefecturesResponseSchema)).rejects.toThrow()
    })
  })
})
