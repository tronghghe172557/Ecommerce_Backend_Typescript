import { cartDto, IAddProduct, ICartDto, ICreateCart, IDeleteProduct, IUpdateCart } from '~/modules/Cart/dtos'
import { CartModel } from '../models'
import { SuccessResponseBody } from '~/base/common/types'
import { BadRequestException } from '~/base/common/exceptions'
import { ProductModel } from '~/modules/products/models'
import { CartState } from '~/modules/Cart/enums'

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

  static async addToCart({
    shopId,
    cart_id,
    cart_userId,
    item_products
  }: IAddProduct): Promise<SuccessResponseBody<ICartDto>> {
    const product = item_products[0]

    // 1. check product exist
    const findProduct = await ProductModel.findById(product.product_id).lean().exec()

    if (!findProduct) {
      throw new BadRequestException('Product not found')
    }

    // 2. check shopId and quantity
    if (findProduct.product_shop !== shopId) {
      throw new BadRequestException('Product not belong to this shop')
    }

    if (findProduct.product_quantity < product.product_quantity) {
      throw new BadRequestException('Product quantity is not enough')
    }

    // 3. check cart exist
    const cart = await CartModel.findOne({ _id: cart_id }).lean().exec()

    if (!cart) {
      // 3.1 create cart
      const newCart = new CartModel({
        cart_userId,
        cart_products: [
          {
            product_id: findProduct._id,
            product_price: findProduct.product_price,
            product_quantity: findProduct.product_quantity,
            product_name: findProduct.product_name,
            product_thumb: findProduct.product_thumbnail
          }
        ]
      })

      await newCart.save()
      return {
        data: cartDto.parse(newCart)
      }
    }

    // 3. update cart
    const updateCart = await CartModel.findOneAndUpdate(
      { cart_userId, 'cart_products.product_id': product.product_id, cart_state: CartState.ACTIVE },
      {
        $inc: {
          // is the operator to increment the value of the field by the specified amount
          'cart_products.$.product_quantity': product.product_quantity // the $ positional operator to used to identify the element in the array that matches the query condition
          // the $ positional operator to used to identify the element in the array that matches the query condition
        }
      },
      {
        new: true
      }
    )

    if (!updateCart) {
      throw new BadRequestException('Add product to cart failed')
    }

    // !!! increase product quantity in inventory !!!

    return {
      data: cartDto.parse(updateCart)
    }
  }

  static async deleteCartItem({
    cart_userId,
    cartId,
    productId
  }: IDeleteProduct): Promise<SuccessResponseBody<ICartDto>> {
    // 1. Check if cart exists and belongs to this user
    const cart = await CartModel.findOne({
      _id: cartId,
      cart_userId,
      cart_state: CartState.ACTIVE
    })

    if (!cart) {
      throw new BadRequestException('Cart not found or does not belong to user')
    }

    // 2. Check if product exists in cart
    const productExists = cart.cart_products.some((item) => item.product_id === productId)

    if (!productExists) {
      throw new BadRequestException('Product not found in cart')
    }

    // 3. Remove the product from cart_products array
    const updatedCart = await CartModel.findOneAndUpdate(
      { _id: cartId, cart_userId },
      {
        $pull: {
          // $pull operator removes from an existing array all instances of a value that match a condition
          cart_products: { product_id: productId }
        }
      },
      { new: true }
    )
      .lean()
      .exec()

    if (!updatedCart) {
      throw new BadRequestException('Delete cart item failed')
    }

    return {
      data: cartDto.parse(updatedCart)
    }
  }

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
