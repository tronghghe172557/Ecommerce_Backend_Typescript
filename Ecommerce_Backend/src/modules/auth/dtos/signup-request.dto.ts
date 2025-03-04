import { z } from 'zod'

export const signupRequestDto = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string()
})

export type SignupRequestDto = z.infer<typeof signupRequestDto>
