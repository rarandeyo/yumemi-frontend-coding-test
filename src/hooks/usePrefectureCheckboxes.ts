import { useSelectedPopulationData } from '@/hooks/useSelectedPopulationData'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import type { Prefecture, PrefectureState } from '@/types/PrefecturesSchema'
import type React from 'react'
import { useCallback, useState } from 'react'

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

  const { populationData, addPopulationData, deletePopulationData } = useSelectedPopulationData()

  const togglePrefectureSelection = useCallback((prefCode: number): void => {
    setPrefectureStates((prefStates) =>
      prefStates.map((pref) =>
        pref.prefCode === prefCode ? { ...pref, isSelected: !pref.isSelected } : pref,
      ),
    )
  }, [])

  const handlePrefectureCheckboxes = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const prefCode = Number(e.currentTarget.value)
      const isChecked = e.currentTarget.checked

      togglePrefectureSelection(prefCode)

      if (isChecked) {
        await addPopulationData(prefCode)
      } else {
        deletePopulationData(prefCode)
      }
    },
    [addPopulationData, deletePopulationData, togglePrefectureSelection],
  )

  return {
    prefectureStates,
    populationData,
    handlePrefectureCheckboxes,
  }
}
