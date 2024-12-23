import { useNetworkErrorMessage } from '@/features/populationDashboard/hooks/NetworkErrorMessage'
import { useSelectedPopulationList } from '@/features/populationDashboard/hooks/useSelectedPopulationList'
import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'
import type {
  Prefecture,
  PrefectureState,
} from '@/features/populationDashboard/types/PrefectureSchema'
import { NetworkError } from '@/types/Errors'
import { useCallback, useRef, useState } from 'react'
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

  const processingPrefCodeRef = useRef<number | null>(null)
  const { populationData, addPopulationData, deletePopulationData } = useSelectedPopulationList()
  const { error, showError, clearError } = useNetworkErrorMessage()

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

      if (processingPrefCodeRef.current === prefCode) {
        return
      }

      processingPrefCodeRef.current = prefCode

      try {
        if (isChecked) {
          await addPopulationData(prefCode)
          togglePrefectureSelection(prefCode)
        } else {
          deletePopulationData(prefCode)
          togglePrefectureSelection(prefCode)
        }
      } catch (error) {
        if (error instanceof NetworkError) {
          showError('ネットワークエラーが発生しました。時間をおいて再度お試しください。')
        }
        throw new Error('人口データの取得に失敗しました')
      } finally {
        processingPrefCodeRef.current = null
      }
    },
    [addPopulationData, deletePopulationData, togglePrefectureSelection, showError],
  )

  return {
    prefectureStates,
    populationData,
    handlePrefectureCheckboxes,
    error,
    clearError,
  }
}
