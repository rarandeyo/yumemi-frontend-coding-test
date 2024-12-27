import type React from 'react'

export const handlePrefectureCheckboxes = (
  prefCode: number,
  setSelectedPrefs: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  setSelectedPrefs((prev) => {
    const newState = prev.includes(prefCode)
      ? prev.filter((code) => code !== prefCode)
      : [...prev, prefCode]

    return newState
  })
}
