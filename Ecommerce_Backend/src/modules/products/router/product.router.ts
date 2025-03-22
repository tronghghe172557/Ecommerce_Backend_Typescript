import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { AuthGuard } from '~/base/common/utils'
import { ProductController } from '~/modules/products/controllers'
const productRouter = Router()

/*
    ROUTER: /api/v1/product
*/

productRouter.get('/', asyncHandler(ProductController.getProducts))
productRouter.get('/deleted', asyncHandler(ProductController.getProductDeleted))

productRouter.get('/:productId', asyncHandler(ProductController.getProductById))

// AuthGuard
productRouter.use(AuthGuard)
productRouter.use('/unpublish-product', asyncHandler(ProductController.unPublishProductByShop))
productRouter.post('', asyncHandler(ProductController.createProduct))

productRouter.put('/:productId', asyncHandler(ProductController.updateProduct))
productRouter.post('/:productId/publish-product', asyncHandler(ProductController.publishProduct))
productRouter.post('/:productId/unpublish-product', asyncHandler(ProductController.unPublishProductByShop))

productRouter.delete('/:productId/delete-product', asyncHandler(ProductController.deleteProduct))
productRouter.post('/:productId/restore-product', asyncHandler(ProductController.restoreProduct))
export { productRouter }
