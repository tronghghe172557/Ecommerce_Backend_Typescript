import { appRouter } from './base/router/app.router'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import Database from '~/base/database'
import { redis } from '~/base/redis'
import { Logger } from '~/base/common/utils'

const app = express()
const logger = new Logger('Server')
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
// connect to Redis
redis.connect()

// Route cơ bản
app.use('/v1/api', appRouter)

// func handle error
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = 500
  
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error in app'
  })
})

// Chạy server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
})
