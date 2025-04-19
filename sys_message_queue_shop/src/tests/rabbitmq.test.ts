import { connectToRabbitMQTest, rabbitMQ } from '~/dbs/init.rabbit'

describe('RabbitMQ connection', () => {
  // Thiết lập kết nối trước khi chạy các test
  beforeAll(async () => {
    await rabbitMQ.connect()
  })

  it('should connect to RabbitMQ successfully', async () => {
    const result = await connectToRabbitMQTest()
    expect(result).toBeUndefined()
  })

  // Dọn dẹp sau khi test xong (tùy chọn)
  afterAll(async () => {
    if (rabbitMQ.connection) {
      await rabbitMQ.connection.close()
    }
  })
})
