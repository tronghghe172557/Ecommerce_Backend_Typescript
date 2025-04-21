import z from 'zod'
import { NotificationType } from '~/modules/Notification/enums'

export const createNotificationSchema = z.object({
  noti_type: z.nativeEnum(NotificationType),
  noti_senderId: z.string().min(1, 'Sender ID is required'),
  noti_receivedId: z.string().min(1, 'Receiver ID is required'),
  noti_content: z.string().min(1, 'Content is required'),
  noti_options: z.string().or(z.record(z.any())).optional()
})

export type ICreateNotificationDto = z.infer<typeof createNotificationSchema>
