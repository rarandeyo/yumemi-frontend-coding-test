import { useCallback, useState } from 'react'
import type { PopulationDataWithPrefCode } from '../types/PopulationSchema'

export const useSelectedPopulationList = (): {
  populationData: PopulationDataWithPrefCode[]
  addPopulationData: (prefCode: number) => void
  deletePopulationData: (prefCode: number) => void
} => {
  const [populationData, setPopulationData] = useState<PopulationDataWithPrefCode[]>([])

  const fetchPopulationData = useCallback(
    async (prefCode: number): Promise<PopulationDataWithPrefCode> => {
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
    },
    [],
  )

  const addPopulationData = useCallback(
    async (prefCode: number) => {
      const newData = await fetchPopulationData(prefCode)
      setPopulationData((prev) => [...prev, newData])
    },
    [fetchPopulationData],
  )
  const deletePopulationData = useCallback((prefCode: number) => {
    setPopulationData((prev) => prev.filter((data) => data.prefCode !== prefCode))
  }, [])

  return {
    populationData,
    addPopulationData,
    deletePopulationData,
  }
}
