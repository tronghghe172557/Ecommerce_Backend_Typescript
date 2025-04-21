import { z } from 'zod'
import { baseSchema } from '~/base/dtos'
import { NotificationStatus, NotificationType } from '~/modules/Notification/enums'

export const notificationSchema = baseSchema.extend({
  noti_type: z.nativeEnum(NotificationType),
  noti_senderId: z.string(),
  noti_receivedId: z.string(),
  noti_content: z.string(),
  noti_options: z.string().or(z.record(z.any())), // Allowing for a string or a record of any type
  noti_status: z.nativeEnum(NotificationStatus)
})

export type Notification = z.infer<typeof notificationSchema>
