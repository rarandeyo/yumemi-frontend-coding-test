import { z } from 'zod'
import { PopulationLabelSchema } from './PopulationLabelSchema'
const PopulationDataSchema = z.object({
  year: z.number(),
  value: z.number(),
  rate: z.number().optional(),
})

const PopulationCategorySchema = z.object({
  label: PopulationLabelSchema,
  data: z.array(PopulationDataSchema),
})

const PopulationResultSchema = z.object({
  boundaryYear: z.number(),
  data: z.array(PopulationCategorySchema).length(4),
})

export const PopulationDataResponseSchema = z.object({
  message: z.null(),
  result: PopulationResultSchema,
})

export type PopulationResult = z.infer<typeof PopulationResultSchema>
