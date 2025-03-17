import { z } from 'zod'
import { clothingDto, electronicDto } from './sub-product.dto'
import { deleteDto } from '~/base/dtos'
import { ProductType } from '~/modules/products/enums'

const baseProductSchema = z.object({
  product_name: z.string(),
  product_thumbnail: z.string(),
  product_description: z.string(),
  product_price: z.coerce.number(),
  product_quantity: z.coerce.number(),
  product_type: z.enum([ProductType.Clothing, ProductType.Electronic, ProductType.Furniture]),
  product_shop: z.string(), // Assuming product_shop is a string, adjust as needed
  product_attribute: z.union([clothingDto, electronicDto]), // Assuming IClothing and IElectronic are Zod schemas,
  product_ratingAverage: z.coerce.number(),
  product_slug: z.string().nullable(),
  product_variants: z
    .array(z.union([clothingDto, electronicDto]))
    .default([])
    .nullable(),
  isDraft: z.boolean().default(true),
  isPublished: z.boolean().default(false)
})

export const productDto = baseProductSchema.transform((data) => data)

export const deleteProductDto = baseProductSchema.merge(deleteDto).transform((data) => data)

export type IProductDto = z.infer<typeof baseProductSchema>
export type IDeleteProductDto = z.infer<typeof deleteProductDto>
