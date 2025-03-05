import { z } from 'zod'

export const updateRefreshDto = z.object({
  refreshToken: z.string(),
  userId: z.string(),
  refreshTokenUsed: z.string()
})

export type UpdateRefreshDto = z.infer<typeof updateRefreshDto>
