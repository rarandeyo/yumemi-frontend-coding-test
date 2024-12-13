import { z } from 'zod'
import { PopulationLabelSchema } from './PopulationLabelSchema'
import { PrefectureSchema } from './PrefecturesSchema'

const PopulationCompositionPerYearSchema = z.object({
  boundaryYear: z.number().int(),
  data: z.array(
    z.object({
      label: PopulationLabelSchema,
      data: z.array(
        z.object({
          year: z.number().int(),
          value: z.number().int(),
          rate: z.number().optional(),
        }),
      ),
    }),
  ),
})

const PopulationDataWithPrefCodeSchema = PopulationCompositionPerYearSchema.extend({
  prefCode: PrefectureSchema.shape.prefCode,
})

export const PopulationCompositionPerYearResponseSchema = z.object({
  message: z.null(),
  result: PopulationCompositionPerYearSchema,
})

export type PopulationDataWithPrefCode = z.infer<typeof PopulationDataWithPrefCodeSchema>
