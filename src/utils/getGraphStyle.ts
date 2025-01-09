import { GRAPH_COLOR_PALETTE } from '@/constants/graphColorPalette'
import type { PrefectureState } from '@/types/PrefecturesSchema'

export const getLineColor = (prefCode: number): string => {
  return GRAPH_COLOR_PALETTE[prefCode % GRAPH_COLOR_PALETTE.length]
}

export const getPrefectureName = (
  prefectureStates: PrefectureState[],
  prefCode: number,
): string => {
  return prefectureStates.find((pref) => pref.prefCode === prefCode)?.prefName ?? 'undefined'
}
