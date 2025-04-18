import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { CheckoutController } from '~/modules/Checkouts/controllers'

const checkoutRouter = Router()

// /api/v1/checkout
checkoutRouter.post('/review', asyncHandler(CheckoutController.checkOutReview))

export { checkoutRouter }
