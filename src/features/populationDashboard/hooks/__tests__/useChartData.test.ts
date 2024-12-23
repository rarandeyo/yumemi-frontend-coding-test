import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useChartData } from '../useChartData'

describe('useChartData', () => {
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
        {
          label: '年少人口',
          data: [
            { year: 2020, value: 200 },
            { year: 2021, value: 210 },
          ],
        },
        {
          label: '生産年齢人口',
          data: [
            { year: 2020, value: 0 },
            { year: 2021, value: 0 },
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
            { year: 2021, value: 2100 },
          ],
        },
        {
          label: '年少人口',
          data: [
            { year: 2020, value: 400 },
            { year: 2021, value: 420 },
          ],
        },
        {
          label: '生産年齢人口',
          data: [
            { year: 2020, value: 0 },
            { year: 2021, value: 0 },
          ],
        },
      ],
    },
  ]

  it('データが空の場合、空の配列を返すこと', () => {
    const { result } = renderHook(() => useChartData('総人口', []))
    expect(result.current.chartData).toEqual([])
  })

  it('選択されたラベルに対応するデータを正しく整形すること', () => {
    const { result } = renderHook(() => useChartData('総人口', mockPopulationData))

    expect(result.current.chartData).toEqual([
      { year: 2020, 1: 1000, 2: 2000 },
      { year: 2021, 1: 1100, 2: 2100 },
    ])
  })

  it('異なるラベルを選択した場合、対応するデータを返すこと', () => {
    const { result } = renderHook(() => useChartData('年少人口', mockPopulationData))

    expect(result.current.chartData).toEqual([
      { year: 2020, 1: 200, 2: 400 },
      { year: 2021, 1: 210, 2: 420 },
    ])
  })

  it('値が0のデータの場合、0として処理されること', () => {
    const { result } = renderHook(() => useChartData('生産年齢人口', mockPopulationData))

    expect(result.current.chartData).toEqual([
      { year: 2020, 1: 0, 2: 0 },
      { year: 2021, 1: 0, 2: 0 },
    ])
  })
})
