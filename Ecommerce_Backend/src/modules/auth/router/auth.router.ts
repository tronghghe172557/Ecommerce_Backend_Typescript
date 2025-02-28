import { Router } from 'express'
import { checkAuth } from '~/base/common/utils'
import { asyncHandler } from '~/base/common/handlers'
import { AccessController } from '~/modules/auth/controllers'

export const authRouter = Router()

authRouter.post('/shop/signUp', asyncHandler(AccessController.signUp))
authRouter.post('/shop/login', asyncHandler(AccessController.login))

authRouter.use(checkAuth)
