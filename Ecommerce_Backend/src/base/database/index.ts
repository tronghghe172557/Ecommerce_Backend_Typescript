import mongoose from 'mongoose'
import { envVariables } from '~/base/common/utils/env.util'
const connectString = `mongodb://${envVariables.DEV_DB_HOST}:${envVariables.DEV_DB_PORT}/${envVariables.DEV_DB_NAME}`

class Database {
  private static instance: Database | null = null

  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    mongoose
      .connect(connectString)
      .then(() => console.log(`Connected to ${type} database successfully`))
      .catch((err) => console.error(`Error connecting to ${type} database: ${err}`))
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
  console.log('❌ MongoDB connection closed')
  process.exit(0)
})

export default Database
