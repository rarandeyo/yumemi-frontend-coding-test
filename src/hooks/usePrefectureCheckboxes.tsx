import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import type { Prefecture, PrefectureState } from '@/types/PrefecturesSchema'
import type React from 'react'
import { useState } from 'react'
import { useSelectedPopulationList } from './useSelectedPopulationData'

type UsePrefectureCheckboxesReturn = {
  prefectureStates: PrefectureState[]
  populationData: PopulationDataWithPrefCode[]
  handlePrefectureCheckboxes: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const usePrefectureCheckboxes = (
  prefectures: Prefecture[],
): UsePrefectureCheckboxesReturn => {
  const [prefectureStates, setPrefectureStates] = useState<PrefectureState[]>(() =>
    prefectures.map((pref) => ({
      isSelected: false,
      ...pref,
    })),
  )

  const { populationData, addPopulationData, deletePopulationData } = useSelectedPopulationList()

  const togglePrefectureSelection = (prefCode: number): void =>
    setPrefectureStates((prefStates) =>
      prefStates.map((pref) =>
        pref.prefCode === prefCode ? { ...pref, isSelected: !pref.isSelected } : pref,
      ),
    )

  const handlePrefectureCheckboxes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefCode = Number(e.currentTarget.value)
    const isChecked = e.currentTarget.checked

    togglePrefectureSelection(prefCode)

    if (isChecked) {
      await addPopulationData(prefCode)
    } else {
      deletePopulationData(prefCode)
    }
  }

  return {
    prefectureStates,
    populationData,
    handlePrefectureCheckboxes,
  }
}
