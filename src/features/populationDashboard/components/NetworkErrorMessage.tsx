import type React from 'react'

type ErrorMessageProps = {
  message: string | null
  onClose: () => void
}

export const NetworkErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="-translate-x-1/2 fixed top-4 left-1/2 z-50 transform">
      <div className="flex items-center rounded-md bg-red-100 px-4 py-3 text-red-700 shadow-md">
        <p>{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-4 rounded-full p-1 hover:bg-red-200"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
