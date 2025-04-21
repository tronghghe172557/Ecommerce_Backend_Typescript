// import amqplib from 'amqplib'

import { rabbitMQ } from '~/base/rabbitmq'

const runProducer = async () => {
  try {
    // Make sure we have a channel after connection
    if (!rabbitMQ.channel) {
      throw new Error('Failed to create RabbitMQ channel')
    }
    const channel = rabbitMQ.channel

    const queueName = 'test-topic'
    // assert: là để kiểm tra xem queue đã tồn tại hay chưa
    // Nếu chưa tồn tại thì sẽ tạo mới
    // Nếu đã tồn tại thì sẽ không làm gì cả
    // durable: true: là để đảm bảo queue sẽ không bị xóa khi RabbitMQ khởi động lại˝
    await channel.assertQueue(queueName, {
      durable: true // Make the queue durable
    })

    // Publish message to queue
    // sendToQueue: là để gửi message vào queue
    // Buffer.from: là để chuyển đổi message thành buffer -> tiết kiệm bộ nhớ
    channel.sendToQueue(queueName, Buffer.from('Hello, ShopDev by Trong'))
  } catch (error) {
    console.log(`Error in producer: ${error instanceof Error ? error.message : String(error)}`)
  }
}



export { runProducer }
