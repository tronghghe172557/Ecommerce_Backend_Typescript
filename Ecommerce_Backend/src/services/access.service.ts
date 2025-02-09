import roleShop from '~/constants/role'
import { ISignUp } from '~/types/signup.type'
import ShopModel from '~/models/shop.model'
import { createShop, findShopByEmail } from '~/models/repository/shop.repo'
import { IMessage } from '~/types/message.type'
import bcrypt from 'bcrypt'
import { IShop } from '~/models/shop.model'
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
