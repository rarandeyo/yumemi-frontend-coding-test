import { PrefectureCheckboxes } from '@/components/PrefectureCheckboxes'
import type { Prefectures } from '@/types/PrefecturesSchema'
import { getPrefectures } from '@/utils/getPrefectures'

export default async function Home() {
  const Prefectures: Prefectures = await getPrefectures()
  return (
    <main className="flex flex-col">
      <PrefectureCheckboxes prefectures={Prefectures} />
    </main>
  )
}
