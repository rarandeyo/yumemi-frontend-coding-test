import {
  PopulationCompositionPerYearResponseSchema,
  type PopulationDataWithPrefCode,
} from '../types/PopulationSchema'
import { yumemiApiFetcher } from './yumemiApiFetcher'

export const getPopulationData = async (prefCode: number): Promise<PopulationDataWithPrefCode> => {
  try {
    const validatedData = await yumemiApiFetcher(
      `/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      PopulationCompositionPerYearResponseSchema,
      {
        // 1ヶ月キャッシュする
        next: { revalidate: 60 * 60 * 24 * 30 },
      },
    )

    return {
      prefCode,
      ...validatedData.result,
    }
  } catch (error) {
    console.error(`都道府県コード ${prefCode} のデータ取得中にエラーが発生しました:`, error)
    throw error
  }
}
