import { z } from 'zod'
import { clothingDto, electronicDto } from '~/modules/products/dtos'
import { ProductType } from '~/modules/products/enums'

export const createProductDto = z.object({
  product_name: z.string(),
  product_thumbnail: z.string(),
  product_description: z.string(),
  product_price: z.coerce.number(),
  product_quantity: z.coerce.number(),
  product_type: z.enum([ProductType.Clothing, ProductType.Electronic, ProductType.Furniture]),
  product_shop: z.string(),
  product_attribute: z.union([clothingDto, electronicDto]),
  product_ratingAverage: z.coerce.number(),
  product_variants: z
    .array(z.union([clothingDto, electronicDto]))
    .default([])
    .nullable(),
  isDraft: z.boolean().default(true),
  isPublished: z.boolean().default(false)
})

export type ICreateProductDto = z.infer<typeof createProductDto>
