import { z } from 'zod'
import { DiscountType, DiscountAppliesTo } from '~/modules/Discount/enums'
import { deleteDto } from '~/base/dtos'

// Schema for discount product items
export const discountProductSchema = z.object({
  product_id: z.string(),
  product_price: z.coerce.number().positive(),
  product_quantity: z.coerce.number().positive().int(),
  product_name: z.string()
})

// Base discount schema
export const baseDiscountSchema = z.object({
  discount_name: z.string().min(3, 'Discount name must be at least 3 characters'),
  discount_description: z.string().optional(),
  discount_type: z.enum([DiscountType.FIX_AMOUNT, DiscountType.PERCENTAGE], {
    errorMap: () => ({ message: "Discount type must be either 'FIXED_AMOUNT' or 'PERCENTAGE'" })
  }),
  discount_value: z.coerce.number().positive('Discount value must be positive'),
  discount_code: z.string().regex(/^[A-Z0-9]+$/, 'Discount code must be uppercase letters and numbers only'),
  discount_start_date: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Discount start date must be greater than current date'
  }),
  discount_end_date: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Discount end date must be greater than current date'
  }),
  discount_max_uses: z.coerce.number().positive().int(),
  discount_max_user_per_user: z.coerce.number().int().min(1),
  discount_min_order_value: z.coerce.number().nonnegative(),
  discount_shopId: z.string(),
  discount_is_active: z.boolean().default(true),
  discount_applies_to: z.enum([DiscountAppliesTo.ALL, DiscountAppliesTo.SPECIFIC], {
    errorMap: () => ({ message: "Discount applies to must be either 'ALL' or 'SPECIFIC'" })
  }),
  discount_products_ids: z.array(discountProductSchema).default([])
})

// Full discount DTO with transforms
export const discountDto = baseDiscountSchema.transform((data) => {
  if (data.discount_applies_to === DiscountAppliesTo.ALL) {
    // Clear product IDs if discount applies to all products
    return { ...data, discount_products_ids: [] }
  }
  return data
})

// Delete discount DTO
export const deleteDiscountDto = z
  .object({
    discount_id: z.string(),
    discount_shopId: z.string()
  })
  .merge(deleteDto)

// Export TypeScript types
export type IDiscountDto = z.infer<typeof discountDto>
export type IDeleteDiscountDto = z.infer<typeof deleteDiscountDto>
export type IDiscountProductDto = z.infer<typeof discountProductSchema>
