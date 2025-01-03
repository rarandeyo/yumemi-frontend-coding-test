import { z } from 'zod'

export const POPULATION_LABELS = ['総人口', '生産年齢人口', '老年人口', '年少人口'] as const
export const POPULATION_LABELS_EN = ['TOTAL', 'WORKING', 'ELDERLY', 'YOUNG'] as const

export const PopulationLabelSchema = z.object({
  ja: z.enum(POPULATION_LABELS),
  en: z.enum(POPULATION_LABELS_EN),
})

export type JaPopulationLabelType = z.infer<typeof PopulationLabelSchema>['ja']
export type EnPopulationLabelType = z.infer<typeof PopulationLabelSchema>['en']
