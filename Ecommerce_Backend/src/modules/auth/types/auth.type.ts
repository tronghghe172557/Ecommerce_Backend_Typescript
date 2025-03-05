import { IKeyToken } from '~/modules/auth/models/'
export interface ISignUp {
  name: string
  email: string
  password: string
}

export interface ILogin {
  email: string
  password: string
}

export interface IHandleRefreshToken {
  refreshToken: string
  keyStore: IKeyToken
}
