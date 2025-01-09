import type { PopulationLabelType } from '@/types/PopulationLabelSchema'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'

type ChartDataType = {
  year: number
  [prefCode: number]: number
}

export const getChartData = (
  selectedLabel: PopulationLabelType,
  populationData: PopulationDataWithPrefCode[],
): ChartDataType[] => {
  if (populationData.length === 0) return []

  const filteredPopulationData = populationData.map(({ prefCode, data }) => ({
    prefCode,
    data: data.find(({ label }) => label === selectedLabel)?.data ?? [],
  }))

  // 最初の都道府県データを基準として共通の年リストを取得
  const years = filteredPopulationData[0]?.data.map(({ year }) => year) || []

  return years.map((year) => {
    // 年ごとの初期データを生成
    const rowData: ChartDataType = { year }
    for (const { prefCode, data } of filteredPopulationData) {
      const populationValue = data.find((entry) => entry.year === year)?.value ?? 0
      rowData[prefCode] = populationValue
    }
    return rowData
  })
}
