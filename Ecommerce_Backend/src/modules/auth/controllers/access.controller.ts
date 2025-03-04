import { AccessService } from '~/modules/auth/services'
import { loginRequestDto, signupRequestDto } from '~/modules/auth/dtos'
import { Request, Response } from 'express'
import { HttpStatusCode } from '~/base/common/enums'

export class AccessController {
  static signUp = async (req: Request, res: Response) => {
    const dto = signupRequestDto.parse(req.body)
    res.status(HttpStatusCode.CREATED).json(await AccessService.signUp(dto))
  }

  static login = async (req: Request, res: Response) => {
    const dto = loginRequestDto.parse(req.body)
    res.status(HttpStatusCode.OK).json(await AccessService.login(dto))
  }
}
