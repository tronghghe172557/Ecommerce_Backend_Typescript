import {
  discountAmount,
  discountDto,
  ICreateDiscountDto,
  IDiscountAmount,
  IDiscountAmountQuery,
  IDiscountDto,
  IQueryDiscountDto
} from '~/modules/Discount/dtos'
import { SuccessResponseBody } from '~/base/common/types'
import { DiscountModel } from '~/modules/Discount/models'
import { BadRequestException } from '~/base/common/exceptions'
import { DiscountAppliesTo, DiscountType } from '~/modules/Discount/enums'
import { ProductModel } from '~/modules/products/models'
import { SortOrder } from 'mongoose'
import { IProductDto } from '~/modules/products/dtos'
/**
 * 1. createDiscountCode
 * 2. foundDiscountByShopIdAndCode
 * 3. foundDiscountById
 * 4. updateDiscountCode
 * 5. getAllDiscountCodesWithProduct
 * 6. getAllDiscountCodesForShop
 */
export class DiscountService {
  /* 16
        discount_name,
        discount_description,
        discount_type,
        discount_value,
        discount_code,
        discount_start_date,
        discount_end_date,
        discount_max_uses,
        discount_users_used, => default = 0 when create
        discount_uses_count, => default = 0 when create
        discount_max_user_per_user,
        discount_min_order_value,
        discount_shopId,
        discount_is_active,
        discount_applies_to,
        discount_products_ids

    */
  static async createDiscountCode({
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_max_user_per_user,
    discount_min_order_value,
    discount_shopId,
    discount_is_active,
    discount_applies_to,
    discount_products_ids,
    discount_users_used,
    discount_uses_count
  }: ICreateDiscountDto): Promise<SuccessResponseBody<IDiscountDto>> {
    // create index for discount code
    const foundDiscount = await DiscountModel.findOne({ discount_code, discount_shopId })
    if (foundDiscount) {
      throw new BadRequestException('Discount code already exists in DiscountService')
    }

    const newDiscount = await DiscountModel.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_max_user_per_user,
      discount_min_order_value,
      discount_shopId,
      discount_is_active,
      discount_applies_to,
      discount_uses_count,
      discount_users_used,
      discount_products_ids
    })

    console.log('discount', newDiscount)

    return {
      data: discountDto.parse(newDiscount)
    }
  }

  static async updateDiscountCode() {
    // Implement code
  }

  //
  static async getAllProductsWithDiscountCodes({
    discount_code,
    discount_shopId,
    pageSize,
    page,
    sorting
  }: IQueryDiscountDto): Promise<SuccessResponseBody<IProductDto[]>> {
    /*
      1. found discount by code and shopId
      2. get all products with discount_applies_to: SPECIFIC | ALL
    */

    const foundDiscount = await DiscountModel.findOne({
      discount_code,
      discount_shopId
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestException('Discount code not found or inactive')
    }

    let products = [] as IProductDto[]
    let total = 0

    if (foundDiscount.discount_applies_to === DiscountAppliesTo.ALL) {
      // Trường hợp giảm giá áp dụng cho tất cả sản phẩm
      // Truy vấn tất cả sản phẩm của shopId
      products = await ProductModel.find({
        product_shop: discount_shopId,
        isPublished: true
      })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort(
          sorting.map(({ field, direction }) => {
            return [field, direction] as [string, SortOrder]
          })
        )

      // Đếm tổng số sản phẩm để phân trang
      total = await ProductModel.countDocuments({
        product_shop: discount_shopId,
        isPublished: true
      })
    }

    if (foundDiscount.discount_applies_to === DiscountAppliesTo.SPECIFIC) {
      // Trường hợp giảm giá chỉ áp dụng cho các sản phẩm cụ thể
      // Trích xuất danh sách ID sản phẩm từ discount_products_ids
      const productIds = foundDiscount.discount_products_ids.map((item) => item.product_id)

      products = await ProductModel.find({
        _id: { $in: productIds },
        product_shop: discount_shopId,
        isPublished: true
      })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort(
          sorting.map(({ field, direction }) => {
            return [field, direction] as [string, SortOrder]
          })
        )

      // Đếm tổng số sản phẩm để phân trang
      total = await ProductModel.countDocuments({
        _id: { $in: productIds },
        product_shop: discount_shopId,
        isPublished: true
      })
    }

    // Đếm tổng số sản phẩm để phân trang
    const totalPage = Math.ceil(total / pageSize)

    return {
      data: products,
      meta: {
        pagination: {
          page,
          pageSize,
          total,
          totalPage: totalPage,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPage
        },
        sorting
      }
    }
  }

  /*
    Get all discount code shop
  */
  static async getAllDiscountCodesForShop({
    discount_shopId,
    pageSize,
    page
  }: IQueryDiscountDto): Promise<SuccessResponseBody<IDiscountDto[]>> {
    const discounts = await DiscountModel.find({
      discount_shopId,
      discount_is_active: true
    })
      .limit(+pageSize)
      .skip((+page - 1) * +pageSize)
      .lean()

    return {
      data: discounts,
      meta: {
        pagination: {
          page: +page,
          pageSize: +pageSize,
          total: discounts.length,
          totalPage: Math.ceil(discounts.length / +pageSize),
          hasPreviousPage: +page > 1,
          hasNextPage: +page < Math.ceil(discounts.length / +pageSize)
        }
      }
    }
  }

  /**
   * Delete a discount code (mark as deleted)
   * @param shopId - The ID of the shop that owns the discount code
   * @param codeId - The ID of the discount code to delete
   * @returns The updated discount with is_deleted flag set to true
   */
  static async deleteDiscountCode({
    shopId,
    codeId
  }: {
    shopId: string
    codeId: string
  }): Promise<SuccessResponseBody<IDiscountDto>> {
    // Find the discount by shop ID and code ID
    const foundDiscount = await DiscountModel.findOne({
      discount_shopId: shopId,
      _id: codeId,
      discount_is_active: true
    })

    if (!foundDiscount) {
      throw new BadRequestException("Discount code doesn't exist or already deleted")
    }

    // Update the discount to mark it as deleted
    const discountUpdated = await DiscountModel.findByIdAndUpdate(
      foundDiscount._id,
      {
        discount_is_active: false
      },
      {
        new: true // Return the modified document rather than the original
      }
    )

    if (!discountUpdated) {
      throw new BadRequestException('Failed to delete discount code')
    }

    return {
      data: discountDto.parse(discountUpdated)
    }
  }

  /**
   * Restore a previously deleted (deactivated) discount code
   * @param shopId - The ID of the shop that owns the discount code
   * @param codeId - The ID of the discount code to restore
   * @returns The updated discount with is_active flag set to true
   */
  static async restoreDiscountCode({
    shopId,
    codeId
  }: {
    shopId: string
    codeId: string
  }): Promise<SuccessResponseBody<IDiscountDto>> {
    // Find the discount by shop ID and code ID (that is currently inactive)
    const foundDiscount = await DiscountModel.findOne({
      discount_shopId: shopId,
      _id: codeId,
      discount_is_active: false
    })

    if (!foundDiscount) {
      throw new BadRequestException("Discount code doesn't exist or is already active")
    }

    // Check if the discount code is still valid for restoration
    const currentDate = new Date()
    if (foundDiscount.discount_end_date && new Date(foundDiscount.discount_end_date) < currentDate) {
      throw new BadRequestException('Cannot restore discount code that has already expired')
    }

    // Update the discount to mark it as active again
    const discountUpdated = await DiscountModel.findByIdAndUpdate(
      foundDiscount._id,
      {
        discount_is_active: true
      },
      {
        new: true // Return the modified document rather than the original
      }
    )

    if (!discountUpdated) {
      throw new BadRequestException('Failed to restore discount code')
    }

    return {
      data: discountDto.parse(discountUpdated)
    }
  }

  /*
    Get discount amount
  */
  static async getDiscountAmount({
    discount_code,
    discount_shopId,
    userId,
    products
  }: IDiscountAmountQuery): Promise<SuccessResponseBody<IDiscountAmount>> {
    const foundDiscount = await DiscountModel.findOne({
      discount_code,
      discount_shopId
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestException('Discount code not found or inactive')
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_max_user_per_user,
      discount_type,
      discount_value
    } = foundDiscount

    // check discount code is active
    if (!discount_is_active) {
      throw new BadRequestException('Discount code is inactive')
    }

    // check discount max user per use
    // console.log(
    //   `${discount_users_used.length} >= ${discount_max_uses}: ${discount_users_used.length >= discount_max_uses}`
    // )
    if (discount_users_used.length >= discount_max_uses) {
      throw new BadRequestException('Discount code has reached maximum usage')
    }

    // count total value and check min order value
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((total, product) => {
        return total + product.product_price * product.product_quantity
      }, 0)

      // check totalOder with min order value
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestException('Total order value is less than minimum order value')
      }
    }

    // check max user per use
    // discount_users_used = ['userId1', 'userId2']
    if (discount_max_user_per_user > 0) {
      const userUsedDiscount = discount_users_used.filter((user) => user === userId)
      // console.log(
      //   `${userUsedDiscount.length} >= ${discount_max_user_per_user}: ${userUsedDiscount.length >= discount_max_user_per_user}`
      // )
      if (userUsedDiscount.length >= discount_max_user_per_user) {
        throw new BadRequestException('Discount code has reached maximum usage per user')
      }
    }

    // count total end value
    const endTotalValue =
      discount_type === DiscountType.FIX_AMOUNT ? discount_value : (totalOrder * discount_value) / 100

    return {
      data: discountAmount.parse({
        totalOrder,
        discount: endTotalValue,
        totalPrice: totalOrder - endTotalValue
      })
    }
  }

  /**
   * Cancel a discount code for a specific user
   * @param shopId - The ID of the shop that owns the discount code
   * @param codeId - The ID of the discount code
   * @param userId - The ID of the user canceling the discount
   * @returns The updated discount with the user removed from the users_used array
   */
  static async useDiscountCode({
    shopId,
    codeId,
    userId
  }: {
    shopId: string
    codeId: string
    userId: string
  }): Promise<SuccessResponseBody<IDiscountDto>> {
    // Find the discount by shop ID and code ID
    const foundDiscount = await DiscountModel.findOne({
      discount_shopId: shopId,
      _id: codeId,
      discount_is_active: true
    })

    if (!foundDiscount) {
      throw new BadRequestException("Discount code doesn't exist or is inactive")
    }

    const discountUpdated = await DiscountModel.findByIdAndUpdate(
      foundDiscount._id,
      {
        $push: { discount_users_used: userId },
        $inc: {
          discount_uses_count: 1
        }
      },
      {
        new: true // Return the modified document rather than the original
      }
    )

    if (!discountUpdated) {
      throw new BadRequestException('Failed to cancel discount code')
    }

    return {
      data: discountDto.parse(discountUpdated)
    }
  }
}
