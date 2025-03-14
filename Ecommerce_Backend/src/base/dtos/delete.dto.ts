import { z } from 'zod'

export const deleteDto = z.object({
  deleteTimestamp: z.coerce.date()
})

export type DeleteDto = z.infer<typeof deleteDto>
