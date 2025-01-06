import { apiClient } from '@/libs/apiClient'
import { HttpError, NetworkError } from '@/types/Errors'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import { useCallback, useState } from 'react'

export const useSelectedPopulationData = (): {
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
          if (response.status === 424) {
            throw new NetworkError('サーバー側でネットワークエラーが発生しました')
          }
          throw new HttpError(response)
        }

        const data = await response.json()
        return data
      } catch (error) {
        if (error instanceof HttpError || error instanceof NetworkError) {
          throw error
        }
        throw new Error(`データの取得中に想定外のエラーが発生しました: ${error}`)
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
