'use client'

import type { Prefectures } from '@/types/PrefecturesSchema'
import type React from 'react'
import { PrefectureCheckboxes } from './PrefectureCheckboxes'
import { SelectPopulationLabel } from './SelectPopulationLabel'

type PopulationDashboardProps = {
  prefectures: Prefectures
}

export const PopulationDashboard: React.FC<PopulationDashboardProps> = ({ prefectures }) => {
  return (
    <div className="flex flex-col space-y-4">
      <PrefectureCheckboxes prefectures={prefectures} />
      <SelectPopulationLabel />
    </div>
  )
}
