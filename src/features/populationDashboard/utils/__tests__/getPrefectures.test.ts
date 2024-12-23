import { PrefecturesResponseSchema } from '@/features/populationDashboard/types/PrefectureSchema'
import { getPrefectures } from '@/features/populationDashboard/utils/getPrefectures'
import { yumemiApiFetcher } from '@/features/populationDashboard/utils/yumemiApiFetcher'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.mock('server-only', () => {
  return {}
})

vi.mock('../yumemiApiFetcher')

describe('getPrefectures', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('都道府県データを正常に取得できること', async () => {
      const mockResponse = {
        message: null,
        result: [
          { prefCode: 1, prefName: '北海道' },
          { prefCode: 2, prefName: '青森県' },
        ],
      }

      expect(() => PrefecturesResponseSchema.parse(mockResponse)).not.toThrow()

      vi.mocked(yumemiApiFetcher).mockResolvedValue(mockResponse)

      const result = await getPrefectures()

      expect(result).toEqual(mockResponse.result)
      expect(yumemiApiFetcher).toHaveBeenCalledWith(
        '/api/v1/prefectures',
        PrefecturesResponseSchema,
        {
          cache: 'force-cache',
        },
      )
    })
  })

  describe('異常系', () => {
    it('APIがエラーを返した場合、エラーが伝播すること', async () => {
      vi.mocked(yumemiApiFetcher).mockRejectedValue(new Error('API Error'))
      await expect(getPrefectures()).rejects.toThrow('API Error')
    })

    it('APIレスポンスのスキーマが異なる場合、エラーを投げること', async () => {
      const mockInvalidResponse = {
        message: null,
        result: [
          {
            // prefCodeが文字列型（不正）
            prefCode: '1',
            prefName: '北海道',
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvalidResponse),
      } as Response)

      await expect(getPrefectures()).rejects.toThrow()
    })

    it('APIレスポンスに必須フィールドが欠けている場合、エラーを投げること', async () => {
      const mockInvalidResponse = {
        message: null,
        result: [
          {
            // prefNameが欠けている（不正）
            prefCode: 1,
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInvalidResponse),
      } as Response)

      await expect(getPrefectures()).rejects.toThrow()
    })
  })
})
