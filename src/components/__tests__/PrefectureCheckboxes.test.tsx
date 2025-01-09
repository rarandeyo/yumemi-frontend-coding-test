import { PrefectureCheckboxes } from '@/components/PrefectureCheckboxes'
import type { PrefectureState } from '@/types/PrefecturesSchema'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('PrefectureCheckboxes', () => {
  const createMockPrefectureStates = (): PrefectureState[] => [
    { prefCode: 1, prefName: '北海道', isSelected: false },
    { prefCode: 13, prefName: '東京都', isSelected: true },
  ]

  let mockPrefectureStates: PrefectureState[]
  let handlePrefectureCheckboxes: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockPrefectureStates = createMockPrefectureStates()
    handlePrefectureCheckboxes = vi.fn()
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('都道府県チェックボックスが正常に表示されること', () => {
      const { container } = render(
        <PrefectureCheckboxes
          prefectureStates={mockPrefectureStates}
          handlePrefectureCheckboxes={handlePrefectureCheckboxes}
        />,
      )

      for (const { prefName } of mockPrefectureStates) {
        expect(screen.getByRole('checkbox', { name: prefName })).toBeInTheDocument()
      }
    })

    it('チェックボックスの初期状態が正常に設定されること', () => {
      render(
        <PrefectureCheckboxes
          prefectureStates={mockPrefectureStates}
          handlePrefectureCheckboxes={handlePrefectureCheckboxes}
        />,
      )

      const hokkaidoCheckbox = screen.getByRole('checkbox', { name: '北海道' })
      const tokyoCheckbox = screen.getByRole('checkbox', { name: '東京都' })

      expect(hokkaidoCheckbox).not.toBeChecked()
      expect(tokyoCheckbox).toBeChecked()
    })

    it('チェックボックスをクリックした場合、ハンドラー関数が実行されること', () => {
      render(
        <PrefectureCheckboxes
          prefectureStates={mockPrefectureStates}
          handlePrefectureCheckboxes={handlePrefectureCheckboxes}
        />,
      )

      const hokkaidoCheckbox = screen.getByRole('checkbox', { name: '北海道' })
      fireEvent.click(hokkaidoCheckbox)

      expect(handlePrefectureCheckboxes).toHaveBeenCalledTimes(1)
      const mockEvent = handlePrefectureCheckboxes.mock.calls[0][0]
      expect(mockEvent.target.value).toBe('1')
    })

    it('複数のチェックボックスを操作した場合、それぞれのイベントが正常に処理されること', () => {
      render(
        <PrefectureCheckboxes
          prefectureStates={mockPrefectureStates}
          handlePrefectureCheckboxes={handlePrefectureCheckboxes}
        />,
      )

      const hokkaidoCheckbox = screen.getByRole('checkbox', { name: '北海道' })
      const tokyoCheckbox = screen.getByRole('checkbox', { name: '東京都' })

      fireEvent.click(hokkaidoCheckbox)
      fireEvent.click(tokyoCheckbox)

      expect(handlePrefectureCheckboxes).toHaveBeenCalledTimes(2)
    })
  })

  describe('異常系', () => {
    it('都道府県リストが空の場合、チェックボックスが表示されないこと', () => {
      render(
        <PrefectureCheckboxes
          prefectureStates={[]}
          handlePrefectureCheckboxes={handlePrefectureCheckboxes}
        />,
      )

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })
  })
})
