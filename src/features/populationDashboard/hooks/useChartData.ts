import type { PopulationLabelType } from '@/features/populationDashboard/types/PopulationLabelSchema'
import type { PopulationDataWithPrefCode } from '@/features/populationDashboard/types/PopulationSchema'

type ChartDataType = {
  year: number
  [prefCode: number]: number
}

type UseChartDataReturn = {
  chartData: ChartDataType[]
}

export const useChartData = (
  selectedLabel: PopulationLabelType,
  populationData: PopulationDataWithPrefCode[],
): UseChartDataReturn => {
  if (populationData.length === 0) return { chartData: [] }

  const filteredPopulationData = populationData.map(({ prefCode, data }) => ({
    prefCode,
    data: data.find(({ label }) => label === selectedLabel)?.data ?? [],
  }))

  // 最初の都道府県データを基準として共通の年リストを取得
  const years = filteredPopulationData[0]?.data.map(({ year }) => year) || []

  const chartData = years.map((year) => {
    // 年ごとの初期データを生成
    const rowData: ChartDataType = { year }

    for (const { prefCode, data } of filteredPopulationData) {
      const populationValue = data.find((entry) => entry.year === year)?.value ?? 0
      rowData[prefCode] = populationValue
    }

    return rowData
  })

  return { chartData }
}
