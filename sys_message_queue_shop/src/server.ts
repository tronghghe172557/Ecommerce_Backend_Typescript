import express from 'express'

import { rabbitMQ } from './dbs'
import Database from './dbs/init.mongodb'
import { envVariables, Logger } from './common/utils'
import { producerOrderedMessagequeue } from './services/ordered-producer.service'
import { consumerOrderedMessagequeue } from './services/ordered-consumer.service'

const bootstrap = async () => {
  const app = express()
  const logger = new Logger('Server')

  // connect to RabbitMQ
  await rabbitMQ.connect()
  // connect to MongoDB -> only connect once
  Database.getInstance()

  // create queue
  // const queueName = 'test-topic'
  // await MessageService.consumerReceived(queueName)
  // const queueName = 'notiQueueProcess'
  // await MessageService.consumerToQueueNormal(queueName)
  // await MessageService.consumerToQueueFailed(queueName)

  await producerOrderedMessagequeue()

  await consumerOrderedMessagequeue()

  // Chạy server
  const PORT = envVariables.PORT || 3000
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
  })
}

bootstrap()
