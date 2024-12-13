'use client'

import { usePrefectureCheckboxes } from '@/hooks/usePrefectureCheckboxes'
import { useSelectPopulationLabel } from '@/hooks/useSelectPopulationLabel'
import type { Prefectures } from '@/types/PrefecturesSchema'
import type React from 'react'
import { PrefectureCheckboxes } from './PrefectureCheckboxes'
import { SelectPopulationLabel } from './SelectPopulationLabel'

type PopulationDashboardProps = {
  prefectures: Prefectures
}

export const PopulationDashboard: React.FC<PopulationDashboardProps> = ({ prefectures }) => {
  const { prefectureStates, handlePrefectureCheckboxes } = usePrefectureCheckboxes(prefectures)

  const { selectedLabel, handlePopulationLabel } = useSelectPopulationLabel()
  return (
    <div className="flex flex-col space-y-4">
      <PrefectureCheckboxes
        prefectureStates={prefectureStates}
        handlePrefectureCheckboxes={handlePrefectureCheckboxes}
      />
      <SelectPopulationLabel
        selectedLabel={selectedLabel}
        handlePopulationLabel={handlePopulationLabel}
      />
    </div>
  )
}
