import z from 'zod'

export const baseSchema = z.object({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createTimestamp: z.coerce.date()
})

export type BaseDto = z.infer<typeof baseSchema>
