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

productRouter.get('/:productId', ProductController.getProductById)

// AuthGuard
productRouter.use(AuthGuard)
productRouter.use('/unpublish-product', ProductController.unPublishProductByShop)
productRouter.post('', asyncHandler(ProductController.createProduct))

productRouter.put('/:productId', ProductController.updateProduct)
productRouter.post('/:productId/publish-product', ProductController.publishProduct)
productRouter.post('/:productId/unpublish-product', ProductController.unPublishProductByShop)

productRouter.delete('/:productId/delete-product', ProductController.deleteProduct)
productRouter.post('/:productId/restore-product', ProductController.restoreProduct)
export { productRouter }
