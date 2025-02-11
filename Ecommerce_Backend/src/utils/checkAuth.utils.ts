import { findApiKeyByKey } from '~/services/apiKey.service'
import { Request, Response, NextFunction } from 'express'
import { IApiKey } from '~/models/apiKey.model'

export interface IHeader {
  API_KEY: string
  AUTHORIZATION: string
}

const HEADER: IHeader = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
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

export { apiKey, permission }
