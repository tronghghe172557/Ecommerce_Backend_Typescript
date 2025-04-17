import { cartDto, ICartDto, ICreateCart, IUpdateCart } from '~/modules/Cart/dtos'
import { CartModel } from '../models'
import { SuccessResponseBody } from '~/base/common/types'
import { BadRequestException } from '~/base/common/exceptions'

export class CartService {
  /*
    Cart Service
        1 Add product to Cart [User]
        2 Reduce product quantity [User]
        3 Increase product quantity [User]
        4 Get list to Cart [User]
        5 Delete cart [User]
        6 Delete cart item [User]
*/

  static async getUserCart(userId: string | undefined): Promise<SuccessResponseBody<ICartDto>> {
    const cart = await CartModel.findOne({ cart_userId: userId })

    if (!cart) {
      throw new BadRequestException('User cart not found')
    }

    return {
      data: cartDto.parse(cart)
    }
  }

  static async createUserCart({ cart_products, cart_userId }: ICreateCart): Promise<SuccessResponseBody<ICartDto>> {
    const cart = new CartModel({
      cart_products,
      cart_userId
    })

    await cart.save()

    return {
      data: cartDto.parse(cart)
    }
  }

  static async updateUserCart(dataUpdateCart: IUpdateCart, cartId: string): Promise<SuccessResponseBody<ICartDto>> {
    // {dataUpdateCart}: được hiểu là {dataUpdateCart: dataUpdateCart} => ko tìm thấy trong db => ko update được
    // const cart = await CartModel.findOneAndUpdate({ _id: cartId }, {dataUpdateCart}, { new: true }).lean().exec()
    const cart = await CartModel.findOneAndUpdate({ _id: cartId }, dataUpdateCart, { new: true }).lean().exec()

    if (!cart) {
      throw new BadRequestException('Cart not found')
    }

    return {
      data: cartDto.parse(cart)
    }
  }

  static async addToCart() {}
  static async deleteCartItem() {}

  static async deleteCart(cartId: string | undefined) {
    if (!cartId) {
      throw new BadRequestException('Cart ID is required')
    }

    const deleteCart = await CartModel.updateOne({ _id: cartId }, { deleteTimestamp: Date.now() })

    // if the system can, it should have a Model to save the deleted cart to follow up user behavior

    if (deleteCart.modifiedCount === 0) {
      throw new BadRequestException('Cart delete failed or cart is deleted')
    }
  }
}
