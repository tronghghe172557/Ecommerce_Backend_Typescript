import amqplib, { Channel } from 'amqplib'
import { envVariables, Logger } from '~/common/utils'

class RabbitMQ {
  private static instance: RabbitMQ
  public connection: amqplib.ChannelModel | null = null
  public channel: Channel | null = null
  private logger: Logger = new Logger('RabbitMQ')
  private appCrashTimeoutId!: NodeJS.Timeout
  private readonly TIMEOUT = 10000

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): RabbitMQ {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ()
    }
    return RabbitMQ.instance
  }

  public async connect(): Promise<void> {
    try {
      if (this.connection) {
        return
      }

      const {
        ACCOUNT_RABBITMQ_HOST: host,
        ACCOUNT_RABBITMQ_PORT: port,
        ACCOUNT_RABBITMQ: username,
        ACCOUNT_RABBITMQ_PASSWORD: password
      } = envVariables

      const url = `amqp://${username}:${password}@${host}:${port}`

      this.logger.info('Connecting to RabbitMQ...')

      this.connection = await amqplib.connect(url)
      this.channel = await this.connection.createChannel()

      // Set up connection events
      this.connection.on('error', (err) => {
        this.logger.error(`RabbitMQ connection error: ${err.message}`)
      })

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed')
      })

      if (this.appCrashTimeoutId) {
        clearTimeout(this.appCrashTimeoutId)
      }

      this.logger.info('Connected to RabbitMQ successfully')
    } catch (error) {
      this.logger.error(`Error connecting to RabbitMQ: ${error instanceof Error ? error.message : String(error)}`)

      // Set a timeout to crash the app if reconnection fails too many times
      this.appCrashTimeoutId = setTimeout(() => {
        this.logger.fatal('Failed to connect to RabbitMQ after multiple attempts. Exiting application.')
        process.exit(1)
      }, this.TIMEOUT)
    }
  }

  public async consumerQueue(queueName: string): Promise<void> {
    try {
      // assertQueue: create queue if it doesn't exist in channel
      // durable: true means the queue will survive a server restart
      await this.channel?.assertQueue(queueName, { durable: true })

      this.logger.info(`Waiting for messages in ${queueName}...`)
      // consume: receive messages from the queue
      this.channel?.consume(
        queueName,
        (msg) => {
          this.logger.warn(`Received message: ${msg?.content.toString()}`)
        },
        { noAck: true } // noAck: true means the message will be removed from the queue immediately after being received
      )
    } catch (error) {
      this.logger.error(`Error consuming queue ${queueName}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

const connectToRabbitMQTest = async () => {
  try {
    // Make sure we have a channel after connection
    if (!rabbitMQ.channel) {
      throw new Error('Failed to create RabbitMQ channel')
    }

    // Publish message to queue
    const queue = 'test-queue'
    const message = 'Hello, ShopDev by Trong'

    await rabbitMQ.channel.assertQueue(queue) // Create queue
    await rabbitMQ.channel.sendToQueue(queue, Buffer.from(message)) // Send message to queue

    console.log(`Message sent to ${queue}: ${message}`)

    // Note: We don't close the channel here as it's managed by the rabbitMQ instance
    // If you need to close it for testing purposes, you would need to modify the class
    await rabbitMQ.channel.close() // Close channel after sending message
  } catch (error) {
    console.error(`Error connect: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const rabbitMQ = RabbitMQ.getInstance()
export { rabbitMQ, connectToRabbitMQTest }
