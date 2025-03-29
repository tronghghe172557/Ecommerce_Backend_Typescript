import { discountDto, ICreateDiscountDto, IDiscountDto } from '~/modules/Discount/dtos'
import { SuccessResponseBody } from '~/base/common/types'
import { DiscountModel } from '~/modules/Discount/models'
import { BadRequestException } from '~/base/common/exceptions'
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
}
