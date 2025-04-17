import { Router } from 'express'
import { authRouter } from '~/modules/auth/router'
import { cartRouter } from '~/modules/Cart/router'
import { discountRouter } from '~/modules/Discount/router'
import { inventoryRouter } from '~/modules/Inventory/router'
import { productRouter } from '~/modules/products/router'

export const appRouter = Router()

appRouter.use('/auth', authRouter)
appRouter.use('/products', productRouter)
appRouter.use('/inventories', inventoryRouter)
appRouter.use('/discounts', discountRouter)
appRouter.use('/cart', cartRouter)
