import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { HttpStatusCode, httpStatusName } from '~/base/common/enums'
import { HttpException } from '~/base/common/exceptions'
import { FailedResponseBody } from '~/base/common/types'
import { Logger } from '~/base/common/utils'

export const HttpExceptionHandler: ErrorRequestHandler<Record<string, string>, FailedResponseBody> = (
  err: Error,
  _,
  res,
  next
) => {
  const logger = new Logger(HttpExceptionHandler.name)
  if (err instanceof HttpException) {
    const { statusCode, message, errorName } = err

    logger.error(`http exception: ${message}`)
    res.status(statusCode).json({
      statusCode,
      errorName,
      ...(message && { messages: [message] })
    })
    return next()
  }

  if (err instanceof ZodError) {
    const message = fromZodError(err)
      .message.replaceAll('Validation error: ', '')
      .split('; ')
      .map((msg) => msg.replaceAll('"', '`'))

    logger.error(`zod error: ${message}`)
    res.status(HttpStatusCode.BAD_REQUEST).json({
      statusCode: HttpStatusCode.BAD_REQUEST,
      errorName: httpStatusName[HttpStatusCode.BAD_REQUEST],
      message
    })
    return next()
  }

  logger.error(err)
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    errorName: httpStatusName[HttpStatusCode.INTERNAL_SERVER_ERROR],
    message: [err.message]
  })
  return next()
}
