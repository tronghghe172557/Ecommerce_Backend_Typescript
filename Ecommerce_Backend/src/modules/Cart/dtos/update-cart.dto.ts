import { z } from 'zod'
import { baseCartSchema } from './cart.dto'

// omit is a method that eliminates the specified keys (trường chỉ định) from the object type
export const updateCart = baseCartSchema.partial().omit({
  cart_userId: true // Cart user ID should not be updated
})

export type IUpdateCart = z.infer<typeof updateCart>
