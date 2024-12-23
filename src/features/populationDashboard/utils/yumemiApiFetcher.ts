import { getApiConfig } from '@/config/apiConfig'
import { HttpError } from '@/types/Errors'
import type { z } from 'zod'

/**
 * @param endpoint APIエンドポイント
 * @param schema Zod Schema（レスポンスデータの検証用）
 * @param cache nextjs fetchのcacheオプション
 */
export async function yumemiApiFetcher<T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  cache?: RequestInit,
): Promise<T> {
  const { baseUrl, apiKey } = getApiConfig()

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'X-API-KEY': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...cache,
  })

  if (!response.ok) {
    throw new HttpError(response)
  }

  const data = await response.json()
  return schema.parse(data)
}
