import { Request, Response } from 'express'
import { CartService } from '~/modules/Cart/services/cart.service'
import { HttpStatusCode } from '~/base/common/enums'

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
   * [POST] /api/v1/carts
   * @description Create a new cart for user
   */
  static CreateUserCart = async (req: Request, res: Response) => {
    const userId = req.body.userId

    res.status(HttpStatusCode.CREATED).json({
      message: 'Create user cart successfully',
      data: await CartService.createUserCart()
    })
  }

  /**
   * [PUT] /api/v1/carts
   * @description Update user cart
   */
  static UpdateUserCart = async (req: Request, res: Response) => {
    const { userId, cartId, payload } = req.body

    res.status(HttpStatusCode.OK).json({
      message: 'Update user cart successfully',
      data: await CartService.updateUserCart()
    })
  }

  /**
   * [POST] /api/v1/carts/add
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
   * [GET] /api/v1/carts
   * @description Get user cart
   */
  static GetUserCart = async (req: Request, res: Response) => {
    const userId = req.query.userId as string

    res.status(HttpStatusCode.OK).json({
      message: 'Get user cart successfully',
      data: await CartService.getUserCart()
    })
  }

  /**
   * [DELETE] /api/v1/carts
   * @description Delete user cart
   */
  static DeleteCart = async (req: Request, res: Response) => {
    const { userId, cartId } = req.body

    res.status(HttpStatusCode.OK).json({
      message: 'Delete cart successfully',
      data: await CartService.deleteCart()
    })
  }

  /**
   * [DELETE] /api/v1/carts/item
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
