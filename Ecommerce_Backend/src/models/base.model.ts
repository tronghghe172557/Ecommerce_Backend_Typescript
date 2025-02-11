import { Schema, SchemaDefinition, SchemaDefinitionType, Types } from 'mongoose'

export interface BaseModel {
  _id: Types.ObjectId
  createTimestamp: Date
  deleteTimestamp: Date
}

// satisfies: định nghĩa schema tuân thủ đúng với interface BaseModel
/*
    Schema: Định nghĩa cấu trúc dữ liệu, các trường, kiểu dữ liệu, ràng buộc 
        và giá trị mặc định cho các tài liệu trong một collection.
    Model: Là một lớp được tạo ra từ schema, cung cấp các phương thức 
        để tương tác với cơ sở dữ liệu và thực hiện các thao tác CRUD.
*/
export const baseModelSchemaDefinition = {
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId(), required: true },
  createTimestamp: { type: Date, default: Date.now, required: true },
  deleteTimestamp: { type: Date, default: null, required: false }
} satisfies SchemaDefinition<SchemaDefinitionType<BaseModel>, BaseModel>
