import { z } from 'zod'

const shopDiscount = z.object({
  shop_id: z.string(),
  discount_id: z.string(),
  code: z.string()
})

export const itemProductCheckout = z.object({
  product_id: z.string(),
  product_price: z.coerce.number(),
  product_quantity: z.coerce.number(),
  product_name: z.string()
})

const shopOrder = z.object({
  shop_id: z.string(),
  shop_discounts: z.array(shopDiscount).optional().default([]),
  item_products: z.array(itemProductCheckout).default([])
})

export const checkoutSchema = z.object({
  cartId: z.string(),
  userId: z.string(),
  shop_order_ids: z.array(shopOrder).default([])
})

// Schema cho checkout order
export const checkoutOrderSchema = z.object({
  totalPrice: z.number(),
  freeShip: z.number(),
  totalDiscount: z.number(),
  totalCheckout: z.number()
})

// Schema cho item checkout
export const itemCheckoutSchema = z.object({
  shop_id: z.string(),
  shop_discounts: z.array(shopDiscount).default([]),
  priceRaw: z.number(), // price before discount
  priceApplyDiscount: z.number(), // price after discount
  item_products: z.array(itemProductCheckout)
})

// Schema cho kết quả trả về của hàm checkOutReview
export const checkoutReviewResultSchema = z.object({
  shop_order_ids: z.array(shopOrder),
  shop_order_ids_new: z.array(itemCheckoutSchema),
  checkout_order: checkoutOrderSchema
})

export type ICheckout = z.infer<typeof checkoutSchema>
export type IShopOrder = z.infer<typeof shopOrder>
export type IShopDiscount = z.infer<typeof shopDiscount>
export type ItemProductCheckout = z.infer<typeof itemProductCheckout>
export type CheckoutOrder = z.infer<typeof checkoutOrderSchema>
export type ItemCheckout = z.infer<typeof itemCheckoutSchema>
export type CheckoutReviewResult = z.infer<typeof checkoutReviewResultSchema>
