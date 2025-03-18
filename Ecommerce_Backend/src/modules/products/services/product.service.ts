import { v4 as uuidv4 } from 'uuid'
import { RootFilterQuery, SortOrder } from 'mongoose'

import {
  deleteProductDto,
  IClothingDto,
  IElectronicDto,
  IProductDto,
  IQueryProductDto,
  productDto
} from '~/modules/products/dtos'
import { ICreateProductDto } from '~/modules/products/dtos'
import { ClothingModel, ElectronicModel, IProduct, ProductModel } from '~/modules/products/models'
import { BadRequestException } from '~/base/common/exceptions'
import { ProductType } from '~/modules/products/enums'
import { SuccessResponseBody } from '~/base/common/types'

export class ProductFactory {
  // OPTIMIZE: Refactor this method to use a factory pattern
  static productRegistry: Record<string, typeof Product> = {}

  static registerProduct(type: string, classRef: typeof Product) {
    ProductFactory.productRegistry[type] = classRef
  }

  // FUNCTION
  // static getProdcut(commonQuery: IQueryProductDto & { deleted?: false }): Promise<SuccessResponseBody<IProductDto[]>>

  //
  static async createProduct(type: string, payload: ICreateProductDto) {
    const productClass = ProductFactory.productRegistry[type]

    if (!productClass) throw new BadRequestException(`Invalid Product Types: ${type} in ProductFactory`)

    // productClass(payload) ->Ex: new Clothing(payload)
    return new productClass(payload).createProduct()
  }

  static async getProduct(
    { page, pageSize, sorting, deleted }: IQueryProductDto,
    isDeleted: boolean
  ): Promise<SuccessResponseBody<IProductDto[]>> {
    // 1. query filter
    const queryFilter: RootFilterQuery<IProduct> = {
      deleteTimestamp: isDeleted ? { $ne: null } : null
    }

    // 2. To do: add more query filter: limit, skip, sort, ....
    const query = ProductModel.find(queryFilter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(
        sorting.map(({ field, direction }) => {
          return [field, direction] as [string, SortOrder]
        })
      )

    // 3. get product by query
    const products = await query.exec()

    // 4. count total product, total page
    const total = await ProductModel.countDocuments(queryFilter).exec()
    const totalPage = Math.ceil(total / pageSize)

    return {
      data: products.map((product) => (deleted ? deleteProductDto.parse(product) : productDto.parse(product))),
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          totalPage,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPage
        },
        sorting
      }
    }
  }

  static async getProductDeleted(
    { page, pageSize, sorting, deleted }: IQueryProductDto,
    isDeleted: boolean
  ): Promise<SuccessResponseBody<IProductDto[]>> {
    return this.getProduct({ page, pageSize, sorting, deleted }, isDeleted)
  }
}

class Product {
  public product_name: string
  public product_thumbnail: string
  public product_description: string
  public product_price: number
  public product_quantity: number
  public product_type: ProductType.Clothing | ProductType.Electronic | ProductType.Furniture
  public product_shop: string
  public product_attribute: IClothingDto | IElectronicDto
  public product_ratingAverage: number
  public product_slug?: string
  public product_variants?: []
  public isDraft?: boolean
  public isPublished?: boolean

  constructor({
    product_name,
    product_thumbnail,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attribute,
    product_ratingAverage
  }: ICreateProductDto) {
    this.product_name = product_name
    this.product_thumbnail = product_thumbnail
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attribute = product_attribute
    this.product_ratingAverage = product_ratingAverage
  }

  async createProduct(product_id: string = uuidv4()) {
    return await ProductModel.create({ ...this, _id: product_id })
  }
}

class Clothing extends Product {
  // @override
  async createProduct() {
    const newClothing = await ClothingModel.create(this.product_attribute)

    if (!newClothing) {
      throw new BadRequestException('Failed to create clothing')
    }

    const newProduct = super.createProduct(newClothing._id)

    if (!newProduct) {
      throw new BadRequestException('Failed to create product')
    }

    return newProduct
  }
}
class Electronic extends Product {
  // @override
  async createProduct() {
    const newElectronic = await ElectronicModel.create(this.product_attribute)

    if (!newElectronic) {
      throw new BadRequestException('Failed to create electronic')
    }

    const newProduct = super.createProduct(newElectronic._id)
    if (!newProduct) {
      throw new BadRequestException('Failed to create product')
    }

    return newProduct
  }
}

// register product type
ProductFactory.registerProduct('Clothing', Clothing)
ProductFactory.registerProduct('Electronics', Electronic)
