import population from '@/app/api/[[...route]]/populationDashboard/population'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'
const app = new Hono().basePath('/api')

const route = app.route('/population', population)

export const GET = handle(app)

export type AppType = typeof route
