import { z } from 'zod'

export const loginRequestDto = z.object({
  email: z.string(),
  password: z.string()
})

export type LoginRequestDto = z.infer<typeof loginRequestDto>
