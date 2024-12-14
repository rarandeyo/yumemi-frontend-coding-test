import { PopulationDashboard } from '@/features/populationDashboard/components'
import { getPrefectures } from '@/features/populationDashboard/utils/getPrefectures'

export default async function Home() {
  const prefectures = await getPrefectures()

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col space-y-2 px-4 md:space-y-4 md:px-6">
      <PopulationDashboard prefectures={prefectures} />
    </main>
  )
}
