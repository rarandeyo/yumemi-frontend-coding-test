import { getPopulationData } from '@/utils/getPopulationData'
import { yumemiApiFetcher } from '@/utils/yumemiApiFetcher'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../yumemiApiFetcher')
vi.mock('server-only', () => {
  return {
    default: undefined,
  }
})

describe('getPopulationData', () => {
  const createMockApiResponse = () => ({
    result: {
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [{ year: 2020, value: 1000 }],
        },
      ],
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('APIから取得したデータが正常に整形されて返却されること', async () => {
      const mockApiResponse = createMockApiResponse()
      const mockPrefCode = 1
      const expectedResult = {
        prefCode: mockPrefCode,
        boundaryYear: 2020,
        data: [
          {
            label: '総人口',
            data: [{ year: 2020, value: 1000 }],
          },
        ],
      }

      vi.mocked(yumemiApiFetcher).mockResolvedValueOnce(mockApiResponse)

      const result = await getPopulationData(mockPrefCode)

      expect(yumemiApiFetcher).toHaveBeenCalledWith(
        `/api/v1/population/composition/perYear?prefCode=${mockPrefCode}`,
        expect.any(Object),
        { next: { revalidate: 60 * 60 * 24 * 30 } },
      )
      expect(result).toEqual(expectedResult)
    })
  })

  describe('異常系', () => {
    it('APIがエラーを返した場合、エラーが伝播されること', async () => {
      const mockError = new Error('API Error')
      vi.mocked(yumemiApiFetcher).mockRejectedValueOnce(mockError)

      await expect(getPopulationData(1)).rejects.toThrow('API Error')
    })
  })
})
