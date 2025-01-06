import { useSelectedPopulationData } from '@/hooks/useSelectedPopulationData'
import { HttpError, NetworkError } from '@/types/Errors'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import type { Prefecture, PrefectureState } from '@/types/PrefecturesSchema'
import type React from 'react'
import { useCallback, useState } from 'react'

type UsePrefectureCheckboxesReturn = {
  prefectureStates: PrefectureState[]
  populationData: PopulationDataWithPrefCode[]
  handlePrefectureCheckboxes: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  error: Error | null
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
  const [error, setError] = useState<Error | null>(null)

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

      try {
        if (isChecked) {
          await addPopulationData(prefCode)
        } else {
          deletePopulationData(prefCode)
        }
        togglePrefectureSelection(prefCode)
      } catch (error) {
        if (error instanceof HttpError || error instanceof NetworkError) {
          setError(error)
          return
        }
        throw error
      }
    },
    [addPopulationData, deletePopulationData, togglePrefectureSelection],
  )

  return {
    prefectureStates,
    populationData,
    handlePrefectureCheckboxes,
    error,
  }
}
