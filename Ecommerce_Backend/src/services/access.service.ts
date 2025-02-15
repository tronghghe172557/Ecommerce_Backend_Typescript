import roleShop from '~/constants/role'
import { ISignUp } from '~/types'
import ShopModel from '~/models/shop.model'
import { createShop, findShopByEmail } from '~/models/repository/shop.repo'
import bcrypt from 'bcrypt'
import { IShop } from '~/models/shop.model'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import { Types } from 'mongoose'
import { createKeyTokenPair, getInfoData } from '~/utils'
import { BadRequestResponse, SussesResponse, CreatedResponse } from '~/core'
export interface ISignupMessage {
  shop: Partial<IShop>
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
// Promise<void> => Hàm không trả về giá trị
class AccessService {
    /**
   * Register a new shop account
   * @param {Object} params - The signup parameters
   * @param {string} params.name - The shop name
   * @param {string} params.email - The shop email (must be unique)
   * @param {string} params.password - The shop password (will be hashed)
   * @returns {Promise<SussesResponse<ISignupMessage>>} Returns shop info and tokens on success
   * @throws {BadRequestResponse} When:
   * - Email already exists
   * - Token creation fails
   * - Shop creation fails
   */
  static signUp = async ({ name, email, password }: ISignUp): Promise<SussesResponse<ISignupMessage>> => {
    // logic
    /*
      1. Check email
      2. Hash password
      3. Create shop
      4. Create token
      5. Create key-token pair - accessToken, refreshToken
      6. Return response
    */
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

      return new CreatedResponse<ISignupMessage>(
        {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens: tokens // Use the tokens object directly
        },
        'Sign up successfully'
      )
    }

    // ném ra 1 ngoại lệ
    throw new BadRequestResponse('Error: Sign up failed')
  }
}

export default AccessService
