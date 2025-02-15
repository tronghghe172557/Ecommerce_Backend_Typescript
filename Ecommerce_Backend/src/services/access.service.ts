import roleShop from '~/constants/role'
import { ISignUp } from '~/types'
import ShopModel from '~/models/shop.model'
import { createShop, findShopByEmail } from '~/models/repository/shop.repo'
import bcrypt from 'bcrypt'
import { IShop } from '~/models/shop.model'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import { Types } from 'mongoose'
import { createKeyTokenPair } from '~/utils'
import { BadRequestResponse } from '~/core'
import { SuccessResponseBody } from '~/types'
export interface ISignupMessage {
  shop: IShop
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
// Promise<void> => Hàm không trả về giá trị
class AccessService {
  static signUp = async ({ name, email, password }: ISignUp): Promise<SuccessResponseBody<ISignupMessage>> => {
    // logic
    const holderShop = await findShopByEmail(email)
    if (holderShop) {
      throw new BadRequestResponse('Email already exists')
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
        throw new BadRequestResponse('Error: token is not defined')
      }

      const tokens = await createKeyTokenPair({ _id: newShop._id, role: newShop.roles }, publicKey, privateKey)

      if (!tokens) {
        throw new BadRequestResponse('Error: tokens is not defined')
      }

      return {
        message: 'Sign up successfully',
        statusCode: 201,
        data: {
          shop: newShop,
          tokens
        }
      }
    }

    throw new BadRequestResponse('Error: Sign up failed')
  }
}

export default AccessService
