import type { PopulationLabelType } from '@/types/PopulationLabelSchema'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'

type ChartDataType = {
  year: number
  [key: number]: number
}

type UseChartDataReturn = {
  chartData: ChartDataType[]
}

export const useChartData = (
  selectedLabel: PopulationLabelType,
  populationData: PopulationDataWithPrefCode[],
): UseChartDataReturn => {
  if (populationData.length === 0) return { chartData: [] }

  const populationListFilterLabel = populationData.map((population) => ({
    prefCode: population.prefCode,
    data: population.data.find((data) => data.label === selectedLabel)?.data ?? [],
  }))

  const years = populationListFilterLabel[0].data.map((dataPerYear) => dataPerYear.year)

  const chartData = years.map((year) => {
    const rowData: ChartDataType = { year }

    for (const populationFilterLabel of populationListFilterLabel) {
      const prefCode = populationFilterLabel.prefCode
      const populationValue =
        populationFilterLabel.data.find((dataPerYear) => dataPerYear.year === year)?.value ?? 0
      rowData[prefCode] = populationValue
    }

    return rowData
  })

  return { chartData }
}
