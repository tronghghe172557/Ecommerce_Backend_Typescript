import jwt from 'jsonwebtoken'
export interface IToken {
  accessToken: string
  refreshToken: string
}

const createKeyTokenPair = async (payload: any, publicKey: string, privateKey: string): Promise<IToken | null> => {
  try {
    const accessToken = jwt.sign(payload, publicKey, { algorithm: 'RS256', expiresIn: '2 days' })

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days'
    })
    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
    return null
  }
}

export { createKeyTokenPair }
