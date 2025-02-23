import { IApiKey } from '~/models/apiKey.model'
import { IKeyToken } from './models/keyToken.model'
import { IDecodedUser } from './utils'

// mở rộng interface Request của Express
declare global {
  namespace Express {
    interface Request {
      objKey?: IApiKey
      keyStore?: IKeyToken
      user?: IDecodedUser
      refreshToken?: string | undefined
    }
  }
}
