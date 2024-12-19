import { getApiConfig } from '@/config/apiConfig'
import {
  type Prefecture,
  PrefecturesResponseSchema,
} from '@/features/populationDashboard/types/PrefectureSchema'

export const getPrefectures = async (): Promise<Prefecture[]> => {
  const { baseUrl, apiKey } = getApiConfig()

  try {
    const res = await fetch(`${baseUrl}/api/v1/prefectures`, {
      headers: {
        'X-API-KEY': apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`)
    }

    const data = await res.json()
    const validatedData = PrefecturesResponseSchema.parse(data)
    return validatedData.result
  } catch (error) {
    console.error('都道府県データの取得中にエラーが発生しました:', error)
    throw error
  }
}
