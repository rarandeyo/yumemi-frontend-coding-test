import { CHART_STYLES } from '@/constants/chartStyles'
import type { PopulationLabelType } from '@/types/PopulationLabelSchema'
import type { PopulationDataWithPrefCode } from '@/types/PopulationSchema'
import type { PrefectureState } from '@/types/PrefecturesSchema'
import { getChartData } from '@/utils/getChartData'
import {
  formatPopulation,
  formatTooltipLabel,
  getLineColor,
  getPrefectureName,
} from '@/utils/getGraphStyle'
import React from 'react'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type PopulationGraphProps = {
  prefectureStates: PrefectureState[]
  populationData: PopulationDataWithPrefCode[]
  selectedLabel: PopulationLabelType
}

export const PopulationGraph = React.memo<PopulationGraphProps>(
  ({ prefectureStates, populationData, selectedLabel }) => {
    const chartData = getChartData(selectedLabel, populationData)

    return (
      <div className="mx-auto w-full rounded-2xl bg-light-blue sm:p-4 md:p-6 lg:p-8">
        <div className="h-[400px] w-full md:h-[500px] lg:h-[600px] xl:h-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.5)" />
              <XAxis dataKey="year" tick={CHART_STYLES.axis} />
              <YAxis tick={CHART_STYLES.axis} tickFormatter={formatPopulation} />
              <Tooltip formatter={formatPopulation} labelFormatter={formatTooltipLabel} />
              <Legend
                verticalAlign="top"
                wrapperStyle={CHART_STYLES.legend}
                layout="horizontal"
                align="center"
              />
              {populationData.map((prefecture) => (
                <Line
                  key={prefecture.prefCode}
                  type="monotone"
                  dataKey={prefecture.prefCode}
                  name={getPrefectureName(prefectureStates, prefecture.prefCode)}
                  stroke={getLineColor(prefecture.prefCode)}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  },
)
