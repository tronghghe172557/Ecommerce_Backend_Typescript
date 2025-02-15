import { FailedResponseBody } from '~/types/response-body.type'
import { HttpStatusCode } from '~/utils/http-status.utils'

class ErrorResponse {
  public message?: string
  public errorName: string
  public statusCode: HttpStatusCode

  constructor(errorName: string, statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR, message?: string) {
    this.errorName = errorName
    this.statusCode = statusCode
    this.message = message
  }

  send(): FailedResponseBody {
    return {
      message: this.message,
      errorName: this.errorName,
      statusCode: this.statusCode
    }
  }
}

class BadRequestResponse extends ErrorResponse {
  constructor(message: string) {
    super(HttpStatusCode[HttpStatusCode.BAD_REQUEST], HttpStatusCode.BAD_REQUEST, message)
  }
}

class UnauthorizedResponse extends ErrorResponse {
  constructor(message: string) {
    super(HttpStatusCode[HttpStatusCode.UNAUTHORIZED], HttpStatusCode.UNAUTHORIZED, message)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message: string) {
    super(HttpStatusCode[HttpStatusCode.NOT_FOUND], HttpStatusCode.NOT_FOUND, message)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message: string) {
    super(HttpStatusCode[HttpStatusCode.FORBIDDEN], HttpStatusCode.FORBIDDEN, message)
  }
}

export { ErrorResponse, BadRequestResponse, UnauthorizedResponse, NotFoundError, ForbiddenError }
