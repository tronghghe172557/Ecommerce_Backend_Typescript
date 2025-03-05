import { Request, Response, NextFunction } from 'express'
import { IApiKey, KeyTokenModel } from '~/modules/auth/models'
import { asyncHandler } from '~/base/common/handlers'
import { BadRequestException, NotFoundException } from '~/base/common/exceptions'
import jwt from 'jsonwebtoken'
import { getHeader } from './helper.util'
import { findApiKeyByKey } from '~/modules/auth/services'
import { verifyToken } from '~/modules/auth/utils'
export interface IHeader {
  API_KEY: string
  AUTHORIZATION: string
  CLIENT_ID: string
  REFRESH_TOKEN: string
}

export enum HEADER {
  API_KEY = 'x-api-key',
  AUTHORIZATION = 'authorization', // access token ~ bearer token
  CLIENT_ID = 'x-client-id', // ~ shopId
  REFRESH_TOKEN = 'refresh_token'
}

// kiểu dữ liệu của user sau khi giải mã token
export interface IDecodedUser extends jwt.JwtPayload {
  userId: string
}

// đảm bảo kiểu chính xác
const apiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const key: string | undefined = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      res.status(403).json({
        message: 'API key is required, Forbidden Error'
      })

      return
    }

    // check object key
    const objKey: IApiKey | null = await findApiKeyByKey(key)
    if (!objKey) {
      res.status(403).json({
        message: 'API key is invalid, Forbidden Error'
      })
      return
    }

    console.log('Pass API key middleware')
    req.objKey = objKey
    next() //
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: 'Internal Server Error'
      })
      return
    }
  }
}

// hàm bậc cao: nhận 1 tham số và trả về 1 middleware function cho express
const permission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // check objKey exist
    const objKey = req.objKey
    if (!objKey || !objKey.permissions) {
      res.status(403).json({
        message: 'Permission Denied'
      })

      // hàm yêu cầu trả về Promise<void> nhưng mình lại trả về 1 đối tượng Response
      return Promise.resolve() // Giải quyết lỗi TypeScript -> giải quyết ổn thoả
    }

    // check permission
    const validPermission = objKey.permissions.includes(permission)
    if (!validPermission) {
      res.status(403).json({
        message: 'Permission Denied'
      })
      return Promise.resolve() // Giải quyết lỗi TypeScript
    }

    console.log('Pass permission key middleware')
    next() // Đảm bảo next() được gọi nếu có quyền
  }
}

//
const AuthGuard = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  /*
    1. check userId missing
    2. get accessToken from header
    3. verify accessToken
    4. check token in db
    5. check keyStore with this userId
    6. oke all -> return next()
  */

  const shopId = req.headers[HEADER.CLIENT_ID]?.toString() // ~ shopId
  if (!shopId) {
    throw new BadRequestException('Client ID is required')
  }

  // find keyStore
  const keyStore = await KeyTokenModel.findOne({ user: shopId }) // find key follow shopId
  if (!keyStore) {
    throw new NotFoundException('Invalid keyStore in authentication')
  }

  // refresh token exist
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      // check refresh token
      const refreshToken = getHeader(req, 'REFRESH_TOKEN')

      const decodeUser = (await jwt.verify(refreshToken, keyStore.privateKey)) as IDecodedUser
      if (typeof decodeUser.userId !== 'string' || shopId !== decodeUser.userId) {
        throw new NotFoundException('Invalid refresh token')
      }

      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken as string | undefined

      return next()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`authentication error: ${error.message}`)
      }
    }
  }

  // access token exist
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
  if (!accessToken) {
    throw new NotFoundException('Access Token is required')
  }

  try {
    // access token -> public key
    const decodeUser = await verifyToken<IDecodedUser>(accessToken, keyStore.publicKey)
    /*
    decodeUser {
      _id: '04c1ad3a-8223-43e1-8762-2b0248d08807',
      role: [],
      iat: 1741145782,
      exp: 1741318582
    }
    */
    if (typeof decodeUser._id !== 'string' || shopId !== decodeUser._id) {
      throw new NotFoundException('Invalid refresh token')
    }

    req.keyStore = keyStore
    req.user = decodeUser
    return next()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`authentication error: ${error.message}`)
    }
  }
})

export { apiKey, permission, AuthGuard }
