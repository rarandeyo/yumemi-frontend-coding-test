import { type Prefecture, PrefecturesResponseSchema } from '@/types/PrefecturesSchema'
import { yumemiApiFetcher } from './yumemiApiFetcher'

export const getPrefectures = async (): Promise<Prefecture[]> => {
  const validatedData = await yumemiApiFetcher('/api/v1/prefectures', PrefecturesResponseSchema, {
    cache: 'force-cache',
  })
  return validatedData.result
}
