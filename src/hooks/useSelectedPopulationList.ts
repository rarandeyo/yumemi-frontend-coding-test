import { useCallback, useState } from 'react'
import type { PopulationDataWithPrefCode } from '../types/PopulationSchema'

export const useSelectedPopulationList = (): {
  populationList: PopulationDataWithPrefCode[]
  addPopulationList: (prefCode: number) => void
  deletePopulationList: (prefCode: number) => void
} => {
  const [populationList, setPopulationList] = useState<PopulationDataWithPrefCode[]>([])

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

  const addPopulationList = useCallback(
    async (prefCode: number) => {
      const newData = await fetchPopulationData(prefCode)
      setPopulationList((prev) => [...prev, newData])
    },
    [fetchPopulationData],
  )
  const deletePopulationList = useCallback((prefCode: number) => {
    setPopulationList((prev) => prev.filter((data) => data.prefCode !== prefCode))
  }, [])

  return {
    populationList,
    addPopulationList,
    deletePopulationList,
  }
}
