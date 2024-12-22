import { useSelectedPopulationList } from '@/features/populationDashboard/hooks/useSelectedPopulationList'
import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'
import type {
  Prefecture,
  PrefectureState,
} from '@/features/populationDashboard/types/PrefectureSchema'
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

  const { populationData, addPopulationData, deletePopulationData } = useSelectedPopulationList()

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

      try {
        if (isChecked) {
          await addPopulationData(prefCode)
        } else {
          deletePopulationData(prefCode)
        }
        togglePrefectureSelection(prefCode)
      } catch (error) {
        console.error('人口データの処理中にエラーが発生しました:', error)
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
