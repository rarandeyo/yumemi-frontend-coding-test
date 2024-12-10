import { z } from 'zod'

const PrefectureSchema = z.object({
  prefCode: z.number(),
  prefName: z.string(),
})

export const PrefecturesSchema = z.array(PrefectureSchema).length(47)

export const PrefecturesResponseSchema = z.object({
  message: z.null(),
  result: PrefecturesSchema,
})

export type Prefectures = z.infer<typeof PrefecturesSchema>
export type PrefecturesResponse = z.infer<typeof PrefecturesResponseSchema>
