import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import { AuthEnum, AuthRoleEnum } from '~/modules/auth/enums'

// định nghĩa dữ liệu cho shop
export interface IUser extends BaseModel {
  name: string
  email: string
  password: string
  status: AuthEnum.ACTIVE | AuthEnum.INACTIVE
  verify: boolean
  roles: string[]
}

// Khai báo Schema với TypeScript => Giúp TypeScript kiểm tra field & type
const userSchema: Schema<IUser> = new Schema({
  ...baseModelSchemaDefinition,
  name: {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(AuthEnum),
    default: AuthEnum.ACTIVE
  },
  verify: {
    type: Boolean,
    default: false
  },
  roles: {
    type: [String], // Định rõ roles là mảng string
    default: [AuthRoleEnum.USER]
  }
})

// Xuất Model với TypeScript Generics
export const UserModel: Model<IUser> = mongoose.model<IUser>('users', userSchema)
