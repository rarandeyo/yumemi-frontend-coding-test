import { z } from 'zod'

export const POPULATION_LABELS = ['総人口', '生産年齢人口', '老年人口', '年少人口'] as const

export const PopulationLabelSchema = z.enum(POPULATION_LABELS)

export type PopulationLabelType = z.infer<typeof PopulationLabelSchema>
