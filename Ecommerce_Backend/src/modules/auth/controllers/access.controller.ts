import { AccessService } from '~/modules/auth/services'
import { Request, Response } from 'express'

export class AccessController {
  static signUp = async (req: Request, res: Response) => {
    const result = await AccessService.signUp(req.body)
    result.send(res)
  }

  static login = async (req: Request, res: Response) => {
    const result = await AccessService.login(req.body)
    result.send(res)
  }
}
