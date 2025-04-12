import { z } from 'zod'
import { discountProductSchema } from './discount.dto'

// Schema for discount amount query
export const discountAmountQuerySchema = z.object({
  discount_code: z.string(),
  discount_shopId: z.string(),
  userId: z.string(),
  products: z.array(discountProductSchema).default([])
})

// Schema for discount amount response
export const discountAmount = z.object({
  totalOrder: z.coerce.number().positive(),
  discount: z.coerce.number().positive(),
  totalPrice: z.coerce.number().positive()
})

export type IDiscountAmount = z.infer<typeof discountAmount>
export type IDiscountAmountQuery = z.infer<typeof discountAmountQuerySchema>
