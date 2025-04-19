// Định nghĩa enum cho trạng thái đơn hàng
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  CANCELED = 'canceled',
  DELIVERED = 'delivered'
}

// Định nghĩa enum cho phương thức thanh toán
export enum PaymentMethod {
  COD = 'COD',
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  MOMO = 'MOMO',
  BANKING = 'BANKING'
}
