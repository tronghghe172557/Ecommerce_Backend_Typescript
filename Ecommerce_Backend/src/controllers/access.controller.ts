import AccessService from '~/services/access.service'
import { Request, Response } from 'express'

class AccessController {
  static signUp = async (req: Request, res: Response) => {
    const result = await AccessService.signUp(req.body)
    result.send(res)
  }

  static login = async (req: Request, res: Response) => {
    const result = await AccessService.login(req.body)
    result.send(res)
  }
}

export default AccessController
