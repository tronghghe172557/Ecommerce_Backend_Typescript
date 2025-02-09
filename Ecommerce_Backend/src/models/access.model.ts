import mongoose, { Schema, Document, Model } from 'mongoose'

// định nghĩa dữ liệu cho shop
export interface IShop extends Document {
  name: string
  email: string
  password: string
  status: 'active' | 'inactive'
  verify: boolean
  roles: string[]
}

// Khai báo Schema với TypeScript => Giúp TypeScript kiểm tra field & type	
const shopSchema: Schema<IShop> = new Schema(
  {
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
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'Shops'
  }
)

// Xuất Model với TypeScript Generics
const ShopModel: Model<IShop> = mongoose.model<IShop>('Shop', shopSchema)
export default ShopModel
