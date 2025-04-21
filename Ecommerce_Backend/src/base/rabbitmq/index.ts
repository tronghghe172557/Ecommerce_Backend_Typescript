import amqplib, { Channel } from 'amqplib'

import { envVariables, Logger } from '~/base/common/utils'

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
}

const rabbitMQ = RabbitMQ.getInstance()
export { rabbitMQ }
