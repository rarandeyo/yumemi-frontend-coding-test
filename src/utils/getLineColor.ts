import { GRAPH_COLOR_PALETTE } from '@/constants/graphColorPalette'

export const getLineColor = (prefCode: number): string => {
  return GRAPH_COLOR_PALETTE[prefCode % GRAPH_COLOR_PALETTE.length]
}
