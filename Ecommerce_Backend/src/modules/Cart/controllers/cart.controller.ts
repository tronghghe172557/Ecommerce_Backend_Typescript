import { updateCart } from './../dtos/update-cart.dto'
import { Request, Response } from 'express'
import { CartService } from '~/modules/Cart/services/cart.service'
import { HttpStatusCode } from '~/base/common/enums'
import { createCart } from '~/modules/Cart/dtos'

/*
  Cart Controller
    1 Add product to Cart [User]
    2 Reduce product quantity [User]
    3 Increase product quantity [User]
    4 Get list to Cart [User]
    5 Delete cart [User]
    6 Delete cart item [User]
*/

export class CartController {
  /**
   * [POST] /api/v1/cart
   * @description Create a new cart for user
   */
  static GetCartByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params
    res.status(HttpStatusCode.OK).json({
      message: 'find user cart successfully',
      ...(await CartService.getUserCart(userId))
    })
  }
  /**
   * [POST] /api/v1/cart
   * @description Create a new cart for user
   */
  static CreateUserCart = async (req: Request, res: Response) => {
    const dto = createCart.parse(req.body)

    res.status(HttpStatusCode.CREATED).json({
      message: 'Create user cart successfully',
      ...(await CartService.createUserCart(dto))
    })
  }

  /**
   * [PUT] /api/v1/cart
   * @description Update user cart
   */
  static UpdateUserCart = async (req: Request, res: Response) => {
    const dto = updateCart.parse(req.body)
    console.log(req.body.cartId)
    res.status(HttpStatusCode.OK).json({
      message: 'Update user cart successfully',
      ...(await CartService.updateUserCart(dto, req.body.cartId!))
    })
  }

  /**
   * [POST] /api/v1/cart/add
   * @description Add product to cart
   */
  static AddToCart = async (req: Request, res: Response) => {
    const { userId, product } = req.body

    res.status(HttpStatusCode.OK).json({
      message: 'Add product to cart successfully',
      data: await CartService.addToCart()
    })
  }

  /**
   * [DELETE] /api/v1/cart
   * @description Delete user cart
   */
  static DeleteCart = async (req: Request, res: Response) => {
    await CartService.deleteCart(req.body.cartId!)
    res.status(HttpStatusCode.OK).json({
      message: 'Delete cart successfully'
    })
  }

  /**
   * [DELETE] /api/v1/cart/item
   * @description Delete cart item
   */
  static DeleteCartItem = async (req: Request, res: Response) => {
    const { userId, cartId, productId } = req.body

    res.status(HttpStatusCode.OK).json({
      message: 'Delete cart item successfully',
      data: await CartService.deleteCartItem()
    })
  }
}
