import { z } from 'zod'
import { clothingDto, electronicDto } from '~/modules/products/dtos'

export const createProductDto = z.object({
  product_name: z.string(),
  product_thumbnail: z.string(),
  product_description: z.string(),
  product_price: z.coerce.number(),
  product_quantity: z.coerce.number(),
  product_type: z.enum(['Clothing', 'Electronics', 'Furniture']),
  product_shop: z.string(),
  product_attribute: z.union([clothingDto, electronicDto])
})

export type ICreateProductDto = z.infer<typeof createProductDto>
