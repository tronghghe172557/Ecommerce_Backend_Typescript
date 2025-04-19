import z from 'zod'
import { shopOrder } from './checkout.dto'
import { OrderStatus, PaymentMethod } from '~/modules/Checkouts/enums'

export const orderSchema = z.object({
  order_userId: z.string(),
  order_checkout: z.object({
    totalPrice: z.coerce.number(),
    feeShip: z.coerce.number(),
    totalCheckout: z.coerce.number(),
    totalDiscount: z.coerce.number()
  }),
  order_shipping_address: z.string(),
  // Sử dụng nativeEnum để bao gồm tất cả các giá trị từ enum PaymentMethod
  order_payment: z.nativeEnum(PaymentMethod).default(PaymentMethod.COD),
  order_products: z.array(shopOrder).default([]),
  order_trackingNumber: z.string().optional(),
  // Tương tự với OrderStatus, có thể sử dụng nativeEnum nếu bạn muốn dùng tất cả giá trị
  order_status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  order_note: z.string().default('')
})

export const createOrderSchema = z.object({
  cart_id: z.string(),
  user_id: z.string(),
  shop_order_ids: z.array(shopOrder).default([]),
  user_address: z.string(),
  user_payment: z.nativeEnum(PaymentMethod).default(PaymentMethod.COD),
  user_note: z.string().default('')
})

export type IOrder = z.infer<typeof orderSchema>
export type ICreateOrder = z.infer<typeof createOrderSchema>
