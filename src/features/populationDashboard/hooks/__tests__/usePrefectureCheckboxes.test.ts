import { usePrefectureCheckboxes } from '@/features/populationDashboard/hooks/usePrefectureCheckboxes'
import type { Prefecture } from '@/features/populationDashboard/types/PrefectureSchema'
import { NetworkError } from '@/types/Errors'
import { act, renderHook } from '@testing-library/react'
import type React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockPrefectures: Prefecture[] = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
]

const mockAddPopulationData = vi.fn()
const mockDeletePopulationData = vi.fn()

vi.mock('@/features/populationDashboard/hooks/useSelectedPopulationList', () => ({
  useSelectedPopulationList: () => ({
    populationData: [],
    addPopulationData: mockAddPopulationData,
    deletePopulationData: mockDeletePopulationData,
  }),
}))

describe('usePrefectureCheckboxes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('初期状態で全ての都道府県が未選択であること', () => {
      const { result } = renderHook(() => usePrefectureCheckboxes(mockPrefectures))

      expect(result.current.prefectureStates).toEqual([
        { prefCode: 1, prefName: '北海道', isSelected: false },
        { prefCode: 2, prefName: '青森県', isSelected: false },
      ])
    })

    it('チェックボックスを選択したとき、対応する都道府県のデータが追加されること', async () => {
      mockAddPopulationData.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => usePrefectureCheckboxes(mockPrefectures))

      const mockEvent = {
        currentTarget: {
          checked: true,
          value: '1',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      await act(async () => {
        await result.current.handlePrefectureCheckboxes(mockEvent)
      })

      expect(mockAddPopulationData).toHaveBeenCalledWith(1)
      expect(result.current.prefectureStates[0].isSelected).toBe(true)
    })

    it('チェックボックスの選択を解除したとき、対応する都道府県のデータが削除されること', async () => {
      mockAddPopulationData.mockResolvedValueOnce(undefined)
      const { result } = renderHook(() => usePrefectureCheckboxes(mockPrefectures))

      await act(async () => {
        await result.current.handlePrefectureCheckboxes({
          currentTarget: { checked: true, value: '1' },
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      })

      await act(async () => {
        await result.current.handlePrefectureCheckboxes({
          currentTarget: { checked: false, value: '1' },
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      })

      expect(mockDeletePopulationData).toHaveBeenCalledWith(1)
      expect(result.current.prefectureStates[0].isSelected).toBe(false)
    })
  })

  describe('異常系', () => {
    it('ネットワークエラー発生時にエラーメッセージが設定されること', async () => {
      mockAddPopulationData.mockRejectedValueOnce(new NetworkError('ネットワークエラー'))

      const { result } = renderHook(() => usePrefectureCheckboxes(mockPrefectures))

      const mockEvent = {
        currentTarget: {
          checked: true,
          value: '1',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      await act(async () => {
        try {
          await result.current.handlePrefectureCheckboxes(mockEvent)
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
        }
      })

      expect(result.current.error).toBe(
        'ネットワークエラーが発生しました。時間をおいて再度お試しください。',
      )
    })

    it('同じprefCodeの処理中は新しいリクエストを無視すること', async () => {
      let isProcessing = false

      mockAddPopulationData.mockImplementation(async () => {
        if (isProcessing) {
          // 2回目以降のリクエストは無視される
          return
        }
        isProcessing = true
        await new Promise((resolve) => setTimeout(resolve, 100))
        isProcessing = false
      })

      const { result } = renderHook(() => usePrefectureCheckboxes(mockPrefectures))

      const mockEvent = {
        currentTarget: {
          checked: true,
          value: '1',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      // 同時に2回呼び出し
      await act(async () => {
        const [promise1, promise2] = await Promise.allSettled([
          result.current.handlePrefectureCheckboxes(mockEvent),
          result.current.handlePrefectureCheckboxes(mockEvent),
        ])

        expect(promise1.status).toBe('fulfilled')
        expect(promise2.status).toBe('fulfilled')
      })

      expect(mockAddPopulationData).toHaveBeenCalledTimes(1)
      expect(result.current.prefectureStates[0].isSelected).toBe(true)
    })
  })
})
