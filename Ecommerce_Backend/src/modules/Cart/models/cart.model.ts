import mongoose, { Schema, Model } from 'mongoose'
import { baseModelSchemaDefinition } from '~/base/common/models'
import { CartState } from '~/modules/Cart/enums'
import { ICartDto, ICartProductDto } from '~/modules/Cart/dtos'

const cartSchema: Schema<ICartDto> = new Schema(
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
    collection: 'carts'
  }
)

// Update cart_count_product before saving
cartSchema.pre('save', function (next) {
  this.cart_count_product = this.cart_products.reduce((total, item) => total + item.product_quantity, 0)
  return next()
})

// Update cart_count_product before updating
cartSchema.pre('updateOne', async function (next) {
  // 'this' refers to the query, not the document
  const docToUpdate = await this.model.findOne(this.getQuery())
  if (docToUpdate) {
    const count = docToUpdate.cart_products.reduce(
      (total: number, item: ICartProductDto) => total + item.product_quantity,
      0
    )
    this.set({ cart_count_product: count })
  }
  next()
})

// Create index for faster queries
cartSchema.index({ cart_userId: 1 })

const CartModel: Model<ICartDto> = mongoose.model<ICartDto>('Cart', cartSchema)

export { CartModel }
