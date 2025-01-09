import { PopulationGraph } from '@/components/PopulationGraph'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import type { PrefectureState } from '@/types/PrefecturesSchema'
import { render } from '@testing-library/react'
import type React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Rechartsのモックが必要な場合は、以下のようにモックを作成
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div className="recharts-line" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}))

describe('PopulationGraph', () => {
  const createMockPrefectureStates = (): PrefectureState[] => [
    { prefCode: 1, prefName: '北海道', isSelected: true },
  ]

  const createMockPopulationData = (): PopulationDataWithPrefCode[] => [
    {
      prefCode: 1,
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [
            { year: 2020, value: 5000000 },
            { year: 2021, value: 5100000 },
          ],
        },
      ],
    },
    {
      prefCode: 13,
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [
            { year: 2020, value: 13000000 },
            { year: 2021, value: 13100000 },
          ],
        },
      ],
    },
  ]

  let mockPrefectureStates: PrefectureState[]
  let mockPopulationData: PopulationDataWithPrefCode[]

  beforeEach(() => {
    mockPrefectureStates = createMockPrefectureStates()
    mockPopulationData = createMockPopulationData()
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('グラフコンテナが正しいスタイルで表示されること', () => {
      const { container } = render(
        <PopulationGraph
          prefectureStates={mockPrefectureStates}
          populationData={mockPopulationData}
          selectedLabel="総人口"
        />,
      )

      const graphContainer = container.firstChild
      expect(graphContainer).toHaveClass('mx-auto', 'w-full', 'rounded-2xl', 'bg-light-blue')
    })

    it('実績値と推計値を区切る参照線が表示されること', () => {
      const { getByTestId } = render(
        <PopulationGraph
          prefectureStates={mockPrefectureStates}
          populationData={mockPopulationData}
          selectedLabel="総人口"
        />,
      )

      expect(getByTestId('reference-line')).toBeInTheDocument()
    })

    it('選択された都道府県の数だけ線グラフが表示されること', () => {
      const { container } = render(
        <PopulationGraph
          prefectureStates={mockPrefectureStates}
          populationData={mockPopulationData}
          selectedLabel="総人口"
        />,
      )

      const lines = container.getElementsByClassName('recharts-line')
      expect(lines.length).toBe(2)
    })
  })

  describe('異常系', () => {
    it('データが空の場合でもエラーが発生せずグラフコンテナが表示されること', () => {
      const { container } = render(
        <PopulationGraph prefectureStates={[]} populationData={[]} selectedLabel="総人口" />,
      )

      expect(container.firstChild).toHaveClass('mx-auto', 'w-full', 'rounded-2xl', 'bg-light-blue')
    })
  })
})
