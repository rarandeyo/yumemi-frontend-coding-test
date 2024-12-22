import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'
import { apiClient } from '@/libs/apiClient'
import { NetworkError } from '@/types/Errors'
import { useCallback, useState } from 'react'

export const useSelectedPopulationList = (): {
  populationData: PopulationDataWithPrefCode[]
  addPopulationData: (prefCode: number) => Promise<void>
  deletePopulationData: (prefCode: number) => void
} => {
  const [populationData, setPopulationData] = useState<PopulationDataWithPrefCode[]>([])

  const fetchPopulationData = useCallback(
    async (prefCode: number): Promise<PopulationDataWithPrefCode> => {
      try {
        const response = await apiClient.api.population.$get({
          query: {
            prefCode: prefCode.toString(),
          },
        })
        if (!response.ok) {
          throw new Error('人口データの取得中にエラーが発生しました')
        }
        const data = await response.json()
        return data
      } catch (error) {
        // ネットワークエラーをTypeErrorで判別してNetworkErrorで投げる
        if (error instanceof TypeError) {
          throw new NetworkError('ネットワークエラーが発生しました')
        }
        throw new Error(`人口データの取得中にエラーが発生しました: ${error}`)
      }
    },
    [],
  )

  const addPopulationData = useCallback(
    async (prefCode: number): Promise<void> => {
      const newData = await fetchPopulationData(prefCode)
      setPopulationData((prev) => [...prev, newData])
    },
    [fetchPopulationData],
  )

  const deletePopulationData = useCallback((prefCode: number): void => {
    setPopulationData((prev) => prev.filter((data) => data.prefCode !== prefCode))
  }, [])

  return {
    populationData,
    addPopulationData,
    deletePopulationData,
  }
}
