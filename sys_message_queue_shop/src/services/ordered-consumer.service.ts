import { rabbitMQ } from '~/dbs'

export async function consumerOrderedMessagequeue() {
  try {
    const channel = rabbitMQ.channel
    if (!channel) {
      throw new Error('Failed to create RabbitMQ channel')
    }

    const queueName = 'ordered-queue-message'

    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.prefetch(1) // Chỉ nhận 1 message tại một thời điểm

    channel.consume(queueName, (msg) => {
      if (!msg) return;

      const message = msg?.content.toString()

      setTimeout(() => {
        console.log(`Received message: ${message}`)
        // Quan trọng: hoàn trả token để nhận tin nhắn tiếp theo
        channel.ack(msg!)
      }, Math.random() * 1000)
    }, {
      noAck: false // Không tự động xác nhận tin nhắn
    })
  } catch (error) {
    console.error(`Error consuming queue ${error instanceof Error ? error.message : String(error)}`)
  }
}
