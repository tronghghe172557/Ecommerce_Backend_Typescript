import type { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { HttpStatusCode, httpStatusName } from '~/common/enums'
import { HttpException } from '~/common/exceptions'
import { FailedResponseBody } from '~/common/types'
import { Logger } from '~/common/utils'

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

  // Handle Mongoose errors
  if (err instanceof mongoose.Error.ValidationError) {
    // Mongoose validation error
    const errors = Object.values(err.errors).map((error) => error.message)

    logger.error(`mongoose validation error: ${errors.join(', ')}`)
    res.status(HttpStatusCode.BAD_REQUEST).json({
      statusCode: HttpStatusCode.BAD_REQUEST,
      errorName: 'Validation Error',
      message: errors
    })
    return next()
  }

  // Handle other Mongoose errors
  if (err instanceof mongoose.Error) {
    logger.error(`mongoose error: ${err.message}`)
    res.status(HttpStatusCode.BAD_REQUEST).json({
      statusCode: HttpStatusCode.BAD_REQUEST,
      errorName: 'Database Error',
      message: [err.message]
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
