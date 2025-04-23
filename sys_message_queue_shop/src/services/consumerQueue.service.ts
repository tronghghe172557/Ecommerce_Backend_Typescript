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

  static consumerToQueueNormal = async (queueName: string) => {
    try {
      const channel = rabbitMQ.channel
      if (!channel) {
        throw new Error('Failed to create RabbitMQ channel')
      }

      const notiQueue = 'notiQueueProcess'
      /*
        Error consuming queue notiQueueProcess: Operation failed: 
        QueueDeclare; 406 (PRECONDITION-FAILED) with message "PRECONDITION_FAILED 
        - inequivalent arg 'x-dead-letter-exchange' for queue 'notiQueueProcess' 
        in vhost '/': received none but current is the value 'notiExDLX' of type 'longstr'"

        lỗi do queue đã được tạo trước đó với các tham số khác nhau
        -> await rabbitMQ.consumerQueue(queueName)
          -> khi dùng hàm kia m lại tạo lại queue với các tham số khác -> lỗi
      */
      channel.consume(
        notiQueue,
        (msg) => {
          console.log(`Received message: ${msg?.content.toString()}`)
        },
        {
          noAck: true // noAck: true means the message will be removed from the queue immediately after being received
        }
      )

      /*
        const timeExpired = 15000 // 15s
        setTimeout(() => {
          channel.consume(
            notiQueue,
            (msg) => {
              console.log(`Received message: ${msg?.content.toString()}`)
            },
            {
              noAck: true // noAck: true means the message will be removed from the queue immediately after being received
            }
          )
        }, timeExpired)
      */
    } catch (error) {
      console.log(`Error consuming queue ${queueName}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static consumerToQueueFailed = async (queueName: string) => {
    try {
      const notiExchangeDLX = 'notiExDLX'
      const notiRoutingKeyDLX = 'notiRoutingKeyDLX'
      const notiQueueHandle = 'notiQueueHotFix'

      const channel = rabbitMQ.channel
      if (!channel) {
        throw new Error('Failed to create RabbitMQ channel')
      }

      await channel.assertExchange(notiExchangeDLX, 'direct', {
        durable: true
      })

      const queueResult = await channel.assertQueue(notiQueueHandle, {
        exclusive: false // cho phép nhiều consumer cùng kết nối đến queue
      })

      await channel.bindQueue(queueResult.queue, notiExchangeDLX, notiRoutingKeyDLX)

      await channel.consume(
        queueResult.queue,
        (msgFaild) => {
          console.log(`Received message from DLX: ${msgFaild?.content.toString()}`)
        },
        {
          noAck: true
        }
      )
    } catch (error) {
      console.log(`Error consuming queue ${queueName}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
