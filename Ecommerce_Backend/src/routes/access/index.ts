import express from 'express'
import AccessController from '~/controllers/access.controller'
import { asyncHandler } from '~/middlewares'
import { checkAuth } from '~/utils'
const router = express.Router()

router.post('/shop/signUp', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))

router.use(checkAuth)
export default router
