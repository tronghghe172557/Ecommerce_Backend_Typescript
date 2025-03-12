import { Router } from 'express'
import { ProductController } from '~/modules/products/controllers'
const productRouter = Router()

productRouter.get('', ProductController.findAllProducts)
productRouter.get('/:productId', ProductController.findProduct)
productRouter.get('/draft', ProductController.getAllDraftProduct)
productRouter.get('/all-publish', ProductController.getAllPublishProduct)
productRouter.get('/search', ProductController.getListSearchProduct)

// AuthGuard
productRouter.post('', ProductController.createProduct)

export { productRouter }
