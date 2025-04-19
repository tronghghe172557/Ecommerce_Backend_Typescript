import { ProductModel } from '~/modules/products/models'
import { BadRequestException } from '../common/exceptions'
import { redis } from './index'
import { Logger } from '~/base/common/utils/logger.util'

const logger = new Logger('RedisService')

/*
  1. Sử dụng khoá phân tán để khoá sản phẩm khi có nhiều người thực hiện order cùng 1 sản phẩm cùng 1 thời điểm
  2. Sử dụng premistic (khoá bi quan) để khoá sản phẩm
  3. Sử dụng redis để lưu khoá phân tán và giải phóng khoá (khi thực hiện xong mục đích)
*/

const acquireLock = async (productId: string, quantity: number, retryTimes = 10): Promise<string | true | false> => {
  const redisClient = redis.getInstance()
  const key = `lock_v2025_${productId}`
  const expireTime = 3 // 3 giây

  for (let i = 0; i < retryTimes; i++) {
    // Chuyển đối tượng thành JSON string
    const value = JSON.stringify({
      productId,
      quantity,
      createdAt: new Date().toISOString()
    })

    const result = await redisClient.set(key, value, 'EX', expireTime, 'NX')
    console.log(`key result:: ${result}`)

    if (result) {
      /*
        Nếu lấy được khoá -> thực hiện hành động
        Thực hiện các hành động với kho
      */
      // Thao tác với inventory -> kho -> don't do anything
      const findProduct = await ProductModel.findOne({
        _id: productId
      })
        .lean()
        .exec()

      if (!findProduct) {
        throw new BadRequestException(`Product ${productId} not found`)
      }

      if (findProduct.product_quantity < quantity) {
        throw new BadRequestException(`Product ${productId} not enough quantity`)
      }

      // Giải phóng khoá sau khi thực hiện xong
      await redisClient.del(key)
      return key
    } else {
      /*
          nếu không lấy được khoá
          TH1: 
            Khoá được được 1 người sử dụng -> chờ hệ thống xử lí xong hành động và giải phóng khoá       
          TH2:
            Khoá bị hết hạn -> thử lại
        */

      // Chờ một khoảng thời gian ngắn trước khi thử lại
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  throw new BadRequestException(`Unable to acquire lock for product ${productId} after ${retryTimes} attempts`)
}

const releaseLock = async (productId: string): Promise<boolean> => {
  try {
    const redisClient = redis.getInstance()
    const key = `lock_v2025_${productId}`

    const result = await redisClient.del(key)

    if (result === 1) {
      logger.info(`Released lock for product ${productId}`)
      return true
    } else {
      logger.info(`Lock for product ${productId} was not found or already released`)
      return false
    }
  } catch (error) {
    logger.error(`Error releasing lock: ${error}`)
    return false
  }
}

export { acquireLock, releaseLock }
