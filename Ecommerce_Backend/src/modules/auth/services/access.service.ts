import { IHandleRefreshToken } from './../types'
import { roleShop } from '~/base/common/enums'
import { createShop, findShopByEmail } from '~/modules/auth/models'
import bcrypt from 'bcrypt'
import { IShop, ShopModel, KeyTokenModel } from '~/modules/auth/models'
import crypto from 'crypto'
import { KeyTokenService } from '~/modules/auth/services'
import { BadRequestException, UnauthorizedException } from '~/base/common/exceptions'
import { createKeyTokenPair, JWTUtils } from '~/modules/auth/utils'
import {
  LoginRequestDto,
  LoginSuccessDto,
  RefreshSuccessDto,
  SignupRequestDto,
  updateRefreshDto
} from '~/modules/auth/dtos'
import { SuccessResponseBody } from '~/base/common/types'
import { redis } from '~/base/redis'
// Promise<void> => Hàm không trả về giá trị
class AccessService {
  private static readonly BLACKLISTED = 'BLACKLISTED'
  private static readonly TIMEOUT = 60 * 60 * 24 * 30 // 30 days

  static login = async ({ email, password }: LoginRequestDto): Promise<SuccessResponseBody<LoginSuccessDto>> => {
    // 1. check email exist
    const foundShop = await findShopByEmail(email)
    if (!foundShop) {
      throw new BadRequestException('Email not found')
    }

    // 2. check password
    const match = await bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new UnauthorizedException('Password is incorrect')
    }

    // 3. create token => accessToken, refreshToken
    const privateKey = crypto.randomBytes(32).toString('hex')
    const publicKey = crypto.randomBytes(32).toString('hex')

    const tokens = await createKeyTokenPair({ _id: foundShop._id, role: foundShop.roles }, publicKey, privateKey)
    if (!tokens) {
      throw new BadRequestException('Error: tokens is not defined')
    }

    // 4. save publickey to db
    await KeyTokenService.createToken({
      privateKey,
      publicKey,
      user: foundShop._id, // ~ shopId or userId
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

  static signUp = async ({
    name,
    email,
    password
  }: SignupRequestDto): Promise<SuccessResponseBody<LoginSuccessDto>> => {
    // 1. Check email
    const holderShop = await findShopByEmail(email)
    if (holderShop) {
      throw new BadRequestException('Email already exists')
    }

    // 2. Hash password
    const passwordHash = bcrypt.hashSync(password, 10)
    // 3. Create shop
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

      // 4. Create token => accessToken, refreshToken
      const tokens = await createKeyTokenPair({ _id: newShop._id, role: newShop.roles }, publicKey, privateKey)
      if (!tokens) {
        // delete shop if token creation fails
        await ShopModel.findByIdAndDelete(newShop._id)
        throw new BadRequestException('Error: tokens is not defined')
      }

      // 5. save token to db
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
    // delete keyToken from db
    const keyToken = await KeyTokenModel.findByIdAndDelete(keyId)
    if (!keyToken) {
      throw new BadRequestException('KeyToken not found')
    }
    // relocate refreshToken to blacklist
    await redis.getInstance().set(keyId, this.BLACKLISTED, 'EX', this.TIMEOUT)
  }

  static refreshToken = async ({
    refreshToken,
    keyStore
  }: IHandleRefreshToken): Promise<SuccessResponseBody<RefreshSuccessDto>> => {
    // 1. find keyToken by userId
    const keyToken = await KeyTokenModel.findOne({ user: keyStore.user })
    const shop = await ShopModel.findOne({ _id: keyStore.user })

    if (!keyToken || !shop) {
      throw new BadRequestException(`${!keyToken ? 'KeyToken not found' : 'Shop not found'}`)
    }

    // 2. check refreshTokenUsed
    if (keyToken.refreshTokensUsed?.includes(refreshToken)) {
      throw new BadRequestException('You are catching up')
    }

    // 3. compare refreshToken in params with refreshToken in db
    if (keyToken.refreshToken !== refreshToken) {
      throw new BadRequestException('Invalid refreshToken')
    }

    // 4. create new token
    const tokens = await createKeyTokenPair(
      { _id: keyToken.user, roles: shop.roles },
      keyToken.publicKey,
      keyToken.privateKey
    )

    // 5. update refreshToken + refreshTokenUsed and  to db with update-refreshToke.dto
    const newKeyToken = await KeyTokenService.updateRefreshTokenUsed(
      updateRefreshDto.parse({
        userId: keyToken._id,
        refreshToken: tokens?.refreshToken,
        refreshTokenUsed: refreshToken
      })
    )
    if (!newKeyToken) {
      throw new BadRequestException('Error: newKeyToken is not defined')
    }

    // 6. return response
    return {
      data: {
        id: newKeyToken.user,
        role: shop.roles,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    }
  }

  static async blacklistToken(token: string) {
    const { exp } = JWTUtils.decodeToken(token)
    console.log(`AccessService - exp: ${exp}`)
    await redis.getInstance().set(token, this.BLACKLISTED, 'EX', exp!)
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    return (await redis.getInstance().get(token)) === this.BLACKLISTED
  }
}

export { AccessService }
