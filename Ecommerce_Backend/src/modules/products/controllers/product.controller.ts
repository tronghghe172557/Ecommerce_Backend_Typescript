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
   * `[GET] /api/v1/products/`
   */
  static getProducts = async (req: Request, res: Response) => {
    const dto = queryQueryProductDto.parse(req.query)
    res.status(HttpStatusCode.OK).json(await ProductFactory.getProduct(dto, false, true, false))
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
   * `[GET] /api/v1/products/:productId`
   */
  static getProductById = async (req: Request, res: Response) => {
    // TO DO CODE
    const productId = req.params.productId
    res.status(HttpStatusCode.OK).json(await ProductFactory.getProductById(productId))
  }

  /**
   * `[POST] /api/v1/unpublish-product`
   */
  static unPublishProductByShop = async (req: Request, res: Response) => {
    const dto = queryQueryProductDto.parse(req.query)
    res.status(HttpStatusCode.OK).json(await ProductFactory.getProduct(dto, false, false, true))
  }

  /**
   * `[PUT] /api/v1/products/:productId`
   */
  static updateProduct = async (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json(await ProductFactory.updateProduct)
  }

  /**
   * `[POST] /api/v1/products/:productId/publish-product`
   */
  static publishProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    res.status(HttpStatusCode.OK).json(await ProductFactory.publishProduct)
  }

  /**
   * `[POST] /api/v1/products/:productId/unpublish-product`
   */
  static unpublishProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    res.status(HttpStatusCode.OK).json(await ProductFactory.unpublishProduct)
  }

  /**
   * `[DELETE] /api/v1/products/:productId/delete-product`
   */
  static deleteProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    res.status(HttpStatusCode.OK).json(await ProductFactory.deleteProduct)
  }

  /**
   * `[POST] /api/v1/products/:productId/restore-product`
   */
  static restoreProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    res.status(HttpStatusCode.OK).json(await ProductFactory.registerProduct)
  }
}
