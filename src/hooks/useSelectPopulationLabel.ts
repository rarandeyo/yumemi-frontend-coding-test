import { POPULATION_LABELS, type PopulationLabelType } from '@/types/PopulationLabelSchema'
import type React from 'react'
import { useCallback, useState } from 'react'

export const useSelectPopulationLabel = (): {
  selectedLabel: PopulationLabelType
  handlePopulationLabel: (e: React.ChangeEvent<HTMLSelectElement>) => void
} => {
  const [selectedLabel, setSelectedLabel] = useState<PopulationLabelType>('総人口')

  const handlePopulationLabel = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.currentTarget.value
    const selected = POPULATION_LABELS.find((option) => option === selectedValue)
    if (selected) {
      setSelectedLabel(selected)
    }
  }, [])
  return {
    selectedLabel,
    handlePopulationLabel,
  }
}
