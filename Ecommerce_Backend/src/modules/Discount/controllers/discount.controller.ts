import { DiscountService } from '~/modules/Discount/services'
import { createDiscountDto, discountAmountQuerySchema, queryDiscountDto } from '~/modules/Discount/dtos'
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
   * [POST] /api/v1/discounts-amount
   */
  static DiscountAmount = async (req: Request, res: Response) => {
    const dto = discountAmountQuerySchema.parse(req.body)
    res.status(HttpStatusCode.OK).json({
      message: 'Get amount by discount successfully',
      data: await DiscountService.getDiscountAmount(dto)
    })
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

  /**
   * [POST] /api/v1/discounts/restore
   */
  static RestoreDiscountCode = async (req: Request, res: Response) => {
    const { shopId, codeId } = req.body as { shopId: string; codeId: string }
    res.status(HttpStatusCode.CREATED).json({
      message: 'Restore discount code successfully',
      data: await DiscountService.restoreDiscountCode({ shopId, codeId })
    })
  }

  /**
   * [POST] /api/v1/discounts/cancel
   */
  static CancelDiscountCode = async (req: Request, res: Response) => {
    const { shopId, codeId } = req.body as { shopId: string; codeId: string }
    res.status(HttpStatusCode.CREATED).json({
      message: 'Cancel discount code successfully',
      data: await DiscountService.restoreDiscountCode({ shopId, codeId })
    })
  }

  static UseDiscountCode = async (req: Request, res: Response) => {
    const { shopId, codeId, userId } = req.body as { shopId: string; codeId: string; userId: string }
    res.status(HttpStatusCode.CREATED).json({
      message: 'Using discount code successfully',
      data: await DiscountService.useDiscountCode({ shopId, codeId, userId })
    })
  }
}
