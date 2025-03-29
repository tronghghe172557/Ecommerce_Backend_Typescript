import z from 'zod'
import { baseDiscountSchema } from './discount.dto'

// Update discount DTO
export const updateDiscountDto = baseDiscountSchema.partial().omit({
  discount_code: true, // Cannot update code as it's unique
  discount_shopId: true // Cannot change shop ownership
})

export type IUpdateDiscountDto = z.infer<typeof updateDiscountDto>
