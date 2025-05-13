import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { AuthGuard, AuthGuardV2 } from '~/base/common/utils'
import { AuthRoleEnum } from '~/modules/auth/enums'
import { ProductController } from '~/modules/products/controllers'
const productRouter = Router()

/*
    ROUTER: /api/v1/products
*/

/**
 * Nguyên tắc quan trọng khi làm việc với Express router:
 * Các tuyến đường cụ thể/tĩnh phải được đặt trước các tuyến đường có tham số động
 * Nếu không, tuyến đường có tham số sẽ "chặn" tất cả các tuyến đường phía sau nó có cùng phương thức (GET, POST, v.v.)
 */

productRouter.get('/', asyncHandler(ProductController.getProducts))
productRouter.get('/deleted', asyncHandler(ProductController.getProductDeleted))

// Đặt tuyến đường tĩnh trước tuyến đường có tham số động
productRouter.get('/unpublish-product', AuthGuard, asyncHandler(ProductController.unPublishProductByShop))

// Sau đó mới đến tuyến đường có tham số
productRouter.get('/:productId', asyncHandler(ProductController.getProductById))

// AuthGuard
productRouter.use(asyncHandler(AuthGuardV2([AuthRoleEnum.ADMIN, AuthRoleEnum.SHOP])))

productRouter.post('', asyncHandler(ProductController.createProduct))

productRouter.put('/:productId', asyncHandler(ProductController.updateProduct))
productRouter.post('/:productId/publish-product', asyncHandler(ProductController.publishProduct))
productRouter.post('/:productId/unpublish-product', asyncHandler(ProductController.unpublishProduct))

productRouter.delete('/:productId/', asyncHandler(ProductController.deleteProduct))
productRouter.post('/restore-product/:productId/', asyncHandler(ProductController.restoreProduct))
export { productRouter }
