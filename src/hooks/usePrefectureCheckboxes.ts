import { useSelectedPopulationData } from '@/hooks/useSelectedPopulationData'
import { HttpError, NetworkError } from '@/types/Errors'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import type { Prefecture, PrefectureState } from '@/types/PrefecturesSchema'
import type React from 'react'
import { useCallback, useRef, useState } from 'react'

type UsePrefectureCheckboxesReturn = {
  prefectureStates: PrefectureState[]
  populationData: PopulationDataWithPrefCode[]
  handlePrefectureCheckboxes: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  error: string | null
  clearError: () => void
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
  const [error, setError] = useState<string | null>(null)
  const isProcessing = useRef<boolean>(false)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

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
      if (isProcessing.current) return
      isProcessing.current = true

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
        console.error(error)
        if (error instanceof HttpError) {
          setError('データの取得に失敗しました')
          return
        }
        if (error instanceof NetworkError) {
          setError('ネットワークエラーが発生しました')
          return
        }
        throw error
      } finally {
        isProcessing.current = false
      }
    },
    [addPopulationData, deletePopulationData, togglePrefectureSelection],
  )

  return {
    prefectureStates,
    populationData,
    handlePrefectureCheckboxes,
    error,
    clearError,
  }
}
