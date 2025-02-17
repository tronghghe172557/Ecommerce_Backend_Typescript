import KeyTokenModel, { IKeyToken } from '~/models/keyToken.model'

class KeyTokenService {
  static createToken = async (tokenData: Partial<IKeyToken>): Promise<IKeyToken | null> => {
    try {
      const filter = { user: tokenData.user },
        update = {
          publicKey: tokenData.publicKey,
          privateKey: tokenData.privateKey,
          refreshToken: tokenData.refreshToken,
          refreshTokensUsed: []
        },
        options = { upsert: true, new: true, setDefaultsOnInsert: true }
      const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options)
      return tokens
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      return null
    }
  }
}

export default KeyTokenService
