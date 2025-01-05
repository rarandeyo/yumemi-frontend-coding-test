import { type Prefecture, PrefecturesResponseSchema } from '@/types/PrefecturesSchema'
import { yumemiApiFetcher } from './yumemiApiFetcher'

export const getPrefectures = async (): Promise<Prefecture[]> => {
  try {
    const validatedData = await yumemiApiFetcher('/api/v1/prefectures', PrefecturesResponseSchema, {
      cache: 'force-cache',
    })

    return validatedData.result
  } catch (error) {
    console.error('都道府県データの取得中にエラーが発生しました:', error)
    throw error
  }
}
