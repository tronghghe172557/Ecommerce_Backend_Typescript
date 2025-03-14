import { IClothingDto, IElectronicDto } from '~/modules/products/dtos'
import { ICreateProductDto } from '~/modules/products/dtos'
import { ClothingModel, ElectronicModel, ProductModel } from '~/modules/products/models'
import { BadRequestException } from '~/base/common/exceptions'
import { ProductType } from '../enums'

export class ProductFactory {
  static async createProduct(type: string, product: ICreateProductDto) {
    switch (type) {
      case ProductType.Clothing:
        return await new Clothing(product).createProduct()
      case ProductType.Electronic:
        return await new Electronic(product).createProduct()
      default:
        throw new BadRequestException(`Invalid product type: ${type}`)
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

  constructor({
    product_name,
    product_thumbnail,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attribute
  }: ICreateProductDto) {
    this.product_name = product_name
    this.product_thumbnail = product_thumbnail
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attribute = product_attribute
  }

  async createProduct() {
    return await ProductModel.create(this)
  }
}

class Clothing extends Product {
  // @override
  async createProduct() {
    const newClothing = await ClothingModel.create(this.product_attribute)

    if (!newClothing) {
      throw new BadRequestException('Failed to create clothing')
    }

    const newProduct = super.createProduct()

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

    const newProduct = super.createProduct()
    if (!newProduct) {
      throw new BadRequestException('Failed to create product')
    }

    return newProduct
  }
}
