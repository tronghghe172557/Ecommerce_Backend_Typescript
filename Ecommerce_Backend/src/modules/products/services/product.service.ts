import { v4 as uuidv4 } from 'uuid'
import { RootFilterQuery, SortOrder } from 'mongoose'

import {
  deleteProductDto,
  IClothingDto,
  IDeleteProductDto,
  IElectronicDto,
  IProductDto,
  IPubProductDto,
  IQueryProductDto,
  IUnPubProductDto,
  productDto
} from '~/modules/products/dtos'
import { ICreateProductDto } from '~/modules/products/dtos'
import { ClothingModel, ElectronicModel, IProduct, ProductModel } from '~/modules/products/models'
import { BadRequestException } from '~/base/common/exceptions'
import { ProductType } from '~/modules/products/enums'
import { SuccessResponseBody } from '~/base/common/types'
import { UpdateProductDto } from '~/modules/products/dtos'
import { updateNestedObjectParse } from '../utils'
import { pushNotiToSystem } from '~/modules/Notification/services'
import { NotificationType } from '~/modules/Notification/enums'
import { MessageQueueUtils } from '~/base/common/utils'
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
    isDeleted: boolean,
    isPublished: boolean = true,
    isDraft: boolean = false
  ): Promise<SuccessResponseBody<IProductDto[]>> {
    // 1. query filter
    const queryFilter: RootFilterQuery<IProduct> = {
      deleteTimestamp: isDeleted ? { $ne: null } : null,
      isPublished: isPublished,
      isDraft: isDraft
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

  static async getProductById(productId: string): Promise<SuccessResponseBody<IProductDto>> {
    const product = await ProductModel.findById(productId).lean().exec()

    return {
      data: productDto.parse(product)
    }
  }

  static async updateProduct(type: string, productId: string, updateProduct: UpdateProductDto) {
    /*
      1. check product exist
      2. update product
      3. return
    */
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestException(`Invalid Product Types: ${type} in ProductFactory`)

    // 1. check product exist
    const product = await ProductModel.findById(productId).lean().exec()
    if (!product) throw new BadRequestException(`Product not found: ${productId}`)
    // 2. update product
    // issue: updateProduct ở đây chỉ là những trường cần update, không phải là toàn bộ product
    // -> khi new productClass mới -> các trường có thể undefined
    // -> solution: dùng static method thay vì dùng constructor (new product)
    // -> use static method to update product
    return productClass.updateProduct(productId, updateProduct)
  }

  static async publishProduct({ product_shop, product_id }: IPubProductDto): Promise<SuccessResponseBody<IProductDto>> {
    // 1, check product exist
    const foundProduct = await ProductModel.findOne({
      _id: product_id,
      product_shop: product_shop
    })
      .lean()
      .exec()
    if (foundProduct === null) {
      throw new BadRequestException(`Product not found: ${product_id}`)
    }

    foundProduct.isPublished = true
    foundProduct.isDraft = false

    const product = await ProductModel.findByIdAndUpdate(product_id, foundProduct, { new: true })

    return {
      data: productDto.parse(product)
    }
  }
  static async unpublishProduct({
    product_shop,
    product_id
  }: IUnPubProductDto): Promise<SuccessResponseBody<IProductDto>> {
    // 1, check product exist
    const foundProduct = await ProductModel.findOne({
      _id: product_id,
      product_shop: product_shop
    })
      .lean()
      .exec()

    console.log(foundProduct)
    if (foundProduct === null) {
      throw new BadRequestException(`Product not found: ${product_id}`)
    }

    foundProduct.isPublished = false
    foundProduct.isDraft = true

    const product = await ProductModel.findByIdAndUpdate(product_id, foundProduct, { new: true })

    return {
      data: productDto.parse(product)
    }
  }

  static async deleteProduct(productId: string): Promise<SuccessResponseBody<IDeleteProductDto>> {
    const foundProduct = await ProductModel.findById(productId).lean().exec()

    if (!foundProduct) {
      throw new BadRequestException(`Product not found: ${productId}`)
    }

    foundProduct.deleteTimestamp = new Date()

    return {
      data: deleteProductDto.parse(await ProductModel.findByIdAndUpdate(productId, foundProduct, { new: true }))
    }
  }
  static async restoreProduct(productId: string): Promise<SuccessResponseBody<IProductDto>> {
    const foundProduct = await ProductModel.findById(productId).lean().exec()

    if (!foundProduct) {
      throw new BadRequestException(`Product not found: ${productId}`)
    }

    return {
      data: productDto.parse(await ProductModel.findByIdAndUpdate(productId, { deleteTimestamp: null }, { new: true }))
    }
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
  private messageQueueUtils = new MessageQueueUtils()

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
    const newProduct = await ProductModel.create({ ...this, _id: product_id })

    if (newProduct) {
      // 1. save notification in DB
      pushNotiToSystem({
        noti_type: NotificationType.SHOP_NEW_PRODUCT,
        noti_senderId: this.product_shop,
        noti_receivedId: 'test-user',
        noti_content: `@@@ add new product: ${this.product_name} @@@@`,
        noti_options: {
          product_id: newProduct._id,
          product_name: this.product_name,
          shop_name: this.product_shop
        }
      })
        .then((res) => {
          console.log('Push notification successfully', res)
        })
        .catch((err) => {
          console.log('Push notification failed', err)
        })

      // 2. Add message queue notification for more reliable processing
      try {
        const productMsg = JSON.stringify({
          type: NotificationType.SHOP_NEW_PRODUCT,
          senderId: this.product_shop,
          data: {
            product_id: newProduct._id,
            product_name: this.product_name,
            product_shop: this.product_shop,
            created_at: new Date()
          }
        })

        // nếu dùng static method, thì nó trỏ đến class chứ không phải là instance 
        // -> this.messageQueueUtils không có connection với RabbitMQ được
        await this.messageQueueUtils.sendMessageWhenNewProduct(productMsg)
      } catch (error) {
        throw new BadRequestException(`Error when send message to RabbitMQ in Product class: ${error}`)
      }
    }
    return newProduct
  }

  static async updateProduct(productId: string, updateProduct: object) {
    return await ProductModel.findByIdAndUpdate(productId, updateProduct, { new: true }).lean().exec()
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

  static async updateProduct(productId: string, updateProduct: UpdateProductDto) {
    // 1. update clothing'
    if (updateProduct.product_attribute) {
      const bodyUpdate = updateNestedObjectParse(updateProduct.product_attribute)

      // find clothing by product_id beacause product_id and clothing_id are the same
      await ClothingModel.findByIdAndUpdate(productId, bodyUpdate, { new: true }).lean().exec()
    }

    // 2. update product
    return await super.updateProduct(productId, updateNestedObjectParse(updateProduct))
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

  static async updateProduct(productId: string, updateProduct: UpdateProductDto) {
    // 1. update clothing'
    if (updateProduct.product_attribute) {
      const bodyUpdate = updateNestedObjectParse(updateProduct.product_attribute)

      // find clothing by product_id beacause product_id and clothing_id are the same
      // làm phẳng dữ liệu khi truyền vào để không ghi đè hết lên product_attribute mà chỉ ghi đè những trường cần update
      await ElectronicModel.findByIdAndUpdate(productId, bodyUpdate, { new: true }).lean().exec()
    }

    // 2. update product
    return await super.updateProduct(productId, updateNestedObjectParse(updateProduct))
  }
}

// register product type
ProductFactory.registerProduct('Clothing', Clothing)
ProductFactory.registerProduct('Electronics', Electronic)
