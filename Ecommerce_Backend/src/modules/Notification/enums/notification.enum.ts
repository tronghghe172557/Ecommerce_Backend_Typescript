export enum Notification {
  DOCUMENT_NAME = 'Notification',
  COLLECTION_NAME = 'notifications'
}

/* 
 Order Status Codes
 ORDER-001: order successful
 ORDER-002: order failed
 ORDER-003: order pending
 ORDER-004: order canceled
 ORDER-005: payment received
 ORDER-006: payment failed
 ORDER-007: order refunded
 ORDER-008: order shipped
 ORDER-009: order delivered
*/

/*
 Promotion Status Codes
 PROMOTION-001: new promotion created
*/

/* 
SHOP-001: new product by User following
*/

export enum NotificationType {
  // Order notifications
  ORDER_SUCCESSFUL = 'ORDER-001',
  ORDER_FAILED = 'ORDER-002',
  ORDER_PENDING = 'ORDER-003',
  ORDER_CANCELED = 'ORDER-004',
  PAYMENT_RECEIVED = 'ORDER-005',
  PAYMENT_FAILED = 'ORDER-006',
  ORDER_REFUNDED = 'ORDER-007',
  ORDER_SHIPPED = 'ORDER-008',
  ORDER_DELIVERED = 'ORDER-009',

  // Promotion notifications
  NEW_PROMOTION = 'PROMOTION-001',

  // Shop notifications
  SHOP_NEW_PRODUCT = 'SHOP-001'
}

export enum NotificationStatus {
  SEND = 'SEND',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  // For unread and read status
  UNREAD = 'UNREAD',
  READ = 'READ'
}
