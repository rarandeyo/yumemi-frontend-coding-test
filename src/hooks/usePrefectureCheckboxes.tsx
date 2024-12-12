import { useState } from 'react'

export const usePrefectureCheckboxes = (): {
  selectedPrefCodes: number[]
  handlePrefectureCheckboxes: (prefCode: number) => void
} => {
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([])

  const handlePrefectureCheckboxes = (prefCode: number) => {
    setSelectedPrefCodes((prev) => {
      const isPrefCodeSelected = prev.includes(prefCode)

      if (isPrefCodeSelected) {
        return prev.filter((code) => code !== prefCode)
      }

      return [...prev, prefCode]
    })
  }

  return {
    selectedPrefCodes,
    handlePrefectureCheckboxes,
  }
}
