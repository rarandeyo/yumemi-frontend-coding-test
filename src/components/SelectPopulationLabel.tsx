import {
  type EnPopulationLabelType,
  POPULATION_LABELS,
  POPULATION_LABELS_EN,
} from '@/types/PopulationLabelSchema'
import type React from 'react'
import { useState } from 'react'

export const SelectPopulationLabel: React.FC = () => {
  const [selectedLabel, setSelectedLabel] = useState<EnPopulationLabelType>('TOTAL')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.currentTarget.value
    const selected = POPULATION_LABELS_EN.find((option) => option === selectedValue)
    if (selected) {
      setSelectedLabel(selected)
    }
  }

  return (
    <div className="mx-auto w-full p-2 md:p-4">
      <label className="flex justify-center">
        <select
          className="w-full max-w-xs rounded-md border-2 border-black bg-white px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-light-blue md:px-3 md:py-2 md:text-base"
          value={selectedLabel}
          onChange={handleChange}
          title="人口構成"
        >
          {POPULATION_LABELS_EN.map((enLabel, index) => (
            <option key={enLabel} value={enLabel}>
              {POPULATION_LABELS[index]}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
