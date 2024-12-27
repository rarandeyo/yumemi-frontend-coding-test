import type { Prefectures } from '@/types/PrefecturesSchema'
import { getPrefectures } from '@/utils/getPrefectures'

export default async function Home() {
  const Prefectures: Prefectures = await getPrefectures()
  return (
    <main className="flex flex-col">
      {Prefectures.map((pref) => (
        <div key={pref.prefName} className="text-lg">
          {pref.prefName}
        </div>
      ))}
    </main>
  )
}
