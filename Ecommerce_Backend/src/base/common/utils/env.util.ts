import { config } from 'dotenv'
// import { existsSync } from 'fs'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

config({
  path: ['.env.local', '.env']
})

// coerce => auto convert the value to the desired type
const envSchema = z.object({
  PORT: z.coerce.number().positive(),
  DEV_APP_PORT: z.coerce.number().positive(),
  DEV_DB_HOST: z.string(),
  DEV_DB_PORT: z.coerce.number().positive(),
  DEV_DB_NAME: z.string(),
  PRO_APP_PORT: z.coerce.number().positive(),
  PRO_DB_HOST: z.string(),
  PRO_DB_PORT: z.coerce.number().positive(),
  PRO_DB_NAME: z.string(),
  CLOUD_REDIS_NAME: z.string(),
  CLOUD_REDIS_PASSWORD: z.string(),
  CLOUD_REDIS_PORT: z.coerce.number().positive(),
  DISCORD_BOT_TOKEN: z.string(),
  DISCORD_CHANNEL_ID: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().positive(),
  REDIS_PASSWORD: z.string()
})

// safeParse => returns a result object with the parsed value or an error
const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  const validationError = fromZodError(parseResult.error)
  console.log('Error parsing environment variables:', validationError)
  process.exit(1)
}

export const envVariables = parseResult.data
