import { NotificationType } from '~/modules/Notification/enums'
import { NotificationModel } from '../models/notification.model'
import { BadRequestException } from '~/base/common/exceptions'

interface match {
  noti_receivedId: string
  noti_type?: string
}

const pushNotiToSystem = async ({
  noti_type = NotificationType.ORDER_SUCCESSFUL,
  noti_senderId = '984c06d4-e035-4308-9014-2eabaa78faf0',
  noti_receivedId = '1',
  noti_options = {},
  noti_content = ''
}) => {
  try {
    const newNoti = new NotificationModel({
      noti_type,
      noti_senderId,
      noti_receivedId,
      noti_content,
      noti_options
    })

    await newNoti.save()
    return newNoti
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw new BadRequestException(`Error while pushing notification to system: ${error.message}`)
    }
  }
}

const listNotiByUser = async ({ noti_receivedId = 'test-user', noti_type = 'ALL' }) => {
  const match: match = { noti_receivedId: noti_receivedId }

  if (noti_type !== 'ALL') {
    match['noti_type'] = noti_type
  }

  return await NotificationModel.aggregate([
    {
      $match: match
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: 1,
        noti_options: 1,
        createdAt: 1
      }
    }
  ])
}

export { pushNotiToSystem, listNotiByUser }
