'use client'

import PopulationGraph from '@/features/populationDashboard/components/PopulationGraph'
import { SelectPopulationLabel } from '@/features/populationDashboard/components/PopulationLabel'
import { PrefectureCheckboxes } from '@/features/populationDashboard/components/PrefectureCheckboxes'
import { usePopulationLabel } from '@/features/populationDashboard/hooks/usePopulationLabel'
import { usePrefectureCheckboxes } from '@/features/populationDashboard/hooks/usePrefectureCheckboxes'
import type { Prefecture } from '@/features/populationDashboard/types/PrefectureSchema'
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
