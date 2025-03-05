import { KeyTokenModel, IKeyToken } from '~/modules/auth/models'
import { UpdateRefreshDto } from '~/modules/auth/dtos'
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

  static updateRefreshTokenUsed = async ({
    userId,
    refreshToken,
    refreshTokenUsed
  }: UpdateRefreshDto): Promise<IKeyToken> => {
    try {
      await KeyTokenModel.updateOne(
        { user: userId },
        { refreshToken: refreshToken, $push: { refreshTokensUsed: refreshTokenUsed } },
        { new: true }
      ).lean()

      const keyToken = await KeyTokenModel.findOne({ user: userId }).lean()
      if (!keyToken) {
        throw new Error('KeyToken not found')
      }
      return keyToken
    } catch (error) {
      throw new Error(`KeyTokenService updateRefreshTokenUsed error: ${error instanceof Error && error.message}`)
    }
  }
}
