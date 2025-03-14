import { createProductDto } from '~/modules/products/dtos'
import { Request, Response } from 'express'
import { HttpStatusCode } from '~/base/common/enums'
import { ProductFactory } from '~/modules/products/services'
export class ProductController {
  /**
   * `[POST] /api/v1/products`
   */
  static createProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    console.log('req.body:', req.body)
    const dto = createProductDto.parse(req.body)
    console.log('dto:', dto)
    res.status(HttpStatusCode.CREATED).json(await ProductFactory.createProduct(dto.product_type, dto))
  }

  /**
   * `[POST] /api/v1/publish-product`
   */
  static publishProductByShop = () => {
    // TO DO CODE
  }

  /**
   * `[POST] /api/v1/unpublish-product`
   */
  static unPublishProductByShop = () => {
    // TO DO CODE
  }

  /**
   * `[GET] /api/v1/products/draft`
   */
  static getAllDraftProduct = () => {
    // TO DO CODE
  }

  /**
   * `[GET] /api/v1/products`
   */

  static findAllProducts = () => {
    // TO DO CODE
  }
  /**
   * `[GET] /api/v1/products/:productId`
   */
  static findProduct = () => {
    // TO DO CODE
  }

  /**
   * `[GET] /api/v1/products/all-publish`
   */
  static getAllPublishProduct = () => {
    // TO DO CODE
  }

  /**
   * `[GET] /api/v1/products/search`
   */
  static getListSearchProduct = () => {
    // TO DO CODE
  }
}
