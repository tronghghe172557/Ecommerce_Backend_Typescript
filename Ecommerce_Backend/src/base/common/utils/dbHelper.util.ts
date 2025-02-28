import mongoose from 'mongoose'
import _ from 'lodash'

const convertToObjectId = (id: string) => new mongoose.Types.ObjectId(id)

interface IGetInfoData<T> {
  fields: Array<keyof T> // đảm bảo fields là một mảng CHỈ CHỨA CÁC KEY của object T
  object: T
}

/**
 * Get specific fields from an object
 * @param params - Input parameters
 * @param params.fields - Array of fields to pick
 * @param params.object - Source object
 * @returns A new object containing only the specified fields
 */
const getInfoData = <T extends object>({ fields = [], object = {} as T }: Partial<IGetInfoData<T>>): Partial<T> => {
  return _.pick(object, fields)
}

/*
 * @T là 1 kiểu dữ liệu động, có thể chứa bất kỳ loại dữ liệu nào
 * @extends object: đảm bảo T là một object
 * @({ fields = [], object = {} as T }: Partial<IGetInfoData<T>>)
 * @fields: mặc định là [] nếu ko được truyền vào
 * @object: mặc định là {} nếu ko được truyền vào
 * Partial<IGetInfoData<T>>: ko nhất thiết là @field and @object phải được truyền vào
 * Partial<T>: trả về một object mới có thể thiếu một số thuộc tính
 */

export { convertToObjectId, getInfoData }
