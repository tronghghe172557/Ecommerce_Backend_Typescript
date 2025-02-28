import mongoose from 'mongoose'
import dev from '~/config/config.mongodb'
const connectString = `mongodb://${dev.db.host}:${dev.db.port}/${dev.db.name}`

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
