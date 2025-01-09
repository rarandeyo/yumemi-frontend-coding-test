import { useSelectPopulationLabel } from '@/hooks/useSelectPopulationLabel'
import { act, renderHook } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'

describe('usePopulationLabel', () => {
  it('初期状態で"総人口"が選択されていること', () => {
    const { result } = renderHook(() => useSelectPopulationLabel())
    expect(result.current.selectedLabel).toBe('総人口')
  })

  it('handlePopulationLabelで選択値を変更できること', () => {
    const { result } = renderHook(() => useSelectPopulationLabel())

    act(() => {
      result.current.handlePopulationLabel({
        currentTarget: { value: '年少人口' },
      } as unknown as React.ChangeEvent<HTMLSelectElement>)
    })

    expect(result.current.selectedLabel).toBe('年少人口')
  })

  it('無効な値が渡された場合、選択値が変更されないこと', () => {
    const { result } = renderHook(() => useSelectPopulationLabel())

    act(() => {
      result.current.handlePopulationLabel({
        currentTarget: { value: '無効な値' },
      } as unknown as React.ChangeEvent<HTMLSelectElement>)
    })

    expect(result.current.selectedLabel).toBe('総人口')
  })
})
