import type { PrefectureStates } from '@/types/PrefecturesSchema'
import type React from 'react'
import { useState } from 'react'

export const usePrefectureCheckboxes = (defaultPrefectureStates: PrefectureStates) => {
  const [prefectureStates, setPrefectureStates] =
    useState<PrefectureStates>(defaultPrefectureStates)

  const handlePrefectureCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefCode = Number(e.currentTarget.value)

    setPrefectureStates((prev) =>
      prev.map((pref) =>
        pref.prefCode === prefCode ? { ...pref, isSelected: !pref.isSelected } : pref,
      ),
    )
  }

  return {
    prefectureStates,
    handlePrefectureCheckboxes,
  }
}
