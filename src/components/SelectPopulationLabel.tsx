import { POPULATION_LABELS, type PopulationLabelType } from '@/types/PopulationLabelSchema'
import React from 'react'

type SelectPopulationLabelProps = {
  selectedLabel: PopulationLabelType
  handlePopulationLabel: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const SelectPopulationLabel = React.memo<SelectPopulationLabelProps>(
  ({ selectedLabel, handlePopulationLabel }) => {
    return (
      <div className="mx-auto w-full p-2 md:p-4">
        <label className="flex justify-center">
          <select
            className="w-full max-w-xs rounded-2xl border-2 border-black bg-white px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-light-blue md:px-3 md:py-2 md:text-base"
            value={selectedLabel}
            onChange={handlePopulationLabel}
            title="人口構成"
          >
            {POPULATION_LABELS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  },
)
