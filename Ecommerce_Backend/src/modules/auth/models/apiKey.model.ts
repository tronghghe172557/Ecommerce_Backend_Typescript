import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'

// extend BaseModel
export interface IApiKey extends BaseModel {
  key: string
  status: boolean
  permissions: Array<string>
}

const apiKeySchema: Schema<IApiKey> = new Schema(
  {
    ...baseModelSchemaDefinition,
    key: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      default: [],
      enum: ['0000', '1111', '2222', '3333']
    }
  },
  {
    timestamps: true,
    collection: 'ApiKeys'
  }
)

// Việc tạo model phải tuân thủ theo đúng interface IApiKey
export const KeyApiModel: Model<IApiKey> = mongoose.model<IApiKey>('ApiKey', apiKeySchema)
