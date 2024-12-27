import { PrefectureCheckboxes } from '@/components/PrefectureCheckboxes'
import type { Prefectures } from '@/types/PrefecturesSchema'
import { getPrefectures } from '@/utils/getPrefectures'

export default async function Home() {
  const Prefectures: Prefectures = await getPrefectures()
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col space-y-2 px-4 md:space-y-4 md:px-6">
      <PrefectureCheckboxes prefectures={Prefectures} />
    </main>
  )
}
