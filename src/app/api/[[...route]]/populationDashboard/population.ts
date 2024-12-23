import { PrefectureSchema } from '@/features/populationDashboard/types/PrefectureSchema'
import { getPopulationData } from '@/features/populationDashboard/utils/getPopulationData'
import { NetworkError } from '@/types/Errors'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const PopulationListParamsSchema = z.object({
  prefCode: z.coerce.number().pipe(PrefectureSchema.shape.prefCode),
})

const app = new Hono().get(
  '/',
  zValidator('query', PopulationListParamsSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid prefCode' }, 400)
    }
  }),
  async (c) => {
    const { prefCode } = c.req.valid('query')

    try {
      const populationData = await getPopulationData(prefCode)
      return c.json(populationData)
    } catch (error: unknown) {
      if (error instanceof NetworkError) {
        return c.json({ error: 'External API Network Error' }, 424)
      }
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  },
)

export default app
