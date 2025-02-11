import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import Database from './db/init.mongodb'
import indexRouter from './routes/index'

const app = express()
// Middleware bảo mật HTTP headers
app.use(helmet())

// Middleware ghi log request
app.use(morgan('dev'))

// Middleware nén dữ liệu response
app.use(compression())

//
app.use(express.json()) // Middleware này giúp Express parse JSON từ request body.
app.use(express.urlencoded({ extended: true })) // Middleware này giúp Express parse URL encoded data từ request body.

// connect to MongoDB
Database.getInstance()

// Route cơ bản
app.use('', indexRouter)

// Xử lý lỗi
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: 'Lỗi rồi!' })
})

// Chạy server 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
