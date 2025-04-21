import { Request, Response } from 'express'

import { HttpStatusCode } from '~/base/common/enums'
import { listNotiByUser } from '../services'

export class NotificationController {
  static ListNotiByUser = async (req: Request, res: Response) => {
    const data = await listNotiByUser({
        noti_receivedId: 'test_user',
      noti_type: 'ALL'
    })

    res.status(HttpStatusCode.OK).json({
      message: 'List notification by user',
      data: data
    })
  }
}
