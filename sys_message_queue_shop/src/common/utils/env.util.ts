import { config } from 'dotenv'
// import { existsSync } from 'fs'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { Logger } from '~/common/utils/logger.util'
const logger = new Logger('Env')

config({
  path: ['.env.local', '.env']
})

// coerce => auto convert the value to the desired type
const envSchema = z.object({
  PORT: z.coerce.number().positive(),
  DEV_APP_PORT: z.coerce.number().positive(),
  // MONGODB
  DEV_DB_HOST: z.string(),
  DEV_DB_PORT: z.coerce.number().positive(),
  DEV_DB_NAME: z.string(),
  // RabbitMQ
  ACCOUNT_RABBITMQ_HOST: z.string(),
  ACCOUNT_RABBITMQ_PORT: z.coerce.number().positive(),
  ACCOUNT_RABBITMQ: z.string(),
  ACCOUNT_RABBITMQ_PASSWORD: z.string()
})

// safeParse => returns a result object with the parsed value or an error
const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  const validationError = fromZodError(parseResult.error)
  logger.error(`Error parsing environment variables: ${validationError}`)
  process.exit(1)
}

export const envVariables = parseResult.data
