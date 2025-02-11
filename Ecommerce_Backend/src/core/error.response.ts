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

export default ErrorResponse
