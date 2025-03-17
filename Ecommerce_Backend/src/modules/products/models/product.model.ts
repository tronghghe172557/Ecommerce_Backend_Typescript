import slugify from 'slugify'

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
  product_ratingAverage: number
  product_slug: string
  product_variants: Array<IClothing | IElectronic>
  isDraft: boolean
  isPublished: boolean
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
  },
  // more fields
  product_ratingAverage: {
    type: Number,
    default: 4,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    // 4.333334 => 4.3
    set: (val: number) => Math.round(val * 10) / 10
  },
  product_slug: {
    type: String
  },
  product_variants: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false // hide this field from the query result
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: false // hide this field from the query result
  }
})

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const ProductModel: Model<IProduct> = mongoose.model<IProduct>(DOCUMENT_NAME, productSchema)

export { ProductModel }
