import { Router } from 'express'
import { authRouter } from '~/modules/auth/router'

export const appRouter = Router()

appRouter.use('/auth', authRouter)
