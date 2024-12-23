'use client'

import { NetworkErrorMessage } from '@/features/populationDashboard/components/NetworkErrorMessage'
import PopulationGraph from '@/features/populationDashboard/components/PopulationGraph'
import { PopulationLabel } from '@/features/populationDashboard/components/PopulationLabel'
import { PrefectureCheckboxes } from '@/features/populationDashboard/components/PrefectureCheckboxes'
import { usePopulationLabel } from '@/features/populationDashboard/hooks/usePopulationLabel'
import { usePrefectureCheckboxes } from '@/features/populationDashboard/hooks/usePrefectureCheckboxes'
import type { Prefecture } from '@/features/populationDashboard/types/PrefectureSchema'
import type React from 'react'

type PopulationDashboardProps = {
  prefectures: Prefecture[]
}

export const PopulationDashboard: React.FC<PopulationDashboardProps> = ({ prefectures }) => {
  const { prefectureStates, populationData, handlePrefectureCheckboxes, error, clearError } =
    usePrefectureCheckboxes(prefectures)

  const { selectedLabel, handlePopulationLabel } = usePopulationLabel()

  return (
    <div className="relative">
      {error && <NetworkErrorMessage message={error} onClose={clearError} />}
      <div className="flex flex-col space-y-4">
        <PrefectureCheckboxes
          prefectureStates={prefectureStates}
          handlePrefectureCheckboxes={handlePrefectureCheckboxes}
        />
        <PopulationLabel
          selectedLabel={selectedLabel}
          handlePopulationLabel={handlePopulationLabel}
        />
        <PopulationGraph
          prefectureStates={prefectureStates}
          populationData={populationData}
          selectedLabel={selectedLabel}
        />
      </div>
    </div>
  )
}
