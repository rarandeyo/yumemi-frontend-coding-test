import { getApiConfig } from '@/config/apiConfig'
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

  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'X-API-KEY': apiKey,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...cache,
  })

  if (!res.ok) {
    throw new Error(`Yumemi API request failed with status ${res.status}`)
  }

  const data = await res.json()
  return schema.parse(data)
}
