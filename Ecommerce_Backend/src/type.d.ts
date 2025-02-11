import { IApiKey } from '~/models/apiKey.model'

// mở rộng interface Request của Express
declare global {
  namespace Express {
    interface Request {
      objKey?: IApiKey
    }
  }
}
