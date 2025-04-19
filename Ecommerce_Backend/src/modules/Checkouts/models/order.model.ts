import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import { CheckoutOrder, ItemCheckout } from '~/modules/Checkouts/dtos'
import { OrderStatus, PaymentMethod } from '~/modules/Checkouts/enums'

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

export interface IOrder extends BaseModel {
  order_userId: string
  order_checkout: CheckoutOrder
  order_shipping_address: string
  order_payment: PaymentMethod
  order_products: ItemCheckout[]
  order_trackingNumber: string
  order_status: OrderStatus
  order_note: string
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    ...baseModelSchemaDefinition,
    order_userId: {
      type: String,
      required: true,
      index: true
    },
    order_checkout: {
      type: {
        totalPrice: Number,
        feeShip: Number,
        totalCheckout: Number,
        totalDiscount: Number
      },
      required: true
    },
    order_shipping_address: {
      type: String,
      required: true
    },
    order_payment: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.COD
    },
    order_products: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
      required: true
    },
    order_trackingNumber: {
      type: String,
      unique: true,
      default: () => `#${Math.floor(Math.random() * 1000000)}${Date.now()}`
    },
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true
    },
    order_note: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const OrderModel: Model<IOrder> = mongoose.model<IOrder>(DOCUMENT_NAME, orderSchema)

export { OrderModel }
