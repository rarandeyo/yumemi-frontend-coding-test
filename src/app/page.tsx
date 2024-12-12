import { PopulationDashboard } from '@/components/PopulationDashboard'
import { getPrefectures } from '@/utils/getPrefectures'

export default async function Home() {
  const prefectures = await getPrefectures()
  const defaultPrefectureStates = prefectures.map((pref) => ({
    isSelected: false,
    ...pref,
  }))

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col space-y-2 px-4 md:space-y-4 md:px-6">
      <PopulationDashboard defaultPrefectureStates={defaultPrefectureStates} />
    </main>
  )
}
