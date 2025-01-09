import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PopulationDashboard } from '../PopulationDashboard'

// 依存コンポーネントのモック
vi.mock('../ErrorMessage', () => ({
  ErrorMessage: () => <div>Error Message</div>,
}))

vi.mock('../PrefectureCheckboxes', () => ({
  PrefectureCheckboxes: () => <div>Prefecture Checkboxes</div>,
}))

vi.mock('../SelectPopulationLabel', () => ({
  SelectPopulationLabel: () => <div>Select Population Label</div>,
}))

vi.mock('../PopulationGraph', () => ({
  PopulationGraph: () => <div>Population Graph</div>,
}))

// フックのモック
vi.mock('../../hooks/usePrefectureCheckboxes', () => ({
  usePrefectureCheckboxes: () => ({
    prefectureStates: [],
    populationData: [],
    handlePrefectureCheckboxes: vi.fn(),
    error: null,
    clearError: vi.fn(),
  }),
}))

vi.mock('../../hooks/useSelectPopulationLabel', () => ({
  useSelectPopulationLabel: () => ({
    selectedLabel: '総人口',
    handlePopulationLabel: vi.fn(),
  }),
}))

describe('PopulationDashboard', () => {
  const createMockPrefectures = () => [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 13, prefName: '東京都' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('必要なコンポーネントがすべて表示されること', () => {
      const { container } = render(<PopulationDashboard prefectures={createMockPrefectures()} />)

      expect(container.querySelector('.relative')).toBeInTheDocument()
      expect(container.textContent).toContain('Prefecture Checkboxes')
      expect(container.textContent).toContain('Select Population Label')
      expect(container.textContent).toContain('Population Graph')
    })
  })

  describe('異常系', () => {
    it('都道府県データが空の場合でもエラーが発生しないこと', () => {
      const { container } = render(<PopulationDashboard prefectures={[]} />)

      expect(container.querySelector('.relative')).toBeInTheDocument()
    })
  })
})
