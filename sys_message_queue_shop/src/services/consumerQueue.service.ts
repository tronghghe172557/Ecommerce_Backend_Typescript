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

      const notiQueue = queueName
      /*
        Error consuming queue notiQueueProcess: Operation failed: 
        QueueDeclare; 406 (PRECONDITION-FAILED) with message "PRECONDITION_FAILED 
        - inequivalent arg 'x-dead-letter-exchange' for queue 'notiQueueProcess' 
        in vhost '/': received none but current is the value 'notiExDLX' of type 'longstr'"

        lỗi do queue đã được tạo trước đó với các tham số khác nhau
        -> await rabbitMQ.consumerQueue(queueName)
          -> khi dùng hàm kia m lại tạo lại queue với các tham số khác -> lỗi
      */
      // channel.consume(
      //   notiQueue,
      //   (msg) => {
      //     console.log(`Received message: ${msg?.content.toString()}`)
      //   },
      //   {
      //     noAck: true // noAck: true means the message will be removed from the queue immediately after being received
      //   }
      // )

      // 1. TTL
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

      // LOGIC

      channel.consume(notiQueue, (msg) => {
        try {
          // in order to simulate a failure ( simulate: mô phỏng )
          const numberTest = Math.random()
          console.log(`numberTest: ${numberTest}`)
          if (numberTest < 0.8) {
            throw new Error('Simulated error') // simulate an error
          }

          console.log(`Received message: ${msg?.content.toString()}`)
        } catch (error) {
          console.log(`Error processing message: ${error instanceof Error ? error.message : String(error)}`)
          // 2. DLX
          channel.nack(msg!, false, false) // ! ensure that msg is type of Message
          /*
            nack: negative acknowLedge: xác nhận tiêu cực
            tự động thiết lập với 1 queue: deadLetterExchange: notiExDLX
            Tin nhắn sẽ được tự động chuyển đến Dead Letter Exchange 
            với routing key được chỉ định trong notiRoutingKeyDLX.
            allUpto: dùng để từ chối các tin nhắn bị lỗi
             - true: từ chối tất cả tin nhắn bị lỗi ( thường là lỗi nghiêm trọng )
             - false: chỉ từ chối tin nhắn hiện tại
            requeue: tin nhắn bị từ chối sẽ được đưa lại vào queue lần nữa hay ko ?
             - true: đưa lại vào queue
             - false: ko đưa lại vào queue mà đưa thẳng vào DLX

            RabbitMQ biết tìm đến queue notiQueueHotFix vì:

            Tin nhắn bị reject từ queue chính
            Queue chính được cấu hình để chuyển 
              tin nhắn bị reject đến exchange notiExDLX với routing key notiRoutingKeyDLX
            Queue notiQueueHotFix đã được bind với 
              exchange notiExDLX và routing key notiRoutingKeyDLX  
          */
        }
      })
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
