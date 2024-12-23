import { POPULATION_LABELS } from '@/features/populationDashboard/types/PopulationLabelSchema'
import { PopulationCompositionPerYearResponseSchema } from '@/features/populationDashboard/types/PopulationSchema'
import { getPopulationData } from '@/features/populationDashboard/utils/getPopulationData'
import { yumemiApiFetcher } from '@/features/populationDashboard/utils/yumemiApiFetcher'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.mock('server-only', () => {
  return {}
})

vi.mock('../yumemiApiFetcher')

describe('getPopulationData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('有効なprefCodeで人口データを取得できること', async () => {
      const mockResponse = {
        message: null,
        result: {
          boundaryYear: 2020,
          data: POPULATION_LABELS.map((label) => ({
            label,
            data: [
              {
                year: 1960,
                value: 5039206,
                ...(label !== '総人口' && { rate: 33.37 }),
              },
            ],
          })),
        },
      }

      expect(() => PopulationCompositionPerYearResponseSchema.parse(mockResponse)).not.toThrow()

      vi.mocked(yumemiApiFetcher).mockResolvedValue(mockResponse)

      const prefCode = 1
      const result = await getPopulationData(prefCode)

      expect(result).toEqual({
        prefCode,
        ...mockResponse.result,
      })
      expect(yumemiApiFetcher).toHaveBeenCalledWith(
        `/api/v1/population/composition/perYear?prefCode=${prefCode}`,
        PopulationCompositionPerYearResponseSchema,
        { next: { revalidate: 60 * 60 * 24 * 30 } },
      )
    })
  })

  describe('異常系', () => {
    it('APIがエラーを返した場合、エラーが伝播すること', async () => {
      vi.mocked(yumemiApiFetcher).mockRejectedValue(new Error('API Error'))
      await expect(getPopulationData(1)).rejects.toThrow('API Error')
    })

    it('APIレスポンスのスキーマが異なる場合、エラーを投げること', async () => {
      const mockInvalidResponse = {
        message: null,
        result: {
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                {
                  // yearが文字列型　（不正）
                  year: '2015',
                  value: 5000000,
                },
              ],
            },
          ],
        },
      }

      expect(() => PopulationCompositionPerYearResponseSchema.parse(mockInvalidResponse)).toThrow()

      vi.mocked(yumemiApiFetcher).mockRejectedValue(new Error('Schema validation failed'))
      await expect(getPopulationData(1)).rejects.toThrow()
    })

    it('APIレスポンスに必須フィールドが欠けている場合、エラーを投げること', async () => {
      const mockInvalidResponse = {
        message: null,
        result: {
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                {
                  //valueが欠けている　（不正）
                  year: 2015,
                },
              ],
            },
          ],
        },
      }

      expect(() => PopulationCompositionPerYearResponseSchema.parse(mockInvalidResponse)).toThrow()

      vi.mocked(yumemiApiFetcher).mockRejectedValue(new Error('Schema validation failed'))
      await expect(getPopulationData(1)).rejects.toThrow()
    })

    it('APIレスポンスの人口構成ラベルが不正な場合、エラーを投げること', async () => {
      const mockInvalidResponse = {
        message: null,
        result: {
          boundaryYear: 2020,
          data: [
            {
              // labelが不正な人口区分　（不正）
              label: '不正な人口区分',
              data: [
                {
                  year: 2015,
                  value: 5000000,
                },
              ],
            },
          ],
        },
      }

      expect(() => PopulationCompositionPerYearResponseSchema.parse(mockInvalidResponse)).toThrow()

      vi.mocked(yumemiApiFetcher).mockRejectedValue(new Error('Schema validation failed'))
      await expect(getPopulationData(1)).rejects.toThrow()
    })
  })
})
