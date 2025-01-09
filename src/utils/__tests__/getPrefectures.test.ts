import { getPrefectures } from '@/utils/getPrefectures'
import { yumemiApiFetcher } from '@/utils/yumemiApiFetcher'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../yumemiApiFetcher')
vi.mock('server-only', () => {
  return {
    default: undefined,
  }
})

describe('getPrefectures', () => {
  const createMockApiResponse = () => ({
    result: [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ],
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('APIから取得した都道府県データが正常に返却されること', async () => {
      const mockApiResponse = createMockApiResponse()

      vi.mocked(yumemiApiFetcher).mockResolvedValueOnce(mockApiResponse)

      const result = await getPrefectures()

      expect(yumemiApiFetcher).toHaveBeenCalledWith('/api/v1/prefectures', expect.any(Object), {
        cache: 'force-cache',
      })
      expect(result).toEqual(mockApiResponse.result)
    })
  })

  describe('異常系', () => {
    it('APIがエラーを返した場合、エラーが伝播されること', async () => {
      const mockError = new Error('API Error')
      vi.mocked(yumemiApiFetcher).mockRejectedValueOnce(mockError)

      await expect(getPrefectures()).rejects.toThrow('API Error')
    })
  })
})
