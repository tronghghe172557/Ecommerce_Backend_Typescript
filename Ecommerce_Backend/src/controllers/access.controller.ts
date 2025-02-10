import AccessService from '~/services/access.service'
import { Request, Response } from 'express'
import { IMessage } from '~/types/message.type'

class AccessController {
  static signUp = async (req: Request, res: Response) => {
    try {
      const result: IMessage = await AccessService.signUp(req.body)
      res.status(200).json({ status: 201, message: 'Sign up successfully', data: result })
    } catch (error) {
      if (error instanceof Error) res.status(500).json({ message: error.message })
    }
  }
}

export default AccessController
