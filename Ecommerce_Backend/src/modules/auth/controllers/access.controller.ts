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

  static logout = async (req: Request, res: Response) => {
    res.status(HttpStatusCode.NO_CONTENT).json(await AccessService.logout(req.query.keyId as string))
  }

  static handleRefreshToken = async (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json(await AccessService.refreshToken(req.body))
  }
}
