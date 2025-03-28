import { Router } from 'express'
import { authRouter } from '~/modules/auth/router'
import { productRouter } from '~/modules/products/router'

export const appRouter = Router()

appRouter.use('/auth', authRouter)
appRouter.use('/products', productRouter)
