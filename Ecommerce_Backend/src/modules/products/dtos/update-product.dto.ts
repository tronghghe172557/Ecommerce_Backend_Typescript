import { z } from 'zod'
import { createProductDto } from './create-product.dto'
import { ProductType } from '~/modules/products/enums'

export const updateProductDto = createProductDto.partial().extend({
  product_type: z.enum([ProductType.Clothing, ProductType.Electronic, ProductType.Furniture])
})

export type UpdateProductDto = z.infer<typeof updateProductDto>
