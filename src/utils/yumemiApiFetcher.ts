import { getApiConfig } from '@/config/apiConfig'
import { HttpError, NetworkError } from '@/types/Errors'
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
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'X-API-KEY': apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...cache,
    })

    if (!res.ok) {
      throw new HttpError(res)
    }
    const data = await res.json()
    return schema.parse(data)
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }
    if (error instanceof TypeError) {
      throw new NetworkError('ネットワークエラーが発生しました')
    }

    throw new Error(`データの取得中にエラーが発生しました: ${error}`)
  }
}
