import AccessService from '~/services/access.service'
import { Request, Response } from 'express'

class AccessController {
  static signUp = async (req: Request, res: Response) => {
    return res.status(200).json(await AccessService.signUp(req.body))
  }
}

export default AccessController
