import { discountDto, ICreateDiscountDto, IDiscountDto, IQueryDiscountDto } from '~/modules/Discount/dtos'
import { SuccessResponseBody } from '~/base/common/types'
import { DiscountModel } from '~/modules/Discount/models'
import { BadRequestException } from '~/base/common/exceptions'
import { DiscountAppliesTo } from '~/modules/Discount/enums'
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
}
