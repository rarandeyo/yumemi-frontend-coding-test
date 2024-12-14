import { GRAPH_COLOR_PALETTE } from '@/features/population/constants/graphColorPalette'

export const getLineColor = (prefCode: number): string => {
  return GRAPH_COLOR_PALETTE[prefCode % GRAPH_COLOR_PALETTE.length]
}
