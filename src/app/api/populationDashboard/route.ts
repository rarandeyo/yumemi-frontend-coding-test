import { PrefectureSchema } from '@/features/populationDashboard/types/PrefectureSchema'
import { getPopulationData } from '@/features/populationDashboard/utils/getPopulationData'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const PopulationListParamsSchema = PrefectureSchema.shape.prefCode

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const prefCode = Number(searchParams.get('prefCode'))

  try {
    const validatedPrefCode = PopulationListParamsSchema.parse(prefCode)
    const populationData = await getPopulationData(validatedPrefCode)
    return NextResponse.json(populationData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid prefCode' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
