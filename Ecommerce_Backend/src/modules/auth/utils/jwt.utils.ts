import jwt from 'jsonwebtoken'
import { BadRequestException } from '~/base/common/exceptions'

// T là 1 kiểu dữ liệu bất kỳ
export interface IToken<T> {
  payload?: T
  accessToken: string
  refreshToken: string
}

// 'object': là 1 kiểu hẹp hơn của object, nó chỉ chứa
// các kiểu giá trị KHÔNG phải nguyên thuỷ {}, [], function () {}, ....
// 'Object' chứa tất cả các kiểu giá trị KHÔNG PHẢI là NULL OR UNDIFINED

const createKeyTokenPair = async <T extends object>(
  payload: T,
  publicKey: string,
  privateKey: string
): Promise<IToken<T>> => {
  try {
    const accessToken = jwt.sign(payload, publicKey, { expiresIn: '2 days' })

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new BadRequestException(`Error: ${error instanceof Error && error.message}`)
  }
}

const verifyToken = async <T extends object>(token: string, privateKey: string): Promise<T> => {
  console.log('token', token)
  console.log('privateKey', privateKey)
  try {
    const decoded = jwt.verify(token, privateKey) as T
    return decoded
  } catch (error) {
    throw new BadRequestException(`Token is invalid: ${error instanceof Error && error.message}`)
  }
}

export { createKeyTokenPair, verifyToken }
