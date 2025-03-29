import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import { DocumentName } from '~/modules/Inventory/enums'
import { DiscountType, DiscountAppliesTo } from '~/modules/Discount/enums'

export interface DiscountProduct {
  product_id: string
  product_price: number
  product_quantity: number
  product_name: string
}
export interface IDiscount extends BaseModel {
  discount_name: string
  discount_description: string
  discount_type: DiscountType.FIX_AMOUNT | DiscountType.PERCENTAGE // loại giảm giá là '%' hoặc 'giá cố định'
  discount_value: number // giá trị giảm giá
  discount_code: string // mã giảm giá
  discount_start_date: Date
  discount_end_date: Date // end Date > start Date
  discount_max_uses: number
  discount_users_used: Array<string> // danh sách người dùng đã sử dụng mã giảm giá này
  discount_uses_count: number // số lần discount được sử dụng hiện tại
  discount_max_user_per_user: number // số lần sử dụng tối đa của mã giảm giá này cho mỗi người dùng
  discount_min_order_value: number // giá trị đơn hàng tối thiểu để áp dụng mã giảm giá
  discount_shopId: string // id của shop mà mã giảm giá này thuộc về
  discount_is_active: boolean
  discount_applies_to: DiscountAppliesTo.ALL | DiscountAppliesTo.SPECIFIC // áp dụng cho tất cả sản phẩm hay sản phẩm cụ thể
  discount_products_ids: Array<DiscountProduct> // nếu discount_applies_to là specific thì mới có, nếu discount_applies_to là all thì không có
}

/*
        apply discount code
        products = [
            {
                product_id: '',
                product_price: '',
                product_quantity: '',
                product_name: ''
            }
        ]
    */

const discountSchema: Schema<IDiscount> = new Schema({
  ...baseModelSchemaDefinition,
  discount_name: {
    type: String,
    required: true
  },
  discount_description: {
    type: String
  },
  discount_type: {
    type: String,
    required: true,
    enum: [DiscountType.FIX_AMOUNT, DiscountType.PERCENTAGE]
  },
  discount_value: {
    type: Number,
    required: true
  },
  discount_code: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^[A-Z0-9]+$/.test(value) // chỉ cho phép chữ hoa và số
      },
      message: 'Discount code must be uppercase letters and numbers only'
    }
  },
  discount_start_date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value: Date) {
        return value.getTime() >= new Date().getTime() // ngày bắt đầu phải lớn hơn ngày hiện tại
      },
      message: 'Discount start date must be greater than current date'
    }
  },
  discount_end_date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value: Date) {
        return value.getTime() >= new Date().getTime() // ngày bắt đầu phải lớn hơn ngày hiện tại
      },
      message: 'Discount end date must be greater than current date'
    }
  },
  discount_max_uses: {
    type: Number,
    required: true,
    validate: {
      validator: function (value: number) {
        return value > 0 // số lần sử dụng tối đa phải lớn hơn 0
      },
      message: 'Discount max uses must be greater than 0'
    }
  },
  discount_users_used: {
    type: [String],
    default: []
  },
  discount_uses_count: {
    // số lần discount được sử dụng hiện tại
    type: Number,
    required: true
  },
  discount_max_user_per_user: {
    type: Number,
    required: true
  },
  discount_min_order_value: {
    type: Number,
    required: true
  },
  discount_shopId: {
    type: String,
    required: true,
    ref: 'Shop'
  },
  discount_is_active: {
    type: Boolean,
    default: true
  },
  discount_applies_to: {
    type: String,
    required: true,
    enum: [DiscountAppliesTo.ALL, DiscountAppliesTo.SPECIFIC]
  },
  discount_products_ids: {
    type: [
      {
        product_id: { type: String, required: true },
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_name: { type: String, required: true }
      }
    ],
    default: []
  }
})

// validate discount_start_date and discount_end_date
discountSchema.pre('save', function (next) {
  // check discount_start_date and discount_end_date
  if (this.discount_start_date.getTime() >= this.discount_end_date.getTime()) {
    return next(new Error('Discount end date must be greater than start date'))
  }
})

// index
discountSchema.index({ discount_code: 1 }, { unique: true }) // tạo index cho discount_code để tìm kiếm nhanh hơn
discountSchema.index({ discount_shopId: 1 }) // tạo index cho discount_shopId để tìm kiếm nhanh hơn

const DiscountModel: Model<IDiscount> = mongoose.model<IDiscount>(DocumentName, discountSchema)

export { DiscountModel }
