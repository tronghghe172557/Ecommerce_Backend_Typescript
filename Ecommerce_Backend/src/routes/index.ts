import express from 'express'
import router from './access'
const routerV2 = express.Router()

routerV2.use('/v1/api', router)

export default routerV2