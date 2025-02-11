import express from 'express'
import AccessController from '~/controllers/access.controller'
const router = express.Router()

router.post('/shop/signUp', AccessController.signUp)
export default router
