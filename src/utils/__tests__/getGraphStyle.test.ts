import { GRAPH_COLOR_PALETTE } from '@/constants/graphColorPalette'
import type { PrefectureState } from '@/types/PrefecturesSchema'
import { getLineColor, getPrefectureName } from '@/utils/getGraphStyle'
import { beforeEach, describe, expect, it } from 'vitest'

describe('getGraphStyle', () => {
  const createMockPrefectureStates = (): PrefectureState[] => [
    { prefCode: 1, prefName: '北海道', isSelected: true },
    { prefCode: 2, prefName: '青森県', isSelected: false },
  ]

  let mockPrefectureStates: PrefectureState[]

  beforeEach(() => {
    mockPrefectureStates = createMockPrefectureStates()
  })

  describe('getLineColor', () => {
    describe('正常系', () => {
      it('カラーパレットの範囲内の色が正常に返却されること', () => {
        const prefCode = 1
        const result = getLineColor(prefCode)
        expect(result).toBe(GRAPH_COLOR_PALETTE[prefCode % GRAPH_COLOR_PALETTE.length])
      })

      it('カラーパレットの長さを超えた場合、循環して色が正常に返却されること', () => {
        const prefCode = GRAPH_COLOR_PALETTE.length + 1
        const result = getLineColor(prefCode)
        expect(result).toBe(GRAPH_COLOR_PALETTE[1])
      })
    })
  })

  describe('getPrefectureName', () => {
    describe('正常系', () => {
      it('存在する都道府県コードに対して正しい都道府県名が返却されること', () => {
        const result = getPrefectureName(mockPrefectureStates, 1)
        expect(result).toBe('北海道')
      })
    })

    describe('異常系', () => {
      it('存在しない都道府県コードに対してundefinedが返却されること', () => {
        const result = getPrefectureName(mockPrefectureStates, 99)
        expect(result).toBe('undefined')
      })

      it('都道府県リストが空の場合、undefinedが返却されること', () => {
        const result = getPrefectureName([], 1)
        expect(result).toBe('undefined')
      })
    })
  })
})
