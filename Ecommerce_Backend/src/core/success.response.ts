import { SuccessResponseBody } from '~/types/index'
import { HttpStatusCode } from '~/utils/index'
import { Pagination, Sorting } from '~/types/index'

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

  send(): SuccessResponseBody<T> { // trả về với dữ liệu có kiểu SuccessResponseBody
    if (Array.isArray(this.data)) {
      return {
        message: this.message,
        statusCode: this.statusCode,
        data: this.data,
        metadata: this.metadata!
      } as SuccessResponseBody<T>
    } else {
      return {
        data: this.data
      } as SuccessResponseBody<T>
    }
  }
}

export default SussesResponse
