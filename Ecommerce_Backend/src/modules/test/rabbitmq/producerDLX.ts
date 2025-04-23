// DLX: dead letter exchange

import { rabbitMQ } from '~/base/rabbitmq'
import { Logger } from '~/base/common/utils'

const logger = new Logger('RabbitMQ Producer')

const runProducerDLX = async () => {
  try {
    if (!rabbitMQ.channel) {
      throw new Error('Failed to create RabbitMQ channel in producer DLX')
    }
    const channel = rabbitMQ.channel

    const notiExchange = 'notiEx' // tên của exchange. Exchange là " trạm điều phối tin nhắn"
    const notiQueue = 'notiQueueProcess' // tên của queue chính
    const notiRoutingKey = 'notiRoutingKeyProcess' // routing key chính

    const notiExchangeDLX = 'notiExDLX' // tên của exchange DLX
    const notiRoutingKeyDLX = 'notiRoutingKeyDLX' // tên của routing key DLX

    // 1. create exchange
    /*
        assertExchange: phương thức để tạo exchange nếu nó không tồn tại trong channel
        type: là kiểu của exchange. có 4 kiểu: direct, topic, fanout, headers
        direct: là kiểu exchange mà bạn có thể gửi tin nhắn đến một hoặc nhiều queue dựa trên routing key
        fanout: là kiểu exchange mà bạn có thể gửi tin nhắn đến tất cả các queue mà nó đã bind
        topic: là kiểu exchange mà bạn có thể gửi tin nhắn đến một hoặc nhiều queue dựa trên pattern của routing key
        headers: là kiểu exchange mà bạn có thể gửi tin nhắn đến một hoặc nhiều queue dựa trên các thuộc tính của tin nhắn
    */
    await channel.assertExchange(notiExchange, 'direct', {
      durable: true
    })

    // 2. create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phép nhiều consumer cùng kết nối đến queue
      /*
        1. tin nhắn lỗi hoặc hết hạn mà ko được xử lí -> hệ thống sẽ tự động gửi đến DLX
        2. với định tuyến là notiRoutingKeyDLX
        3. Nếu tin nhắn trong DLX sẽ được gửi 3 lần -> vẫn lỗi -> người dùng sẽ làm thủ công ( HOT FIX )
      */
      deadLetterExchange: notiExchangeDLX, // chỉ định DLX cho queue
      deadLetterRoutingKey: notiRoutingKeyDLX // chỉ định routing key cho DLX
    })

    // 3.
    /*
        bindQueue: là phương thức để liên kết queue với exchange
        Khi có message gửi đến exchange với routing key tương ứng
        thì message sẽ được gửi đến queue
        queue: tên của queue
        source: tên của exchange
        pattern: routingKey: là routing key mà bạn muốn sử dụng để liên kết queue với exchange
        bindQueue: bạn đã ràng buộc (bind) queue với routing key rồi -> kiểu gắn địa chỉ cho queue của bạn vậy
    */
    await channel.bindQueue(queueResult.queue, notiExchange, notiRoutingKey)

    // 4.
    const msg = 'Hello, ShopDev by Trong a new product'
    /*
        VÔ NGHĨA
        await channel.sendToQueue(notiQueue, Buffer.from(msg), {
        expiration: '10000' // thời gian sống của tin nhắn
        })

        publish: là phương thức để gửi tin nhắn đến exchange
        exchange: tên của exchange mà bạn muốn gửi tin nhắn đến
        routingKey: là routing key mà bạn muốn sử dụng để gửi tin nhắn đến exchange ( exchange + routing key sẽ tìm đến đúng queue mà bạn đã bind ) 
        msg: là nội dung của tin nhắn mà bạn muốn gửi đến exchange

        người nhận chỉ cần biết mỗi tên queue thôi, không cần biết đến exchange nào cx như routing key nào
    */
    await channel.publish(notiExchange, notiRoutingKey, Buffer.from(msg), {
      expiration: '10000' // thời gian sống của tin nhắn
    })

    console.error(`Message sent to ${notiExchange} with routing key ${notiRoutingKey}: ${msg}`)
  } catch (error) {
    logger.error(`Error in producer: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export { runProducerDLX }
