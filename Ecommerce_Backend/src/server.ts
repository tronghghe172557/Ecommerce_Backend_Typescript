import { appRouter } from './base/router/app.router'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import Database from '~/base/database'
import { redis } from '~/base/redis'
import { envVariables, Logger } from '~/base/common/utils'
import { HttpExceptionHandler } from '~/base/common/handlers'
import { configSwagger } from '~/base/swagger'
import { rabbitMQ } from './base/rabbitmq'
// import { runProducer } from './modules/test/rabbitmq/producer.rabbitmq'
// import { runProducerDLX } from './modules/test/rabbitmq/producerDLX'
// import { runConsumer } from './modules/test/rabbitmq/consumer.rabbitmq'

const bootstrap = async () => {
  const app = express()
  const logger = new Logger('Server')
  // Middleware bảo mật HTTP headers
  app.use(helmet())

  // Middleware ghi log request
  app.use(morgan('dev'))

  // Middleware nén dữ liệu response
  app.use(compression())

  //
  app.use(express.json()) // Middleware này giúp Express parse JSON từ request body.
  app.use(express.urlencoded({ extended: true })) // Middleware này giúp Express parse URL encoded data từ request body.

  // connect to MongoDB
  Database.getInstance()
  // connect to Redis
  redis.connect()
  // connect to RabbitMQ
  await rabbitMQ.connect()

  // test RabbitMQ connection with producer and consumer
  // catch: ensure that the producer is running even if there is an error
  // await runProducer().catch((error) => {
  //   console.error('Error running producer:', error)
  // })

  // await runProducerDLX().catch((error) => {
  //   console.error('Error running producer:', error)
  // })

  // await runConsumer().catch((error) => {
  //   console.error('Error running Consumer:', error)
  // })

  // Route cơ bản
  app.use('/v1/api', appRouter)

  // swagger
  configSwagger(app)

  // func handle error
  app.use(HttpExceptionHandler)

  // Chạy server
  const PORT = envVariables.PORT || 3000
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`)
  })
}

bootstrap()
