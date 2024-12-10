import { getApiConfig } from '@/config/apiConfig'
import { type Prefectures, PrefecturesResponseSchema } from '@/types/PrefecturesSchema'

export const getPrefectures = async (): Promise<Prefectures> => {
  const { baseUrl, apiKey } = getApiConfig()

  try {
    const res = await fetch(`${baseUrl}/api/v1/prefectures`, {
      headers: {
        'X-API-KEY': apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    const validatedData = PrefecturesResponseSchema.parse(data)
    return validatedData.result
  } catch (error) {
    console.error('都道府県データの取得中にエラーが発生しました:', error)
    throw error
  }
}
