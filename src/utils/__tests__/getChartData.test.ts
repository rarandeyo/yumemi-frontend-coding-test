import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import { getChartData } from '@/utils/getChartData'
import { beforeEach, describe, expect, it } from 'vitest'

describe('getChartData', () => {
  const createMockPopulationData = (): PopulationDataWithPrefCode[] => [
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

  let mockPopulationData: PopulationDataWithPrefCode[]

  beforeEach(() => {
    mockPopulationData = createMockPopulationData()
  })

  describe('正常系', () => {
    it('人口データが正常にチャートデータに変換されること', () => {
      const expected = [
        { year: 2020, 1: 1000, 2: 2000 },
        { year: 2021, 1: 1100, 2: 2200 },
      ]

      const result = getChartData('総人口', mockPopulationData)
      expect(result).toEqual(expected)
    })
  })

  describe('異常系', () => {
    it('空の配列が渡された場合、空の配列が返却されること', () => {
      const result = getChartData('総人口', [])
      expect(result).toEqual([])
    })

    it('指定されたラベルのデータが存在しない場合、空の配列が返却されること', () => {
      const invalidLabelData: PopulationDataWithPrefCode[] = [
        {
          prefCode: 1,
          boundaryYear: 2020,
          data: [
            {
              label: '年少人口',
              data: [{ year: 2020, value: 1000 }],
            },
          ],
        },
      ]

      const result = getChartData('総人口', invalidLabelData)
      expect(result).toEqual([])
    })
  })
})
