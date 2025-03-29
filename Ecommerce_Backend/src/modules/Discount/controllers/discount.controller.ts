import { DiscountService } from '~/modules/Discount/services'
import { createDiscountDto } from '~/modules/Discount/dtos'
import { Request, Response } from 'express'
import { HttpStatusCode } from '~/base/common/enums'
/*
    Discount services
    1 - Generate discount code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
*/

export class DiscountController {
  /**
   * [GET] /api/v1/discounts
   */
  static GetAllDiscountCodes = () => {
    // Implement code
  }

  /**
   * [GET] /api/v1/discounts
   */
  static DiscountAmount = () => {
    // Implement code
  }

  /**
   * [POST] /api/v1/discounts/generate-discount-code
   */
  static GenerateDiscountCode = async (req: Request, res: Response) => {
    const dto = createDiscountDto.parse(req.body)
    res.status(HttpStatusCode.CREATED).json({
      message: 'Create discount code successfully',
      data: await DiscountService.createDiscountCode(dto)
    })
  }

  static VerifyDiscountCode = () => {
    // Implement code
  }

  static DeleteDiscountCode = () => {
    // Implement code
  }

  static CancelDiscountCode = () => {
    // Implement code
  }
}
