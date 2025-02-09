import express, { Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import Database from './db/init.mongodb'
import router from './routes/index'

const app = express()
// Middleware bảo mật HTTP headers
app.use(helmet())

// Middleware ghi log request
app.use(morgan('dev'))

// Middleware nén dữ liệu response
app.use(compression())


Database.getInstance()

// Route cơ bản
app.use('', router)

// Xử lý lỗi
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.message)
  res.status(500).send('Something went wrong!')
})

// Chạy server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
