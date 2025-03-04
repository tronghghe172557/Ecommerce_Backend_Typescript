import { roleShop } from '~/base/common/enums'
import ShopModel from '~/modules/auth/models/shop.model'
import { createShop, findShopByEmail } from '~/modules/auth/models/repository/shop.repo'
import bcrypt from 'bcrypt'
import { IShop } from '~/modules/auth/models/shop.model'
import crypto from 'crypto'
import { KeyTokenService } from '~/modules/auth/services'
import { BadRequestException } from '~/base/common/exceptions'
import { createKeyTokenPair } from '../utils'
import { LoginRequestDto, LoginSuccessDto, SignupRequestDto } from '~/modules/auth/dtos'
import { SuccessResponseBody } from '~/base/common/types'
import { KeyTokenModel } from '~/modules/auth/models'
// Promise<void> => Hàm không trả về giá trị
class AccessService {
  static login = async ({ email, password }: LoginRequestDto): Promise<SuccessResponseBody<LoginSuccessDto>> => {
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

    const tokens = await createKeyTokenPair({ _id: foundShop._id, role: foundShop.roles }, publicKey, privateKey)
    if (!tokens) {
      throw new BadRequestException('Error: tokens is not defined')
    }

    // save NEW TOKENS when login
    await KeyTokenService.createToken({
      privateKey,
      publicKey,
      user: foundShop._id,
      refreshToken: tokens?.refreshToken
    })

    return {
      data: {
        id: foundShop._id as string,
        role: foundShop.roles,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    }
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
  static signUp = async ({
    name,
    email,
    password
  }: SignupRequestDto): Promise<SuccessResponseBody<LoginSuccessDto>> => {
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

      // create accessToken, refreshToken
      const tokens = await createKeyTokenPair({ _id: newShop._id, role: newShop.roles }, publicKey, privateKey)
      if (!tokens) {
        // delete shop if token creation fails
        await ShopModel.findByIdAndDelete(newShop._id)
        throw new BadRequestException('Error: tokens is not defined')
      }

      // save token to db
      const token = await KeyTokenService.createToken({
        privateKey,
        publicKey,
        refreshToken: tokens.refreshToken,
        user: newShop._id as string
      })

      if (!token) {
        // delete shop if token creation fails
        await ShopModel.findByIdAndDelete(newShop._id)
        throw new BadRequestException('Error: token is not defined')
      }

      return {
        data: {
          id: newShop._id as string,
          role: newShop.roles,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      }
    }

    throw new BadRequestException('Error: Shop creation failed')
  }

  static logout = async (keyId: string): Promise<void> => {
    const keyToken = await KeyTokenModel.findByIdAndDelete(keyId)
    if (keyToken) {
      // relocate refreshToken to blacklist
    }
    throw new BadRequestException('KeyToken not found')
  }
}

export { AccessService }
