import type { PopulationResult } from '@/types/PopulationSchema'
import type { PrefectureStates, Prefectures } from '@/types/PrefecturesSchema'
import type React from 'react'
import { useCallback, useState } from 'react'

type UsePrefectureCheckboxesReturn = {
  prefectureStates: PrefectureStates
  populationList: PopulationResult[]
  handlePrefectureCheckboxes: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const usePrefectureCheckboxes = (
  prefectures: Prefectures,
): UsePrefectureCheckboxesReturn => {
  const [prefectureStates, setPrefectureStates] = useState(() =>
    prefectures.map((pref) => ({
      isSelected: false,
      ...pref,
    })),
  )

  const [populationList, setPopulationList] = useState<PopulationResult[]>([])

  const togglePrefectureSelection = (prefCode: number): void =>
    setPrefectureStates((prefStates) =>
      prefStates.map((pref) =>
        pref.prefCode === prefCode ? { ...pref, isSelected: !pref.isSelected } : pref,
      ),
    )

  const fetchPopulationData = useCallback(async (prefCode: number): Promise<PopulationResult> => {
    try {
      const response = await fetch(`/api/population?prefCode=${prefCode}`)
      if (!response.ok) {
        throw new Error('データの取得に失敗しました')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('人口データの取得中にエラーが発生しました:', error)
      throw error
    }
  }, [])

  const handlePrefectureCheckboxes = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const prefCode = Number(e.currentTarget.value)

    togglePrefectureSelection(prefCode)

    const isAlreadyFetched = populationList.some((data) => data.prefCode === prefCode)
    if (!isAlreadyFetched) {
      const newData = await fetchPopulationData(prefCode)
      setPopulationList((prev) => [...prev, newData])
    }
  }

  return {
    prefectureStates,
    populationList,
    handlePrefectureCheckboxes,
  }
}
