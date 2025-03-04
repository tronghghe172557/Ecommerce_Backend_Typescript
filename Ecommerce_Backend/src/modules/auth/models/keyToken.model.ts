import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'

export interface IKeyToken extends BaseModel {
  user: string
  publicKey: string
  privateKey: string
  refreshToken?: string
  refreshTokensUsed?: Array<string>
}

const keyTokenSchema: Schema<IKeyToken> = new Schema({
  ...baseModelSchemaDefinition,
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  publicKey: {
    type: String
  },
  privateKey: {
    type: String
  },
  refreshToken: {
    type: String
  },
  refreshTokensUsed: {
    type: [String],
    default: []
  }
})

export const KeyTokenModel: Model<IKeyToken> = mongoose.model<IKeyToken>('Keys', keyTokenSchema)
