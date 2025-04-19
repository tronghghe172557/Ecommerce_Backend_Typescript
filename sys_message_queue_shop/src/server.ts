import { rabbitMQ } from './dbs'

const name: string = 'Hoang Gia Trong'
console.log(name)

const bootstrap = async () => {
  await rabbitMQ.connect()
}

bootstrap()
