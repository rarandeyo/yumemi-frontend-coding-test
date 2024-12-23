import { useCallback, useEffect, useState } from 'react'

type UseErrorMessageReturn = {
  error: string | null
  showError: (message: string) => void
  clearError: () => void
}

export const useNetworkErrorMessage = (autoHideDuration = 3000): UseErrorMessageReturn => {
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const showError = useCallback((message: string) => {
    setError(message)
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [error, clearError, autoHideDuration])

  return {
    error,
    showError,
    clearError,
  }
}
