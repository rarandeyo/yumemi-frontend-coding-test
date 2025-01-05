import { z } from 'zod'

export const BASE_URL = z
  .string()
  .url()
  .catch('http://localhost:3000')
  .parse(process.env.NEXT_PUBLIC_BASE_URL)
