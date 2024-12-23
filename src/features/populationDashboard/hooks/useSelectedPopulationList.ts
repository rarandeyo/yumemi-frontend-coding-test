import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'
import { apiClient } from '@/libs/apiClient'
import { HttpError, NetworkError } from '@/types/Errors'
import { useCallback, useState } from 'react'

export const useSelectedPopulationList = (): {
  populationData: PopulationDataWithPrefCode[]
  addPopulationData: (prefCode: number) => Promise<void>
  deletePopulationData: (prefCode: number) => void
} => {
  const [populationData, setPopulationData] = useState<PopulationDataWithPrefCode[]>([])

  const fetchPopulationData = useCallback(
    async (prefCode: number): Promise<PopulationDataWithPrefCode> => {
      const response = await apiClient.api.population.$get({
        query: {
          prefCode: prefCode.toString(),
        },
      })
      if (!response.ok) {
        if (response.status === 424) {
          throw new NetworkError('外部APIのネットワークエラーが発生しました')
        }
        throw new HttpError(response)
      }
      const data = await response.json()
      return data
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
