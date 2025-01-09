import { useSelectedPopulationData } from '@/hooks/useSelectedPopulationData'
import { apiClient } from '@/libs/apiClient'
import { HttpError, NetworkError } from '@/types/Errors'
import type { PopulationLabelType } from '@/types/PopulationLabelSchema'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import { act, renderHook } from '@testing-library/react'
import type { ClientResponse } from 'hono/client'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/libs/apiClient', () => ({
  apiClient: {
    api: {
      population: {
        $get: vi.fn(),
      },
    },
  },
}))

describe('useSelectedPopulationData', () => {
  const createMockPopulationData = (prefCode: number): PopulationDataWithPrefCode => {
    const labels: PopulationLabelType[] = ['総人口', '生産年齢人口', '老年人口', '年少人口']
    return {
      prefCode,
      boundaryYear: 2020,
      data: labels.map((label) => ({
        label,
        data: [
          { year: 2020, value: 1000, rate: 100 },
          { year: 2021, value: 1100, rate: 110 },
        ],
      })),
    }
  }

  const createMockResponse = (
    data: PopulationDataWithPrefCode,
    status: ContentfulStatusCode = 200,
    ok = true,
  ): ClientResponse<PopulationDataWithPrefCode, ContentfulStatusCode, 'json'> => {
    return {
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      headers: new Headers(),
      url: 'http://example.com/api/population',
      body: null,
      bodyUsed: false,
      redirected: false,
      type: 'default',
      redirect: vi.fn(),
      clone: vi.fn(),
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      bytes: () => Promise.resolve(new Uint8Array()),
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('初期状態で空の配列が返却されること', () => {
      const { result } = renderHook(() => useSelectedPopulationData())
      expect(result.current.populationData).toEqual([])
    })

    it('addPopulationDataで人口データが正常に追加されること', async () => {
      const { result } = renderHook(() => useSelectedPopulationData())
      const mockData = createMockPopulationData(1)

      vi.mocked(apiClient.api.population.$get).mockResolvedValueOnce(createMockResponse(mockData))

      await act(async () => {
        await result.current.addPopulationData(1)
      })

      expect(result.current.populationData).toEqual([mockData])
      expect(apiClient.api.population.$get).toHaveBeenCalledWith({
        query: { prefCode: '1' },
      })
    })

    it('複数の都道府県の人口データが正常に追加されること', async () => {
      const { result } = renderHook(() => useSelectedPopulationData())
      const mockData1 = createMockPopulationData(1)
      const mockData2 = createMockPopulationData(2)

      vi.mocked(apiClient.api.population.$get)
        .mockResolvedValueOnce(createMockResponse(mockData1))
        .mockResolvedValueOnce(createMockResponse(mockData2))

      await act(async () => {
        await result.current.addPopulationData(1)
        await result.current.addPopulationData(2)
      })

      expect(result.current.populationData).toEqual([mockData1, mockData2])
    })

    it('deletePopulationDataで指定した都道府県の人口データが正常に削除されること', async () => {
      const { result } = renderHook(() => useSelectedPopulationData())
      const mockData = createMockPopulationData(1)

      vi.mocked(apiClient.api.population.$get).mockResolvedValueOnce(createMockResponse(mockData))

      await act(async () => {
        await result.current.addPopulationData(1)
      })

      act(() => {
        result.current.deletePopulationData(1)
      })

      expect(result.current.populationData).toEqual([])
    })
  })

  describe('異常系', () => {
    it('APIがネットワークエラーを返した場合、NetworkErrorがスローされること', async () => {
      const { result } = renderHook(() => useSelectedPopulationData())

      vi.mocked(apiClient.api.population.$get).mockResolvedValueOnce(
        createMockResponse(createMockPopulationData(1), 424, false),
      )

      await expect(result.current.addPopulationData(1)).rejects.toThrow(NetworkError)
    })

    it('APIが予期せぬエラーを返した場合、HttpErrorがスローされること', async () => {
      const { result } = renderHook(() => useSelectedPopulationData())

      vi.mocked(apiClient.api.population.$get).mockResolvedValueOnce(
        createMockResponse(createMockPopulationData(1), 500, false),
      )

      await expect(result.current.addPopulationData(1)).rejects.toThrow(HttpError)
    })
  })
})
