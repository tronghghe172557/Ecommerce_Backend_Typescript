import { Request, Response, NextFunction } from 'express'

// Định nghĩa type cho function handler
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>

const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // catch next rồi pass vào hàm handler
    /*
    Express sẽ tự động chuyển lỗi đến middleware 
    có 4 tham số (error, req, res, next) 
    - đây là format chuẩn của Express cho error handling middleware
    */
    fn(req, res, next).catch(next)
  }
}

export { asyncHandler }
