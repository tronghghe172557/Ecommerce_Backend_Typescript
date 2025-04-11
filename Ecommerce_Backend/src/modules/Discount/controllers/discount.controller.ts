import { DiscountService } from '~/modules/Discount/services'
import { createDiscountDto, queryDiscountDto } from '~/modules/Discount/dtos'
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
  static GetAllDiscountCodesForShop = async (req: Request, res: Response) => {
    const dto = queryDiscountDto.parse(req.query)
    console.log(dto)
    res.status(HttpStatusCode.OK).json({
      message: 'Get all codes by shop successfully',
      data: await DiscountService.getAllDiscountCodesForShop(dto)
    })
  }

  /**
   * [GET] /api/v1/products/discounts
   * @param req
   * @param res
   * @returns
   * @description Get all products by discount codes
   */
  static GetAllProductsByDiscountCodes = async (req: Request, res: Response) => {
    const dto = queryDiscountDto.parse(req.query)
    res.status(HttpStatusCode.OK).json({
      message: 'Get all products by discount codes successfully',
      data: await DiscountService.getAllProductsWithDiscountCodes(dto)
    })
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
