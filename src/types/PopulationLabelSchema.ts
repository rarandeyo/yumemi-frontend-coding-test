import { z } from 'zod'

export const PopulationLabelSchema = z.object({
  ja: z.enum(['総人口', '生産年齢人口', '老年人口', '年少人口']),
  en: z.enum(['TOTAL', 'WORKING', 'ELDERLY', 'YOUNG']),
})

export type JaPopulationLabel = z.infer<typeof PopulationLabelSchema>['ja']
export type EnPopulationLabel = z.infer<typeof PopulationLabelSchema>['en']
