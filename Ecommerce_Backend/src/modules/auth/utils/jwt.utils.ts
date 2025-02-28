import jwt from 'jsonwebtoken'

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
): Promise<IToken<T> | null> => {
  try {
    const accessToken = jwt.sign(payload, publicKey, { expiresIn: '2 days' })

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
