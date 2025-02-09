import AccessService from '~/services/access.service'
import { Request, Response } from 'express'

class AccessController {
  static signUp = async (req: Request, res: Response) => {
    try {
      await AccessService.signUp(req.body)
      res.status(200).json({ message: 'Sign up successfully' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default AccessController
