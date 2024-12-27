'use client'

import type { Prefectures } from '@/types/PrefecturesSchema'
import { handlePrefectureCheckboxes } from '@/utils/handlePrefectureCheckboxes'
import React from 'react'

type PrefectureCheckboxesProps = {
  prefectures: Prefectures
}

export const PrefectureCheckboxes: React.FC<PrefectureCheckboxesProps> = ({ prefectures }) => {
  const [selectedPrefs, setSelectedPrefs] = React.useState<number[]>([])

  return (
    <div>
      {prefectures.map((pref) => (
        <label key={pref.prefCode}>
          <input
            type="checkbox"
            checked={selectedPrefs.includes(pref.prefCode)}
            onChange={() => handlePrefectureCheckboxes(pref.prefCode, setSelectedPrefs)}
          />
          {pref.prefName}
        </label>
      ))}
    </div>
  )
}
