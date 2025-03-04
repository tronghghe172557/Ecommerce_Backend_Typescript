import { KeyTokenModel, IKeyToken } from '~/modules/auth/models'

export class KeyTokenService {
  static createToken = async (tokenData: Partial<IKeyToken>): Promise<IKeyToken | null> => {
    try {
      const existingToken = await KeyTokenModel.findOne({ user: tokenData.user })

      if (existingToken) {
        await KeyTokenModel.updateOne(
          { user: tokenData.user },
          {
            $set: {
              publicKey: tokenData.publicKey,
              privateKey: tokenData.privateKey,
              refreshToken: tokenData.refreshToken,
              refreshTokensUsed: []
            }
          }
        )
        return await KeyTokenModel.findOne({ user: tokenData.user }).lean()
      } else {
        return await KeyTokenModel.create({
          user: tokenData.user,
          publicKey: tokenData.publicKey,
          privateKey: tokenData.privateKey,
          refreshToken: tokenData.refreshToken,
          refreshTokensUsed: []
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('KeyTokenService createToken error:', error.message)
      }
      return null
    }
  }
}
