import { useGetPrefectureName } from '@/features/populationDashboard/hooks/usePrefectureName'
import type { PrefectureState } from '@/features/populationDashboard/types/PrefectureSchema'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('useGetPrefectureName', () => {
  const mockPrefectureStates: PrefectureState[] = [
    { prefCode: 1, prefName: '北海道', isSelected: false },
    { prefCode: 2, prefName: '青森県', isSelected: true },
    { prefCode: 3, prefName: '岩手県', isSelected: false },
  ]

  it('存在する都道府県コードに対して、正しい都道府県名を返すこと', () => {
    const { result } = renderHook(() => useGetPrefectureName(mockPrefectureStates))

    expect(result.current.getPrefectureName(1)).toBe('北海道')
    expect(result.current.getPrefectureName(2)).toBe('青森県')
    expect(result.current.getPrefectureName(3)).toBe('岩手県')
  })
})
