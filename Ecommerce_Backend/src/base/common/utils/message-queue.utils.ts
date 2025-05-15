import { rabbitMQ } from '~/base/rabbitmq'

import { BadRequestException } from '~/base/common/exceptions'
import { Logger } from '~/base/common/utils'

interface ISendMessage {
  msg?: string
  exchange?: string
  queue?: string
  exchangeDLX?: string
  routingKeyDLX?: string
  routingKey?: string
}

export class MessageQueueUtils {
  private logger = new Logger('MessageQueueUtils')

  // nếu chỉ dùng static -> không thể connect với RabbitMQ
  public async sendMessage({ msg, exchange, queue, exchangeDLX, routingKeyDLX }: ISendMessage) {
    try {
      if (!rabbitMQ.channel) {
        throw new BadRequestException('RabbitMQ channel is not initialized')
      }

      /*
        1. create exchange
        2. create queue
        3. bind queue with exchange
        4. publish message to exchange
      */

      // 1.
      await rabbitMQ.channel.assertExchange(exchange!, 'fanout', {
        durable: true // avoiding message when RabbitMQ restart
      })

      // 2.
      const queueResult = await rabbitMQ.channel.assertQueue(queue!, {
        exclusive: false, // permits multiple consumers to connect to the queue
        deadLetterExchange: exchangeDLX, // specify DLX for the queue
        deadLetterRoutingKey: routingKeyDLX // specify routing key for DLX
      })

      // 3.
      // because the exchange is fanout, we don't need to specify the routing key
      await rabbitMQ.channel.bindQueue(queueResult.queue, exchange!, '')

      // 4.
      rabbitMQ.channel.publish(exchange!, '', Buffer.from(msg!), {
        expiration: '10000'
      })

      this.logger.info(`Message sent to RabbitMQ: ${msg} in ${exchange} exchange with ${queue} queue`)
    } catch (error) {
      this.logger.error(`Error when send message to RabbitMQ: ${error instanceof Error ? error.message : error}`)
      throw new BadRequestException(
        `Error when send message to RabbitMQ: ${error instanceof Error ? error.message : error}`
      )
    }
  }

  public async sendMessageWhenNewProduct(msg: string) {
    this.sendMessage({
      msg,
      exchange: 'noti_product_exchange',
      queue: 'noti_product_queue',
      exchangeDLX: 'noti_product_exchange_dlx',
      routingKeyDLX: 'noti_product_routing_key_dlx'
    })
  }

  public sendMessageWhenNewOrder(msg: string) {
    this.sendMessage({
      msg,
      exchange: 'noti_order_exchange',
      queue: 'noti_order_queue',
      exchangeDLX: 'noti_order_exchange_dlx',
      routingKeyDLX: 'noti_order_routing_key_dlx'
    })
  }

  public sendMessageWhenNewVoucher(msg: string) {
    this.sendMessage({
      msg,
      exchange: 'noti_voucher_exchange',
      queue: 'noti_voucher_queue',
      exchangeDLX: 'noti_voucher_exchange_dlx',
      routingKeyDLX: 'noti_voucher_routing_key_dlx'
    })
  }
}
