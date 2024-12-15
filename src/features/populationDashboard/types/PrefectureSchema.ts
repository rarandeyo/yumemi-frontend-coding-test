import { z } from 'zod'

export const PrefectureSchema = z.object({
  prefCode: z.number().int().min(1).max(47),
  prefName: z.string(),
})

const PrefectureStateSchema = PrefectureSchema.extend({
  isSelected: z.boolean(),
})

export const PrefecturesResponseSchema = z.object({
  message: z.null(),
  result: PrefectureSchema.array(),
})

export type Prefecture = z.infer<typeof PrefectureSchema>
export type PrefectureState = z.infer<typeof PrefectureStateSchema>
