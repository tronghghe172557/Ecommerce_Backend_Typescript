import { Request, Response } from 'express'
import { HttpStatusCode } from '~/base/common/enums'
import { checkoutSchema } from '~/modules/Checkouts/dtos'
import { CheckoutService } from '~/modules/Checkouts/services'
export class CheckoutController {
  static checkOutReview = async (req: Request, res: Response) => {
    const dto = checkoutSchema.parse(req.body)
    res.status(HttpStatusCode.OK).json({
      message: 'Checkout successfully',
      ...(await CheckoutService.checkOutReview(dto))
    })
  }
  static async orderByUser() {}
  static async getOrdersByUser() {}
  static async getOneOrderByUser() {}
  static async cancelOneOrderByUser() {}
  static async updateOrderByShop() {}
}
