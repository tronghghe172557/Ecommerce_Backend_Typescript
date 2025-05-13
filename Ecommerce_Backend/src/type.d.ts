import { IApiKey, IShop } from '~/modules/auth/models'
import { IKeyToken } from '~/modules/auth/models'
import { IDecodedUser } from '~/base/common/utils'

// mở rộng interface Request của Express
declare global {
  namespace Express {
    interface Request {
      objKey?: IApiKey
      keyStore?: IKeyToken
      user?: IDecodedUser | string
      refreshToken?: string | undefined
      shop?: IShop
      userObj?: IUser
    }
  }
}
