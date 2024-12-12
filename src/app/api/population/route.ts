import { getPopulationData } from '@/utils/getPopulationDataList'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const populationListParamsSchema = z.number().min(1).max(47)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const prefCode = Number(searchParams.get('prefCode'))

  try {
    const validatedPrefCode = populationListParamsSchema.parse(prefCode)
    const populationList = await getPopulationData(validatedPrefCode)
    return NextResponse.json(populationList)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid prefCode' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
