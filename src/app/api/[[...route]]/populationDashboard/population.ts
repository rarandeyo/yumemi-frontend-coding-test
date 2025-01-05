import { PrefectureSchema } from '@/types/PrefecturesSchema'
import { getPopulationData } from '@/utils/getPopulationData'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {} from 'next/server'
import { z } from 'zod'

const PopulationDataParamsSchema = z.object({
  prefCode: z.coerce.number().pipe(PrefectureSchema.shape.prefCode),
})

const app = new Hono().get(
  '/',
  zValidator('query', PopulationDataParamsSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid prefCode' }, 400)
    }
  }),
  async (c) => {
    const { prefCode } = c.req.valid('query')
    try {
      const populationData = await getPopulationData(prefCode)
      return c.json(populationData)
    } catch (error) {
      return c.json({ error: 'Internal Server Error' }, 500)
    }
  },
)

export default app
