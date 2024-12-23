import { useSelectedPopulationList } from '@/features/populationDashboard/hooks/useSelectedPopulationList'
import type { PopulationLabelType } from '@/features/populationDashboard/types/PopulationLabelSchema'
import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'
import { apiClient } from '@/libs/apiClient'
import { HttpError, NetworkError } from '@/types/Errors'
import { act, renderHook } from '@testing-library/react'
import type { ClientResponse } from 'hono/client'
import type { StatusCode } from 'hono/utils/http-status'
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

describe('useSelectedPopulationList', () => {
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
    status: StatusCode = 200,
    ok = true,
  ): ClientResponse<PopulationDataWithPrefCode, StatusCode, 'json'> => {
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
    }
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('正常系', () => {
    it('初期状態で空の配列を返すこと', () => {
      const { result } = renderHook(() => useSelectedPopulationList())
      expect(result.current.populationData).toEqual([])
    })

    it('addPopulationDataで人口データを追加できること', async () => {
      const { result } = renderHook(() => useSelectedPopulationList())
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

    it('複数の都道府県の人口データを追加できること', async () => {
      const { result } = renderHook(() => useSelectedPopulationList())
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

    it('deletePopulationDataで指定した都道府県の人口データを削除できること', async () => {
      const { result } = renderHook(() => useSelectedPopulationList())
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
    it('APIがネットワークエラーを返した場合、NetworkErrorをスローすること', async () => {
      const { result } = renderHook(() => useSelectedPopulationList())

      vi.mocked(apiClient.api.population.$get).mockResolvedValueOnce(
        createMockResponse(createMockPopulationData(1), 424, false),
      )

      await expect(result.current.addPopulationData(1)).rejects.toThrow(NetworkError)
    })

    it('APIが他のエラーステータスコードを返した場合、HttpErrorをスローすること', async () => {
      const { result } = renderHook(() => useSelectedPopulationList())

      vi.mocked(apiClient.api.population.$get).mockResolvedValueOnce(
        createMockResponse(createMockPopulationData(1), 500, false),
      )

      await expect(result.current.addPopulationData(1)).rejects.toThrow(HttpError)
    })
  })
})
