import app from '@/app/api/[[...route]]/populationDashboard/population'

import { NetworkError } from '@/types/Errors'
import { getPopulationData } from '@/utils/getPopulationData'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => {
  return {}
})

vi.mock('@/utils/getPopulationData')
describe('Population API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('有効なprefCodeでリクエストした場合、人口データが返却されること', async () => {
      const mockPopulationData = {
        prefCode: 1,
        boundaryYear: 2020,
        data: [],
      }
      vi.mocked(getPopulationData).mockResolvedValueOnce(mockPopulationData)

      const res = await app.request('/?prefCode=1')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual(mockPopulationData)
    })
  })

  describe('異常系', () => {
    it('prefCodeが未指定でリクエストした場合、400エラーが返却されること', async () => {
      const res = await app.request('/')
      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ error: 'Invalid prefCode' })
    })

    it('無効なprefCodeでリクエストした場合、400エラーが返却されること', async () => {
      const res = await app.request('/?prefCode=48')
      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ error: 'Invalid prefCode' })
    })

    it('prefCodeが数値以外でリクエストした場合、400エラーが返却されること', async () => {
      const res = await app.request('/?prefCode=abc')
      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ error: 'Invalid prefCode' })
    })

    it('NetworkErrorが発生した場合、424エラーが返却されること', async () => {
      vi.mocked(getPopulationData).mockRejectedValueOnce(new NetworkError('Network Error'))

      const res = await app.request('/?prefCode=1')
      expect(res.status).toBe(424)
      expect(await res.json()).toEqual({ error: 'External API Network Error' })
    })

    it('予期せぬエラーが発生した場合、500エラーが返却されること', async () => {
      vi.mocked(getPopulationData).mockRejectedValueOnce(new Error('Unexpected Error'))

      const res = await app.request('/?prefCode=1')
      expect(res.status).toBe(500)
      expect(await res.json()).toEqual({ error: 'Internal Server Error' })
    })
  })
})
