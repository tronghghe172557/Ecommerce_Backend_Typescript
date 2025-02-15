import { HttpStatusCode } from '~/utils/http-status.utils'
import { Pagination, Sorting } from '~/types/index'

export type SuccessResponseBody<T> = T extends unknown[]
  ? {
      message?: string
      statusCode: HttpStatusCode
      data: T
      metadata: { pagination: Pagination; sorting: Sorting }
    }
  : { message?: string; statusCode: HttpStatusCode; data: T }

export type FailedResponseBody = {
  message?: string
  errorName: string
  statusCode: HttpStatusCode
}
