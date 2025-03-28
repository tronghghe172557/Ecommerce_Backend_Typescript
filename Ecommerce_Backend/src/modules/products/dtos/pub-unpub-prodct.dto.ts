import { z } from 'zod'

const basePubProductSchema = z.object({
  product_shop: z.string(),
  product_id: z.string()
})

export const pubProductDto = basePubProductSchema.transform((data) => data)
export const unPubProductDto = basePubProductSchema.transform((data) => data)

export type IPubProductDto = z.infer<typeof basePubProductSchema>
export type IUnPubProductDto = z.infer<typeof basePubProductSchema>
