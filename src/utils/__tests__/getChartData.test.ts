import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import { getChartData } from '@/utils/getChartData'
import { describe, expect, it } from 'vitest'

describe('getChartData', () => {
  describe('正常系', () => {
    it('人口データを正しいフォーマットに変換すること', () => {
      const mockPopulationData: PopulationDataWithPrefCode[] = [
        {
          prefCode: 1,
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                { year: 2020, value: 1000 },
                { year: 2021, value: 1100 },
              ],
            },
          ],
        },
        {
          prefCode: 2,
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                { year: 2020, value: 2000 },
                { year: 2021, value: 2200 },
              ],
            },
          ],
        },
      ]

      const result = getChartData('総人口', mockPopulationData)

      expect(result).toEqual({
        boundaryYear: 2020,
        chartData: [
          {
            '1': 1000,
            '2': 2000,
            year: 2020,
          },
          {
            '1': 1100,
            '2': 2200,
            year: 2021,
          },
        ],
      })
    })

    it('データが空の場合、空のチャートデータを返すこと', () => {
      const result = getChartData('総人口', [])

      expect(result).toEqual({
        boundaryYear: 0,
        chartData: [],
      })
    })
  })
})
