import { rabbitMQ } from '~/dbs'

export async function producerOrderedMessagequeue() {
  try {
    const channel = rabbitMQ.channel
    if (!channel) {
      throw new Error('Failed to create RabbitMQ channel')
    }

    const queueName = 'ordered-queue-message'

    await channel.assertQueue(queueName, {
      durable: true
    })

    for (let i = 0; i < 10; i++) {
      const msg = `ordered-queue-message: ${i}`
      console.log(`Send message: ${msg}`)
      channel.sendToQueue(queueName, Buffer.from(msg), {
        persistent: true
        // persistent: lưu tin nhắn trên disk
      })
    }
  } catch (error) {
    console.error(`Error send queue ${error instanceof Error ? error.message : String(error)}`)
  }
}
