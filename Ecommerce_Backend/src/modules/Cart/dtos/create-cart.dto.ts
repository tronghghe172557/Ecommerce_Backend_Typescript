import { z } from 'zod'
import { baseCartSchema } from './cart.dto'

export const createCart = baseCartSchema.transform((data) => {
  return {
    ...data,
    cart_count_product: data.cart_products.reduce((total, item) => total + item.product_quantity, 0)
  }
})

export type ICreateCart = z.infer<typeof createCart>
