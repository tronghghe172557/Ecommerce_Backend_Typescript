import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import mongoose, { Schema, Model } from 'mongoose'
import { IClothing, IElectronic } from '~/modules/products/models'
import { ProductType } from '~/modules/products/enums'

const DOCUMENT_NAME = 'Product'

export interface IProduct extends BaseModel {
  product_name: string
  product_thumbnail: string
  product_description: string
  product_price: number
  product_quantity: number
  product_type: ProductType.Clothing | ProductType.Electronic | ProductType.Furniture
  product_shop: string
  product_attribute: IClothing | IElectronic
}

const productSchema: Schema<IProduct> = new Schema({
  ...baseModelSchemaDefinition,
  product_name: {
    type: String,
    required: true
  },
  product_thumbnail: {
    type: String,
    required: true
  },
  product_description: {
    type: String
  },
  product_price: {
    type: Number,
    required: true
  },
  product_quantity: {
    type: Number,
    required: true
  },
  product_type: {
    type: String,
    required: true,
    enum: [ProductType.Clothing, ProductType.Electronic, ProductType.Furniture]
  },
  product_shop: {
    type: String,
    ref: 'Shop'
  },
  product_attribute: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
})

const ProductModel: Model<IProduct> = mongoose.model<IProduct>(DOCUMENT_NAME, productSchema)

export { ProductModel }
