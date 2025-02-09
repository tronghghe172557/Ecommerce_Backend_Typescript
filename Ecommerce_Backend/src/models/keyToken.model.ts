import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IKeyToken extends Document {
  user: Types.ObjectId
  publicKey: string
  privateKey: string
  refreshToken?: Array<string>
}

const keyTokenSchema: Schema<IKeyToken> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    publicKey: {
      type: String
    },
    privateKey: {
      type: String
    },
    refreshToken: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'Keys'
  }
)

const KeyTokenModel: Model<IKeyToken> = mongoose.model<IKeyToken>('Key', keyTokenSchema)
export default KeyTokenModel
