import { getApiConfig } from '@/config/apiConfig'
import { HttpError, NetworkError } from '@/types/Errors'
import { yumemiApiFetcher } from '@/utils/yumemiApiFetcher'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

vi.mock('@/config/apiConfig')
vi.mock('server-only', () => {
  return {
    default: undefined,
  }
})

describe('yumemiApiFetcher', () => {
  const createMockApiConfig = () => ({
    baseUrl: 'https://api.example.com',
    apiKey: 'test-api-key',
  })

  const createMockSchema = () =>
    z.object({
      result: z.array(
        z.object({
          prefCode: z.number(),
          prefName: z.string(),
        }),
      ),
    })

  const createMockResponse = () => ({
    result: [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ],
  })

  let mockApiConfig: ReturnType<typeof createMockApiConfig>
  let mockSchema: ReturnType<typeof createMockSchema>

  beforeEach(() => {
    mockApiConfig = createMockApiConfig()
    mockSchema = createMockSchema()
    vi.mocked(getApiConfig).mockReturnValue(mockApiConfig)
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('正常にデータを取得した場合、パースされたデータが返却されること', async () => {
      const mockResponse = createMockResponse()

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await yumemiApiFetcher('/test', mockSchema)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: {
            'X-API-KEY': 'test-api-key',
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      )
      expect(result).toEqual(mockResponse)
    })

    it('キャッシュオプションが正常に適用されること', async () => {
      const mockResponse = {
        result: [{ prefCode: 1, prefName: '北海道' }],
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const cacheOptions = { cache: 'force-cache' as const }
      await yumemiApiFetcher('/test', mockSchema, cacheOptions)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining(cacheOptions),
      )
    })
  })

  describe('異常系', () => {
    it('HTTPエラーが発生した場合、HttpErrorがスローされること', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        url: 'https://api.example.com/test',
      })

      await expect(yumemiApiFetcher('/test', mockSchema)).rejects.toThrow(HttpError)
    })

    it('ネットワークエラーが発生した場合、NetworkErrorがスローされること', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(yumemiApiFetcher('/test', mockSchema)).rejects.toThrow(NetworkError)
    })

    it('スキーマ検証に失敗した場合、エラーがスローされること', async () => {
      const invalidResponse = {
        result: [
          { prefCode: '1', prefName: 123 }, // 型が間違っている
        ],
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      })

      await expect(yumemiApiFetcher('/test', mockSchema)).rejects.toThrow()
    })
  })
})
