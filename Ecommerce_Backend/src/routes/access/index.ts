import express from 'express'
import AccessController from '~/controllers/access.controller'
import asyncHandler from '~/middlewares/handler.middlewares'
const router = express.Router()

router.post('/shop/signUp', asyncHandler(AccessController.signUp))
export default router
