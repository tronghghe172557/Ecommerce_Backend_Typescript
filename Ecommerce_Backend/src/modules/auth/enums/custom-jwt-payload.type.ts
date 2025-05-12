import { JwtPayload } from 'jsonwebtoken'

import { AuthRoleEnum } from '~/modules/auth/enums'

export interface CustomJwtPayload extends JwtPayload {
  role?: AuthRoleEnum
}
