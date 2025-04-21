// import amqplib from 'amqplib'

import { rabbitMQ } from '~/base/rabbitmq'
import { Logger } from '~/base/common/utils'

const logger = new Logger('RabbitMQ Consumer')
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

    logger.info(`Waiting for messages in ${queueName}...`)
    channel.consume(
      queueName,
      (message) => {
        console.warn(`Received message: ${message?.content.toString()}`)
      },
      {
        // noAck: true: tự động xác nhận (acknowledge) message đã nhận
        // Điều này có nghĩa là message sẽ bị xóa khỏi queue ngay sau khi được nhận
        noAck: false
      }
    )
  } catch (error) {
    logger.error(`Error in Consumer: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export { runConsumer }
