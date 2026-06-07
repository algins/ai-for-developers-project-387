import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.union([
    z.string().url(),
    z.string().startsWith('/'),
  ]).default('/'),
})

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/',
})
