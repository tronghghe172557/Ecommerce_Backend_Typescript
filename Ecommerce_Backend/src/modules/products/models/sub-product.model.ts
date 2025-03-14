import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import mongoose, { Schema, Model } from 'mongoose'

export interface IClothing extends BaseModel {
  brand: string
  size: string
  material: string
}

export interface IElectronic extends BaseModel {
  manufacturer: string
  model: string
  color: string
}

// define the product type
const clothingSchema: Schema<IClothing> = new Schema({
  ...baseModelSchemaDefinition,
  brand: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  material: {
    type: String
  }
})

const electronicSchema: Schema<IElectronic> = new mongoose.Schema({
  ...baseModelSchemaDefinition,
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  color: {
    type: String
  }
})

const ClothingModel: Model<IClothing> = mongoose.model<IClothing>('Clothing', clothingSchema)
const ElectronicModel: Model<IElectronic> = mongoose.model<IElectronic>('Electronic', electronicSchema)

export { ClothingModel, ElectronicModel }
