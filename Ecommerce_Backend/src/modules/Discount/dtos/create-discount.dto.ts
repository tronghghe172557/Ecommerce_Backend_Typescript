import z from 'zod'
import { baseDiscountSchema } from './discount.dto'

// Create discount DTO
export const createDiscountDto = baseDiscountSchema.transform((data) => {
  return {
    ...data,
    discount_uses_count: 0, // Initialize with 0
    discount_users_used: [] // Initialize with empty array
  }
})

export type ICreateDiscountDto = z.infer<typeof createDiscountDto>
