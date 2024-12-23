import {
  PopulationCompositionPerYearResponseSchema,
  type PopulationDataWithPrefCode,
} from '../types/PopulationSchema'
import { yumemiApiFetcher } from './yumemiApiFetcher'

export const getPopulationData = async (prefCode: number): Promise<PopulationDataWithPrefCode> => {
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
}
