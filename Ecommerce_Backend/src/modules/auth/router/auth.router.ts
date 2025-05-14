import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { AuthGuard } from '~/base/common/utils'
import { AccessController } from '~/modules/auth/controllers'

export const authRouter = Router()

authRouter.post('/signUp', asyncHandler(AccessController.signUp))
authRouter.post('/signUpForShop', asyncHandler(AccessController.signUpForShop))
authRouter.post('/login', asyncHandler(AccessController.login))

authRouter.use(AuthGuard)
authRouter.post('/handle-refreshToken', asyncHandler(AccessController.handleRefreshToken))
authRouter.get('/logout', asyncHandler(AccessController.logout))
