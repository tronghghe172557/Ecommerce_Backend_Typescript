import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { AuthGuard } from '~/base/common/utils'
import { ProductController } from '~/modules/products/controllers'
const productRouter = Router()

/*
    ROUTER: /api/v1/product
*/

productRouter.get('/', ProductController.getProducts)
productRouter.get('/deleted', ProductController.getProductDeleted)

productRouter.get('/:productId', ProductController.findProduct)
productRouter.get('/all-publish', ProductController.getAllPublishProduct)
productRouter.get('/search', ProductController.getListSearchProduct)

// AuthGuard
productRouter.use(AuthGuard)
productRouter.post('', asyncHandler(ProductController.createProduct))

export { productRouter }
