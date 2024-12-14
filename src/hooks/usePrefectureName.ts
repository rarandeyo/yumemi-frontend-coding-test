import type { PrefectureState } from '@/types/PrefecturesSchema'
import { useCallback } from 'react'

export const useGetPrefectureName = (
  prefectureStates: PrefectureState[],
): {
  getPrefectureName: (prefCode: number) => string
} => {
  const getPrefectureName = useCallback(
    (prefCode: number): string => {
      return prefectureStates.find((pref) => pref.prefCode === prefCode)?.prefName ?? 'undefined'
    },
    [prefectureStates],
  )

  return { getPrefectureName }
}
