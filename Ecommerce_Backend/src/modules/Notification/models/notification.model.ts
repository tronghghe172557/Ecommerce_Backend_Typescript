import mongoose, { Schema, Model } from 'mongoose'
import { BaseModel, baseModelSchemaDefinition } from '~/base/common/models'
import { Notification, NotificationStatus, NotificationType } from '~/modules/Notification/enums/notification.enum'

export interface INotification extends BaseModel {
  noti_type: NotificationType
  noti_senderId: string
  noti_receivedId: string
  noti_content: string
  noti_options: string
  noti_status: NotificationStatus
}

const InventorySchema: Schema<INotification> = new Schema(
  {
    ...baseModelSchemaDefinition,
    noti_type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.ORDER_SUCCESSFUL,
      required: true
    },
    noti_senderId: {
      type: String,
      ref: 'Shop',
      required: true
    },
    noti_receivedId: {
      type: String,
      required: true
    },
    noti_content: {
      type: String,
      required: true
    },
    noti_options: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      required: true
    },
    noti_status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
      required: true
    }
  },
  {
    timestamps: true,
    collection: Notification.COLLECTION_NAME
  }
)

const NotificationModel: Model<INotification> = mongoose.model<INotification>(Notification.DOCUMENT_NAME, InventorySchema)

export { NotificationModel }
