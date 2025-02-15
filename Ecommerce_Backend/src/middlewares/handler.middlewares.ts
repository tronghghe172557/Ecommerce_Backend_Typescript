import { Request, Response, NextFunction } from 'express'

// Định nghĩa type cho function handler
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>

const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

export default asyncHandler
