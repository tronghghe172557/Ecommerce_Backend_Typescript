import { IShop } from '~/models/shop.model'
type DataType = IShop | string | number // Thêm các kiểu dữ liệu khác nếu cần

export interface IMessage {
  code: string
  message: string
  data?: DataType[] // ? is optional
  status: number
}
