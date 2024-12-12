import { getApiConfig } from '@/config/apiConfig'
import { type PopulationResult, PopulationResultSchema } from '@/types/PopulationSchema'

export const getPopulationData = async (prefCode: number): Promise<PopulationResult> => {
  const { baseUrl, apiKey } = getApiConfig()

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        headers: {
          'X-API-KEY': apiKey,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      },
    )
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`)
    }

    const data = await res.json()

    //APIのdataにprefCodeを追加
    const dataWithPrefCode = {
      prefCode,
      ...data.result,
    }

    const validatedData = PopulationResultSchema.parse(dataWithPrefCode)
    return validatedData
  } catch (error) {
    console.error(`都道府県コード ${prefCode} のデータ取得中にエラーが発生しました:`, error)
    throw error
  }
}
