import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { NotificationController } from '~/modules/Notification/controllers'

const notificationRouter = Router()

notificationRouter.get('/', asyncHandler(NotificationController.ListNotiByUser))

export { notificationRouter }
