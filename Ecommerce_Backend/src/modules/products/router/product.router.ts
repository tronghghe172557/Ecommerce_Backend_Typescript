import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { AuthGuard } from '~/base/common/utils'
import { ProductController } from '~/modules/products/controllers'
const productRouter = Router()

productRouter.get('', ProductController.findAllProducts)
productRouter.get('/:productId', ProductController.findProduct)
productRouter.get('/draft', ProductController.getAllDraftProduct)
productRouter.get('/all-publish', ProductController.getAllPublishProduct)
productRouter.get('/search', ProductController.getListSearchProduct)

// AuthGuard
productRouter.use(AuthGuard)
productRouter.post('', asyncHandler(ProductController.createProduct))

export { productRouter }
