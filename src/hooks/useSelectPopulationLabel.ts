import { type EnPopulationLabelType, POPULATION_LABELS_EN } from '@/types/PopulationLabelSchema'
import type React from 'react'
import { useState } from 'react'

export const useSelectPopulationLabel = (): {
  selectedLabel: EnPopulationLabelType
  handlePopulationLabel: (e: React.ChangeEvent<HTMLSelectElement>) => void
} => {
  const [selectedLabel, setSelectedLabel] = useState<EnPopulationLabelType>('TOTAL')

  const handlePopulationLabel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.currentTarget.value
    const selected = POPULATION_LABELS_EN.find((option) => option === selectedValue)
    if (selected) {
      setSelectedLabel(selected)
    }
  }
  return {
    selectedLabel,
    handlePopulationLabel,
  }
}
