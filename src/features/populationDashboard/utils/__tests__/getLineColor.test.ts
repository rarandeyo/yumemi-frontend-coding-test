import { GRAPH_COLOR_PALETTE } from '@/features/populationDashboard/constants/graphColorPalette'
import { getLineColor } from '@/features/populationDashboard/utils/getLineColor'
import { describe, expect, it } from 'vitest'

describe('getLineColor', () => {
  it('都道府県コードに対して、パレットから正しい色を返すこと', () => {
    expect(getLineColor(1)).toBe('#003f5c')
    expect(getLineColor(2)).toBe('#58508d')
    expect(getLineColor(3)).toBe('#bc5090')
    expect(getLineColor(17)).toBe('#fb5607')
  })

  it('パレットの長さを超えるprefCodeの場合、循環して色を返すこと', () => {
    const paletteLength = GRAPH_COLOR_PALETTE.length
    expect(getLineColor(paletteLength + 1)).toBe('#003f5c')
    expect(getLineColor(paletteLength + 2)).toBe('#58508d')
  })
})
