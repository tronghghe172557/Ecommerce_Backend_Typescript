import { roleShop } from '~/base/common/enums'
import { ILogin, ISignUp } from '~/modules/auth/types/auth.type'
import ShopModel from '~/models/shop.model'
import { createShop, findShopByEmail } from '~/models/repository/shop.repo'
import bcrypt from 'bcrypt'
import { IShop } from '~/models/shop.model'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import { Types } from 'mongoose'
import { getInfoData } from '~/base/common/utils/dbHelper.util'
import { BadRequestException, SussesResponse, CreatedResponse, OKResponse } from '~/base/common/exceptions'
import { createKeyTokenPair } from '../utils'
export interface ISignupMessage {
  shop: Partial<IShop>
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
// Promise<void> => Hàm không trả về giá trị
class AccessService {
  static login = async ({ email, password }: ILogin): Promise<SussesResponse<ISignupMessage>> => {
    /*
      1. check email exist
      2. check password
      3. create token
      4. save publickey to db
      return response
    */
    const foundShop = await findShopByEmail(email)
    if (!foundShop) {
      throw new BadRequestException('Email not found')
    }

    const match = await bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new BadRequestException('Password is incorrect')
    }

    const privateKey = crypto.randomBytes(32).toString('hex')
    const publicKey = crypto.randomBytes(32).toString('hex')

    const tokens = await createKeyTokenPair(
      { _id: foundShop._id as Types.ObjectId, role: foundShop.roles },
      publicKey,
      privateKey
    )
    if (!tokens) {
      throw new BadRequestException('Error: tokens is not defined')
    }

    // save NEW TOKENS when login
    await KeyTokenService.createToken({
      privateKey,
      publicKey,
      user: foundShop._id as Types.ObjectId,
      refreshToken: tokens?.refreshToken
    })

    return new OKResponse<ISignupMessage>(
      {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
        tokens: tokens // Use the tokens object directly
      },
      'Login successfully'
    )
  }
  /**
   * Register a new shop account
   * @param {Object} params - The signup parameters
   * @param {string} params.name - The shop name
   * @param {string} params.email - The shop email (must be unique)
   * @param {string} params.password - The shop password (will be hashed)
   * @returns {Promise<SussesResponse<ISignupMessage>>} Returns shop info and tokens on success
   * @throws {BadRequestException} When:
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
      throw new BadRequestException('Email already exists')
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

      const tokens = await createKeyTokenPair({ _id: newShop._id, role: newShop.roles }, publicKey, privateKey)

      if (!tokens) {
        throw new BadRequestException('Error: tokens is not defined')
      }

      const token = await KeyTokenService.createToken({
        privateKey,
        publicKey,
        refreshToken: tokens.refreshToken,
        user: newShop._id as Types.ObjectId
      })

      if (!token) {
        throw new BadRequestException('Error: token is not defined')
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
    throw new BadRequestException('Error: Sign up failed')
  }
}

export { AccessService }
