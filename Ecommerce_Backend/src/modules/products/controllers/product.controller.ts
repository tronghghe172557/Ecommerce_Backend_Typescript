import { createProductDto } from '~/modules/products/dtos'
import { Request, Response } from 'express'
import { HttpStatusCode } from '~/base/common/enums'
import { ProductFactory } from '~/modules/products/services'
import { queryQueryProductDto } from '~/modules/products/dtos'
export class ProductController {
  /**
   * `[POST] /api/v1/products`
   */
  static createProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    const dto = createProductDto.parse(req.body)
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
   * `[GET] /api/v1/products/`
   */
  static getProducts = async (req: Request, res: Response) => {
    // TO DO CODE
    const dto = queryQueryProductDto.parse(req.query)
    res.status(HttpStatusCode.OK).json(await ProductFactory.getProduct(dto, false))
  }

  /**
   * `[GET] /api/v1/products/deleted`
   */
  static getProductDeleted = async (req: Request, res: Response) => {
    // TO DO CODE
    const dto = queryQueryProductDto.parse(req.query)
    res.status(HttpStatusCode.OK).json(await ProductFactory.getProductDeleted(dto, true))
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
