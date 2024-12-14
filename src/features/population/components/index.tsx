'use client'

import PopulationGraph from '@/features/population/components/PopulationGraph'
import { SelectPopulationLabel } from '@/features/population/components/PopulationLabel'
import { PrefectureCheckboxes } from '@/features/population/components/PrefectureCheckboxes'
import { usePopulationLabel } from '@/features/population/hooks/usePopulationLabel'
import { usePrefectureCheckboxes } from '@/features/population/hooks/usePrefectureCheckboxes'
import type { Prefecture } from '@/features/population/types/PrefectureSchema'
import type React from 'react'

type PopulationDashboardProps = {
  prefectures: Prefecture[]
}

export const PopulationDashboard: React.FC<PopulationDashboardProps> = ({ prefectures }) => {
  const { prefectureStates, populationData, handlePrefectureCheckboxes } =
    usePrefectureCheckboxes(prefectures)

  const { selectedLabel, handlePopulationLabel } = usePopulationLabel()
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
      <PopulationGraph
        prefectureStates={prefectureStates}
        populationData={populationData}
        selectedLabel={selectedLabel}
      />
    </div>
  )
}
