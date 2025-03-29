import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { DiscountController } from '~/modules/Discount/controllers'

// /discounts
const discountRouter = Router()

discountRouter.post('/generate-discount-code', asyncHandler(DiscountController.GenerateDiscountCode))

export { discountRouter }
