import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import { CartState } from '~/modules/Cart/enums'

export interface CartProduct {
  product_id: string
  product_price: number
  product_quantity: number
  product_name: string
  product_thumb: string
}

export interface ICart extends BaseModel {
  cart_state: CartState
  cart_products: Array<CartProduct>
  cart_count_product: number
  cart_userId: string
}

const cartSchema: Schema<ICart> = new Schema(
  {
    ...baseModelSchemaDefinition,
    cart_state: {
      type: String,
      required: true,
      enum: Object.values(CartState),
      default: CartState.ACTIVE
    },
    cart_products: {
      type: [
        {
          product_id: { type: String, required: true },
          product_price: { type: Number, required: true },
          product_quantity: { type: Number, required: true },
          product_name: { type: String, required: true },
          product_thumb: { type: String, required: true }
        }
      ],
      default: [],
      required: true
    },
    cart_count_product: {
      type: Number,
      default: 0
    },
    cart_userId: {
      type: String,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'Carts'
  }
)

// Update cart_count_product before saving
cartSchema.pre('save', function (next) {
  this.cart_count_product = this.cart_products.reduce((total, item) => total + item.product_quantity, 0)
  return next()
})

// Create index for faster queries
cartSchema.index({ cart_userId: 1 })

const CartModel: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema)

export { CartModel }
