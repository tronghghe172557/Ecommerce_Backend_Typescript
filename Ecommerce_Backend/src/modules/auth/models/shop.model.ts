import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import { AuthRoleEnum } from '~/modules/auth/enums'

// định nghĩa dữ liệu cho shop
export interface IShop extends BaseModel {
  name: string
  email: string
  password: string
  status: 'active' | 'inactive'
  verify: boolean
  roles: string[]
}

// Khai báo Schema với TypeScript => Giúp TypeScript kiểm tra field & type
const shopSchema: Schema<IShop> = new Schema({
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
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  verify: {
    type: Boolean,
    default: false
  },
  roles: {
    type: [String], // Định rõ roles là mảng string
    default: [AuthRoleEnum.USER] // Giá trị mặc định là mảng chứa 1 phần tử là USER
  }
})

// Xuất Model với TypeScript Generics
export const ShopModel: Model<IShop> = mongoose.model<IShop>('Shops', shopSchema)
