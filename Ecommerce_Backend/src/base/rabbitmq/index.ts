import amqplib, { Channel } from 'amqplib'

import { envVariables, Logger } from '~/base/common/utils'

class RabbitMQ {
  private static instance: RabbitMQ
  public connection: amqplib.ChannelModel | null = null
  public channel: Channel | null = null
  private logger: Logger = new Logger('RabbitMQ')
  private appCrashTimeoutId!: NodeJS.Timeout
  private reconnectTimeoutId!: NodeJS.Timeout
  private reconnectAttempts: number = 0
  private readonly TIMEOUT = 10000
  private readonly MAX_RECONNECT_ATTEMPTS = 10
  private readonly INITIAL_RECONNECT_DELAY = 1000 // 1 giây

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
        ACCOUNT_RABBIT_MQ_HOST: host,
        ACCOUNT_RABBIT_MQ_PORT: port,
        ACCOUNT_RABBIT_MQ: username,
        ACCOUNT_RABBIT_MQ_PASSWORD: password
      } = envVariables

      const url = `amqp://${username}:${password}@${host}:${port}`

      this.logger.info('Connecting to RabbitMQ...')

      this.connection = await amqplib.connect(url)
      this.channel = await this.connection.createChannel()

      // Đặt lại số lần thử kết nối khi kết nối thành công
      this.reconnectAttempts = 0

      // Thiết lập các sự kiện cho kết nối
      this.connection.on('error', (err) => {
        this.logger.error(`RabbitMQ connection error: ${err.message}`)
        this.reconnect()
      })

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed unexpectedly')
        this.reconnect()
      })

      if (this.appCrashTimeoutId) {
        clearTimeout(this.appCrashTimeoutId)
      }

      this.logger.info('Connected to RabbitMQ successfully')
    } catch (error) {
      this.logger.error(`Error connecting to RabbitMQ: ${error instanceof Error ? error.message : String(error)}`)

      // Thử kết nối lại
      this.reconnect()
    }
  }

  /**
   * Cố gắng kết nối lại với RabbitMQ sử dụng cơ chế exponential backoff
   */
  private reconnect(): void {
    // Xóa timeout cũ nếu có
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId)
    }

    // Nếu đã thử quá nhiều lần, crash ứng dụng
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.logger.fatal(
        `Failed to reconnect to RabbitMQ after ${this.MAX_RECONNECT_ATTEMPTS} attempts. Exiting application.`
      )
      process.exit(1)
    }

    // Tăng số lần thử kết nối
    this.reconnectAttempts++

    // Tính thời gian chờ theo cơ chế exponential backoff (1s, 2s, 4s, 8s, ...)
    const delay = Math.min(
      this.INITIAL_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Tối đa 30 giây
    )

    this.logger.warn(
      `Attempting to reconnect to RabbitMQ in ${delay / 1000} seconds (attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`
    )

    // Đặt lịch thử kết nối lại
    this.reconnectTimeoutId = setTimeout(async () => {
      // Reset các kết nối cũ
      this.connection = null
      this.channel = null

      // Thử kết nối lại
      await this.connect()
    }, delay)
  }

  /**
   * Đóng kết nối với RabbitMQ một cách an toàn
   */
  public async close(): Promise<void> {
    try {
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId)
      }

      if (this.appCrashTimeoutId) {
        clearTimeout(this.appCrashTimeoutId)
      }

      if (this.channel) {
        await this.channel.close()
        this.channel = null
      }

      if (this.connection) {
        await this.connection.close()
        this.connection = null
      }

      this.logger.info('Closed RabbitMQ connection')
    } catch (error) {
      this.logger.error(`Error closing RabbitMQ connection: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

const rabbitMQ = RabbitMQ.getInstance()
export { rabbitMQ }
