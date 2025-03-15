import mongoose from 'mongoose'
import { envVariables } from '~/base/common/utils/env.util'
import { Logger } from '~/base/common/utils'
const connectString = `mongodb://${envVariables.DEV_DB_HOST}:${envVariables.DEV_DB_PORT}/${envVariables.DEV_DB_NAME}`
const logger = new Logger('Database')
class Database {
  private static instance: Database | null = null

  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    mongoose
      .connect(connectString)
      .then(() => logger.info(`Connected to ${type} database successfully!`))
      .catch((err) => logger.fatal(`Error connecting to ${type} database: ${err}`))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

// Đóng kết nối khi ứng dụng dừng
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  logger.trace('❌ MongoDB connection closed')
  process.exit(0)
})

export default Database
