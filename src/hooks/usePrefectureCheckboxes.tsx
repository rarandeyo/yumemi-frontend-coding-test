import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import type { Prefecture, PrefectureState } from '@/types/PrefecturesSchema'
import type React from 'react'
import { useState } from 'react'
import { useSelectedPopulationList } from './useSelectedPopulationList'

type UsePrefectureCheckboxesReturn = {
  prefectureStates: PrefectureState[]
  populationList: PopulationDataWithPrefCode[]
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

  const { populationList, addPopulationList, deletePopulationList } = useSelectedPopulationList()

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
      await addPopulationList(prefCode)
    } else {
      deletePopulationList(prefCode)
    }
  }

  return {
    prefectureStates,
    populationList,
    handlePrefectureCheckboxes,
  }
}
