import roleShop from '~/constants/role'
import { ISignUp } from '~/types/signup.type'
import ShopModel from '~/models/shop.model'
import { createShop, findShopByEmail } from '~/models/repository/shop.repo'
import { IMessage } from '~/types/message.type'
import bcrypt from 'bcrypt'
import { IShop } from '~/models/shop.model'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import { Types } from 'mongoose'
import { createKeyTokenPair } from '~/utils/jwt'
// Promise<void> => Hàm không trả về giá trị
class AccessService {
  static signUp = async ({ name, email, password }: ISignUp): Promise<IMessage> => {
    // logic
    try {
      const holderShop = await findShopByEmail(email)
      if (holderShop) {
        return {
          code: 'XXX',
          message: 'Email already exists',
          status: 400
        }
      }

      const passwordHash = bcrypt.hashSync(password, 10)
      const newShop: IShop | null = await createShop(
        new ShopModel({
          name,
          email,
          password: passwordHash,
          role: roleShop.SHOP
        })
      )

      if (newShop) {
        const privateKey = crypto.randomBytes(32).toString('hex')
        const publicKey = crypto.randomBytes(32).toString('hex')

        const token = await KeyTokenService.createToken({
          privateKey,
          publicKey,
          user: newShop._id as Types.ObjectId
        })

        if (!token) {
          return {
            code: 'XXX',
            message: 'publicKeyString error',
            status: 500
          }
        }

        const tokens = await createKeyTokenPair({ _id: newShop._id, role: newShop.roles }, publicKey, privateKey)

        if (tokens) {
          return {
            code: '201',
            message: 'Sign up successfully',
            status: 200,
            data: [tokens?.accessToken, tokens?.refreshToken]
          }
        }
        return {
          code: '400',
          message: 'Create token error',
          status: 400
        }
      }

      return {
        code: 'XXX',
        message: 'Email already exists',
        data: newShop ? [newShop] : undefined,
        status: 400
      }
    } catch (error) {
      console.log(error.message)
      return {
        code: 'XXX',
        message: 'Error message',
        status: 500
      }
    }
  }
}

export default AccessService
