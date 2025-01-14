import type { PrefectureState } from '@/types/PrefecturesSchema'
import React from 'react'

type PrefectureCheckboxesProps = {
  prefectureStates: PrefectureState[]
  handlePrefectureCheckboxes: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const PrefectureCheckboxes = React.memo<PrefectureCheckboxesProps>(
  ({ prefectureStates, handlePrefectureCheckboxes }) => {
    return (
      <section className="mx-auto flex flex-wrap rounded-2xl border border-gray-300 bg-light-blue p-4 shadow-md md:p-6 lg:p-8">
        {prefectureStates.map((pref) => (
          <div key={pref.prefCode} className="w-1/2 p-1.5 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <label className="flex items-center space-x-1.5 hover:cursor-pointer md:space-x-2">
              <input
                className="form-checkbox h-4 w-4 text-blue-600 md:h-5 md:w-5"
                type="checkbox"
                value={pref.prefCode}
                checked={pref.isSelected}
                onChange={handlePrefectureCheckboxes}
              />
              <span className="text-base md:text-lg">{pref.prefName}</span>
            </label>
          </div>
        ))}
      </section>
    )
  },
)
