import { Redis as RedisClient } from 'ioredis'

import { envVariables } from '~/base/common/utils'

class Redis {
  private instance: RedisClient
  private appCrashTimeoutId!: NodeJS.Timeout
  private readonly TIMEOUT = 10000

  constructor() {
    this.instance = new RedisClient({
      host: envVariables.REDIS_HOST,
      port: envVariables.REDIS_PORT,
      password: envVariables.REDIS_PASSWORD,
      lazyConnect: true
    })

    this.instance.once('connecting', () => {
      console.error('Connecting to redis...')
    })

    this.instance.on('connect', () => {
      console.error('Connected to redis successfully!')
      if (this.appCrashTimeoutId) {
        clearTimeout(this.appCrashTimeoutId)
      }
    })

    this.instance.on('reconnecting', () => {
      console.error('Reconnecting to redis...')
    })

    this.instance.on('error', (err) => {
      console.error(err)
    })
  }

  async connect() {
    try {
      await this.instance.connect()
    } catch (err) {
      console.error(err)
      this.appCrashTimeoutId = setTimeout(() => {
        console.error(err)
      }, this.TIMEOUT)
    }
  }

  public getInstance() {
    return this.instance
  }
}

export const redis = new Redis()
