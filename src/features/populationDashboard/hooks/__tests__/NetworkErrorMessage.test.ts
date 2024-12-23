import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNetworkErrorMessage } from '../NetworkErrorMessage'

describe('useNetworkErrorMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初期状態ではエラーがnullであること', () => {
    const { result } = renderHook(() => useNetworkErrorMessage())
    expect(result.current.error).toBeNull()
  })

  it('showErrorでエラーメッセージを設定できること', () => {
    const { result } = renderHook(() => useNetworkErrorMessage())

    act(() => {
      result.current.showError('テストエラー')
    })

    expect(result.current.error).toBe('テストエラー')
  })

  it('clearErrorでエラーメッセージをクリアできること', () => {
    const { result } = renderHook(() => useNetworkErrorMessage())

    act(() => {
      result.current.showError('テストエラー')
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('指定時間後に自動的にエラーメッセージがクリアされること', () => {
    const { result } = renderHook(() => useNetworkErrorMessage(1000))

    act(() => {
      result.current.showError('テストエラー')
    })

    expect(result.current.error).toBe('テストエラー')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.error).toBeNull()
  })
})
