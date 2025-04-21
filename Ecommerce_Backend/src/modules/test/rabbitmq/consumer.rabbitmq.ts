// import amqplib from 'amqplib'

import { rabbitMQ } from '~/base/rabbitmq'

const runConsumer = async () => {
  try {
    // Make sure we have a channel after connection
    if (!rabbitMQ.channel) {
      throw new Error('Failed to create RabbitMQ channel')
    }
    const channel = rabbitMQ.channel

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true // Make the queue durable
    })

    channel.consume(
      queueName,
      (message) => {
        console.log(`Received message: ${message?.content.toString()}`)
      },
      {
        // noAck: true: tự động xác nhận (acknowledge) message đã nhận
        // Điều này có nghĩa là message sẽ bị xóa khỏi queue ngay sau khi được nhận
        noAck: true
      }
    )
  } catch (error) {
    console.log(`Error in Consumer: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// catch: ensure that the Consumer is running even if there is an error
runConsumer().catch((error) => {
  console.error('Error running Consumer:', error)
})

export { runConsumer }
