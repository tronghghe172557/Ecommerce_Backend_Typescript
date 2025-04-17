import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import { DocumentName } from '~/modules/Inventory/enums'

export interface IInventory extends BaseModel {
  inven_productId: string
  inven_location: string
  inven_stock: number
  inven_shopId: string
  inven_reservations: Array<string> // cần confirm lại type này
  // đặt hàng trước, add vào giỏ hàng
}

const InventorySchema: Schema<IInventory> = new Schema({
  ...baseModelSchemaDefinition,
  inven_productId: {
    type: String,
    required: true
  },
  inven_location: {
    type: String
  },
  inven_stock: {
    type: Number,
    required: true
  },
  inven_shopId: {
    type: String,
    required: true,
    ref: 'Shop'
  },
  inven_reservations: {
    type: [String],
    default: []
  }
})

const InventoryModel: Model<IInventory> = mongoose.model<IInventory>(DocumentName, InventorySchema)

export { InventoryModel }
