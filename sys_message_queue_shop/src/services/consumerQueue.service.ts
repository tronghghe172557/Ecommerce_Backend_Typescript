import { rabbitMQ } from '~/dbs'

export class MessageService {
  static consumerReceived = async (queueName: string) => {
    try {
      const channel = rabbitMQ.channel
      if (!channel) {
        throw new Error('Failed to create RabbitMQ channel')
      }
      
      await rabbitMQ.consumerQueue(queueName)
    } catch (error) {
      console.error(`Error consuming queue ${queueName}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
