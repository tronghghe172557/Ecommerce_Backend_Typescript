import mongoose, { Model, Schema } from 'mongoose'

import Database from '~/dbs/init.mongodb'

interface TestDocument {
  name: string
}
const testSchema: Schema<TestDocument> = new mongoose.Schema<TestDocument>({ name: String })
const Test: Model<TestDocument> = mongoose.model('Test', testSchema)

describe('MongoDB Connection', () => {
  // first: connect to MongoDB
  beforeAll(async () => {
    Database.getInstance()
  })

  // test
  // it: các trường hợp kiểm thử 
  it('should connect to mongoose ', () => {
    // expect: 1 hàm để kiểm tra giá trị
    // mongoose.connection.readyState: trạng thái kết nối của mongoose
    // tobe: kiểm tra giá trị trước đó ( callback trong expect trả ra ) với giá trị truyền vào trong toBe
    // tobe ko phù hợp kiểm tra giá trị: MẢNG, OBJECT
    // -> dùng toEqual
    expect(mongoose.connection.readyState).toBe(2) // 1 means connected 2 mean connecting
  })

  it('should save a document to the database', async () => {
    const user = new Test({ name: 'Gia Trong' })
    await user.save()
    // isNew: kiểm tra xem document có phải là mới hay không
    expect(user.isNew).toBe(false) // document should not be new after saving
  })

  it('should find a document to the database', async () => {
    const user = await Test.findOne({ name: 'Gia Trong' }).lean().exec()
    expect(user).toBeDefined() // ensur that document should be found
    expect(user?.name).toBe('Gia Trong') // document should not be new after saving
  })
  // after all: close the connection
  afterAll(async () => {
    await mongoose.connection.close()
  })
})
