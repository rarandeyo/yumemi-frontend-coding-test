import Home from '@/app/page'
import { getPrefectures } from '@/utils/getPrefectures'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/utils/getPrefectures')
vi.mock('@/components/PopulationDashboard', () => ({
  PopulationDashboard: ({ prefectures }: { prefectures: unknown[] }) => (
    <div data-testid="mock-dashboard">Prefectures count: {prefectures.length}</div>
  ),
}))

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('都道府県データを取得してPopulationDashboardを表示すること', async () => {
      const mockPrefectures = [
        { prefCode: 1, prefName: '北海道' },
        { prefCode: 13, prefName: '東京都' },
      ]
      vi.mocked(getPrefectures).mockResolvedValueOnce(mockPrefectures)

      const { container } = render(await Home())

      expect(getPrefectures).toHaveBeenCalledTimes(1)
      expect(screen.getByTestId('mock-dashboard')).toHaveTextContent('Prefectures count: 2')
      expect(container.querySelector('main')).toHaveClass('mx-auto', 'flex', 'w-full', 'max-w-7xl')
    })
  })

  describe('異常系', () => {
    it('都道府県データの取得に失敗した場合、エラーがスローされること', async () => {
      const error = new Error('Failed to fetch prefectures')
      vi.mocked(getPrefectures).mockRejectedValueOnce(error)

      await expect(Home()).rejects.toThrow('Failed to fetch prefectures')
    })
  })
})
