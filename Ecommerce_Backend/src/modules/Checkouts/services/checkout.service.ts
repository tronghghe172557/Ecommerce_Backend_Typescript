import { BadRequestException } from '~/base/common/exceptions'
import { SuccessResponseBody } from '~/base/common/types'
import { CartModel } from '~/modules/Cart/models'
import {
  ICheckout,
  CheckoutOrder,
  ItemCheckout,
  CheckoutReviewResult,
  checkoutReviewResultSchema
} from '~/modules/Checkouts/dtos'
import { DiscountService } from '~/modules/Discount/services'
import { checkProductByServer } from '~/modules/products/utils'

export class CheckoutService {
  static async checkOutReview({
    cartId,
    userId,
    shop_order_ids
  }: ICheckout): Promise<SuccessResponseBody<CheckoutReviewResult>> {
    // check cart exist
    const foundCart = await CartModel.findById({ _id: cartId })
    if (!foundCart) {
      throw new BadRequestException('Cart not found')
    }

    // return data format
    const checkout_order: CheckoutOrder = {
        totalPrice: 0,
        freeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0
      },
      shop_order_ids_new: ItemCheckout[] = []

    // caculate total price for each product
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shop_id, shop_discounts, item_products } = shop_order_ids[i]

      // check product available in shop
      const checkProductInDb = await checkProductByServer(item_products)
      // console.log('checkProductServer::', checkProductInDb)

      // checkout price
      const checkoutPrice = checkProductInDb.reduce((acc, item) => {
        return acc + item.product_price * item.product_quantity
      }, 0)

      // update totalPrice -> oke -> understand
      checkout_order.totalPrice += checkoutPrice // (1)

      const itemCheckout: ItemCheckout = {
        shop_id,
        shop_discounts,
        priceRaw: checkoutPrice, // price before discount
        priceApplyDiscount: checkoutPrice, // price after discount
        item_products: checkProductInDb // product detail
      }

      // check discount exist -> if shopDiscount exist, calculate discount
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        const { data } = await DiscountService.getDiscountAmount({
          discount_code: shop_discounts[0].code,
          discount_shopId: shop_discounts[0].shop_id,
          userId: userId,
          products: checkProductInDb
        })

        // console.log('totalPrice::', data.totalPrice)
        // console.log('discount::', data.discount)

        if (data.totalPrice == 0 || data.discount == 0) {
          throw new BadRequestException('Discount is something wrong')
        }
        // total price after discount
        checkout_order.totalDiscount += data.discount // (3)

        // change price
        itemCheckout.priceApplyDiscount = checkoutPrice - data.discount
      }

      // the last calculate
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount // (4)
      shop_order_ids_new.push(itemCheckout)
    }

    const result = {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }

    // Kiểm tra tính hợp lệ của kết quả trả về
    return {
      data: checkoutReviewResultSchema.parse(result)
    }
  }
  static async orderByUser() {}
}
