import { AccessService } from '~/modules/auth/services'
import { loginRequestDto, refreshRequestDto, signupRequestDto } from '~/modules/auth/dtos'
import { Request, Response } from 'express'
import { HttpStatusCode } from '~/base/common/enums'

export class AccessController {
  /**
   * `[POST] /api/v1/auth/signUp`
   */
  static signUp = async (req: Request, res: Response) => {
    const dto = signupRequestDto.parse(req.body)
    res.status(HttpStatusCode.CREATED).json(await AccessService.signUp(dto))
  }

  /**
   * `[POST] /api/v1/auth/login`
   */
  static login = async (req: Request, res: Response) => {
    const dto = loginRequestDto.parse(req.body)
    res.status(HttpStatusCode.OK).json(await AccessService.login(dto))
  }

  /**
   * `[GET] /api/v1/auth/logout`
   */
  static logout = async (req: Request, res: Response) => {
    res.status(HttpStatusCode.NO_CONTENT).json(await AccessService.logout(req.query.keyId as string))
  }

  /**
   * `[POST] /api/v1/auth/handleRefreshToken`
   */
  static handleRefreshToken = async (req: Request, res: Response) => {
    const dto = refreshRequestDto.parse(req.body)
    const keyStore = req?.keyStore

    if (!keyStore) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' })
      return
    }
    res.status(HttpStatusCode.OK).json(await AccessService.refreshToken({ ...dto, keyStore }))
  }
}
