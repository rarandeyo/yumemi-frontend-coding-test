import { useSelectedPopulationList } from '@/features/populationDashboard/hooks/useSelectedPopulationList'
import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'
import type {
  Prefecture,
  PrefectureState,
} from '@/features/populationDashboard/types/PrefectureSchema'
import { NetworkError } from '@/types/Errors'
import { useCallback, useEffect, useState } from 'react'
import type React from 'react'

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

  const [processingPrefCode, setProcessingPrefCode] = useState<number | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    // Optional: clear error after 3 seconds
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const { populationData, addPopulationData, deletePopulationData } = useSelectedPopulationList()

  const togglePrefectureSelection = useCallback((prefCode: number): void => {
    setPrefectureStates((prefStates) =>
      prefStates.map((pref) =>
        pref.prefCode === prefCode ? { ...pref, isSelected: !pref.isSelected } : pref,
      ),
    )
  }, [])

  const handlePrefectureCheckboxes = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const prefCode = Number(e.currentTarget.value)
      const isChecked = e.currentTarget.checked

      if (processingPrefCode === prefCode) return

      try {
        setProcessingPrefCode(prefCode)

        if (isChecked) {
          await addPopulationData(prefCode)
          togglePrefectureSelection(prefCode)
        } else {
          deletePopulationData(prefCode)
          togglePrefectureSelection(prefCode)
        }
      } catch (error) {
        if (error instanceof NetworkError) {
          setError('ネットワークエラーが発生しました。時間をおいて再度お試しください。')
        }
        throw new Error('人口データの取得に失敗しました')
      } finally {
        setProcessingPrefCode(null)
      }
    },
    [addPopulationData, deletePopulationData, togglePrefectureSelection, processingPrefCode],
  )

  return {
    prefectureStates,
    populationData,
    handlePrefectureCheckboxes,
    error,
    clearError,
  }
}
