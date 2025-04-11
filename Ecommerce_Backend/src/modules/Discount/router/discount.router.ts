import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { DiscountController } from '~/modules/Discount/controllers'

// /discounts
const discountRouter = Router()

discountRouter.get('/products/discounts', asyncHandler(DiscountController.GetAllProductsByDiscountCodes))
discountRouter.get('/discounts', asyncHandler(DiscountController.GetAllDiscountCodesForShop))

discountRouter.post('/generate-discount-code', asyncHandler(DiscountController.GenerateDiscountCode))
export { discountRouter }
