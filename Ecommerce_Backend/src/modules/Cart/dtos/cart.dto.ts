import { z } from 'zod'
import { deleteDto } from '~/base/common/dtos'
import { CartState } from '~/modules/Cart/enums'

export const baseCartProductSchema = z.object({
  product_id: z.string(),
  product_price: z.coerce.number().positive(),
  product_quantity: z.coerce.number().positive().int(),
  product_name: z.string(),
  product_thumb: z.string().optional().default('')
})

export const baseCartSchema = z.object({
  cart_state: z
    .enum([CartState.ACTIVE, CartState.COMPLETED, CartState.FAILED, CartState.PENDING], {
      errorMap: () => ({ message: "Cart state must be either 'ACTIVE', 'COMPLETED', 'FAILED', or 'PENDING'" })
    })
    .default(CartState.ACTIVE),
  cart_products: z.array(baseCartProductSchema).default([]),
  cart_count_product: z.coerce.number().default(0),
  cart_userId: z.string()
})

export const cartDto = baseCartSchema.transform((data) => {
  data.cart_count_product = data.cart_products.reduce((total, item) => total + item.product_quantity, 0)
  return data
})
export const deleteCartDto = baseCartSchema.merge(deleteDto).transform((data) => data)

export type ICartDto = z.infer<typeof cartDto>
export type IDeleteCartDto = z.infer<typeof deleteCartDto>
export type ICartProductDto = z.infer<typeof baseCartProductSchema>
