import express from 'express'
import access from './access'
import { apiKey, permission } from '~/utils'
const indexRouter = express.Router()

// check api key
indexRouter.use(apiKey)
// check permission
indexRouter.use(permission('0000'))

indexRouter.use('/v1/api', access)

export default indexRouter
