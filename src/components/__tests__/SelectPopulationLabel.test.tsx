import { SelectPopulationLabel } from '@/components/SelectPopulationLabel'
import { POPULATION_LABELS } from '@/types/PopulationLabelSchema'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('SelectPopulationLabel', () => {
  const createMockHandler = () => vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('セレクトボックスが正常に表示されること', () => {
      const handlePopulationLabel = createMockHandler()
      render(
        <SelectPopulationLabel
          selectedLabel={POPULATION_LABELS[0]}
          handlePopulationLabel={handlePopulationLabel}
        />,
      )

      const selectElement = screen.getByTitle('人口構成')
      expect(selectElement).toBeInTheDocument()
    })

    it('すべての人口ラベルオプションが正常に表示されること', () => {
      const handlePopulationLabel = createMockHandler()
      render(
        <SelectPopulationLabel
          selectedLabel={POPULATION_LABELS[0]}
          handlePopulationLabel={handlePopulationLabel}
        />,
      )

      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(POPULATION_LABELS.length)
      for (const label of POPULATION_LABELS) {
        expect(screen.getByText(label)).toBeInTheDocument()
      }
    })

    it('選択されたラベルが正常に表示されること', () => {
      const handlePopulationLabel = createMockHandler()
      const selectedLabel = POPULATION_LABELS[1]
      render(
        <SelectPopulationLabel
          selectedLabel={selectedLabel}
          handlePopulationLabel={handlePopulationLabel}
        />,
      )

      const selectElement = screen.getByTitle('人口構成') as HTMLSelectElement
      expect(selectElement.value).toBe(selectedLabel)
    })

    it('選択を変更した場合、ハンドラー関数が実行されること', () => {
      const handlePopulationLabel = createMockHandler()
      render(
        <SelectPopulationLabel
          selectedLabel={POPULATION_LABELS[0]}
          handlePopulationLabel={handlePopulationLabel}
        />,
      )

      const selectElement = screen.getByTitle('人口構成')
      fireEvent.change(selectElement, { target: { value: POPULATION_LABELS[1] } })

      expect(handlePopulationLabel).toHaveBeenCalledTimes(1)
    })
  })
})
