import { z } from 'zod'

export const item_product = z.object({
  product_id: z.string(),
  product_price: z.coerce.number().positive(),
  product_quantity: z.coerce.number().positive().int(),
  product_shopId: z.string(),
  product_old_quantity: z.coerce.number().positive().int()
})

export const deleteCartSchema = z.object({
  cart_userId: z.string(),
  cartId: z.string(),
  productId: z.string()
})

export const addProductSchema = z.object({
  shopId: z.string(),
  cart_id: z.string(),
  cart_userId: z.string(),
  item_products: z.array(item_product).default([])
  // version: use after because of using pessimistic and optimistic lock
})
export type IAddProduct = z.infer<typeof addProductSchema>
export type IDeleteProduct = z.infer<typeof deleteCartSchema>
