'use client'

import { ErrorMessage } from '@/components/ErrorMessage'
import PopulationGraph from '@/components/PopulationGraph'
import { PrefectureCheckboxes } from '@/components/PrefectureCheckboxes'
import { SelectPopulationLabel } from '@/components/SelectPopulationLabel'

import { usePrefectureCheckboxes } from '@/hooks/usePrefectureCheckboxes'
import { useSelectPopulationLabel } from '@/hooks/useSelectPopulationLabel'
import type { Prefecture } from '@/types/PrefecturesSchema'
import React from 'react'

type PopulationDashboardProps = {
  prefectures: Prefecture[]
}

export const PopulationDashboard = React.memo<PopulationDashboardProps>(({ prefectures }) => {
  const { prefectureStates, populationData, handlePrefectureCheckboxes, error, clearError } =
    usePrefectureCheckboxes(prefectures)
  const { selectedLabel, handlePopulationLabel } = useSelectPopulationLabel()

  return (
    <div className="relative">
      <ErrorMessage message={error} onClose={clearError} />
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
    </div>
  )
})
