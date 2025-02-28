import { HttpStatusCode } from '~/base/common/enums'
import { Pagination, Sorting } from '~/base/common/types'
import { Response } from 'express'
class SussesResponse<T> {
  public message?: string
  public statusCode: HttpStatusCode
  public data: T
  public metadata?: { pagination: Pagination; sorting: Sorting }
  constructor(
    data: T,
    statusCode: HttpStatusCode = HttpStatusCode.OK,
    message?: string,
    metadata?: { pagination: Pagination; sorting: Sorting }
  ) {
    this.data = data
    this.statusCode = statusCode
    this.message = message
    this.metadata = metadata
  }

  send(res: Response): Response {
    if (Array.isArray(this.data)) {
      return res.status(this.statusCode).json({
        message: this.message,
        statusCode: this.statusCode,
        data: this.data,
        metadata: this.metadata!
      })
    }
    return res.status(this.statusCode).json({
      message: this.message,
      statusCode: this.statusCode,
      data: this.data
    })
  }
}

class OKResponse<T> extends SussesResponse<T> {
  constructor(data: T, message?: string, metadata?: { pagination: Pagination; sorting: Sorting }) {
    super(data, HttpStatusCode.OK, message || HttpStatusCode[HttpStatusCode.OK], metadata)
  }
}

class CreatedResponse<T> extends SussesResponse<T> {
  constructor(data: T, message?: string) {
    super(data, HttpStatusCode.CREATED, message || HttpStatusCode[HttpStatusCode.CREATED])
  }
}

export { SussesResponse, OKResponse, CreatedResponse }
