import { rabbitMQ } from './dbs'
import Database from './dbs/init.mongodb'

const name: string = 'Hoang Gia Trong'
console.log(name)

const bootstrap = async () => {
  // connect to RabbitMQ
  await rabbitMQ.connect()
  // connect to MongoDB
  Database.getInstance()
}

bootstrap()
