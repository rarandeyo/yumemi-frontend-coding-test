import { GRAPH_COLOR_PALETTE } from '@/features/populationDashboard/constants/graphColorPalette'

export const getLineColor = (prefCode: number): string => {
  const index = (prefCode - 1) % GRAPH_COLOR_PALETTE.length
  return GRAPH_COLOR_PALETTE[index]
}
