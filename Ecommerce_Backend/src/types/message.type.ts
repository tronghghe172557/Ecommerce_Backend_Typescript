// T is flexible, it can be any type
export interface IMessage<T> {
  code: string
  message: string
  data?: T[] // ? is optional
  status: number
}
