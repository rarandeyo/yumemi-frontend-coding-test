import 'server-only'

type ApiConfig = {
  baseUrl: string
  apiKey: string
}

export const getApiConfig = (): ApiConfig => {
  const baseUrl = process.env.YUMEMI_BASE_URL
  const apiKey = process.env.YUMEMI_API_KEY

  if (!baseUrl) {
    throw new Error('YUMEMI_BASE_URL is not defined')
  }
  if (!apiKey) {
    throw new Error('YUMEMI_API_KEY is not defined')
  }

  return { baseUrl, apiKey }
}
