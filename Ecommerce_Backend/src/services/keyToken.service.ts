import KeyTokenModel, { IKeyToken } from '~/models/keyToken.model'
import { createKeyToken } from '~/models/repository/keyToken.repo'

class KeyTokenService {
  static createToken = async (tokenData: Partial<IKeyToken>): Promise<IKeyToken | null> => {
    try {
      const token: IKeyToken | null = await createKeyToken(new KeyTokenModel(tokenData))

      return token
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      return null
    }
  }
}

export default KeyTokenService
