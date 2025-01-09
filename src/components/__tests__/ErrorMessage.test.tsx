import { ErrorMessage } from '@/components/ErrorMessage'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('ErrorMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('messageが存在する場合、エラーメッセージが表示されること', () => {
      const testMessage = 'テストエラーメッセージ'
      render(
        <ErrorMessage
          message={testMessage}
          onClose={() => {
            ''
          }}
        />,
      )

      expect(screen.getByText(testMessage)).toBeInTheDocument()
    })

    it('閉じるボタンをクリックした場合、onClose関数が実行されること', () => {
      const onClose = vi.fn()
      render(<ErrorMessage message="テストメッセージ" onClose={onClose} />)

      const closeButton = screen.getByRole('button', { name: '閉じる' })
      fireEvent.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('異常系', () => {
    it('messageがnullの場合、何も表示されないこと', () => {
      render(
        <ErrorMessage
          message={null}
          onClose={() => {
            ''
          }}
        />,
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
