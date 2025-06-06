import { createProductDto, pubProductDto, unPubProductDto, updateProductDto } from '~/modules/products/dtos'
import { Request, Response } from 'express'
import { HttpStatusCode } from '~/base/common/enums'
import { ProductFactory } from '~/modules/products/services'
import { queryQueryProductDto } from '~/modules/products/dtos'
export class ProductController {
  /**
   * `[POST] /api/v1/products`
   */
  static createProduct = async (req: Request, res: Response) => {
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
   * `[GET] /api/v1/unpublish-product`
   */
  static unPublishProductByShop = async (req: Request, res: Response) => {
    const dto = queryQueryProductDto.parse(req.query)
    res.status(HttpStatusCode.OK).json(await ProductFactory.getProduct(dto, false, false, true))
  }

  /**
   * `[PUT] /api/v1/products/:productId`
   */
  static updateProduct = async (req: Request, res: Response) => {
    const dto = updateProductDto.parse(req.body)
    res.status(HttpStatusCode.OK).json(await ProductFactory.updateProduct(dto.product_type, req.params.productId!, dto))
  }

  /**
   * `[POST] /api/v1/products/:productId/publish-product`
   */
  static publishProduct = async (req: Request, res: Response) => {
    const dto = pubProductDto.parse(req.body)
    res.status(HttpStatusCode.OK).json({
      message: 'Publish product successfully',
      ...(await ProductFactory.publishProduct(dto))
    })
  }

  /**
   * `[POST] /api/v1/products/:productId/unpublish-product`
   */
  static unpublishProduct = async (req: Request, res: Response) => {
    const dto = unPubProductDto.parse(req.body)
    res.status(HttpStatusCode.OK).json({
      message: 'Unpublish product successfully',
      ...(await ProductFactory.unpublishProduct(dto))
    })
  }

  /**
   * `[DELETE] /api/v1/products/:productId/delete-product`
   */
  static deleteProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    res.status(HttpStatusCode.OK).json({
      message: 'Delete product successfully',
      ...(await ProductFactory.deleteProduct(req.params.productId!))
    })
  }

  /**
   * `[POST] /api/v1/products/:productId/restore-product`
   */
  static restoreProduct = async (req: Request, res: Response) => {
    // TO DO CODE
    res.status(HttpStatusCode.OK).json({
      message: 'Restore product successfully',
      ...(await ProductFactory.restoreProduct(req.params.productId!))
    })
  }
}
