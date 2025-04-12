import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { DiscountController } from '~/modules/Discount/controllers'

// /discounts
const discountRouter = Router()

discountRouter.get('/', asyncHandler(DiscountController.GetAllDiscountCodesForShop))
discountRouter.get('/products/discounts', asyncHandler(DiscountController.GetAllProductsByDiscountCodes))

discountRouter.post('/', asyncHandler(DiscountController.GenerateDiscountCode))
discountRouter.post('/discounts-amount', asyncHandler(DiscountController.DiscountAmount))
discountRouter.post('/use-discount', asyncHandler(DiscountController.UseDiscountCode))
discountRouter.post('/restore', asyncHandler(DiscountController.RestoreDiscountCode))
discountRouter.post('/cancel', asyncHandler(DiscountController.CancelDiscountCode))
export { discountRouter }
