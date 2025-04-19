import { BadRequestException } from '~/base/common/exceptions'
import { SuccessResponseBody } from '~/base/common/types'
import { acquireLock } from '~/base/redis/redis.service'
import { CartModel } from '~/modules/Cart/models'
import {
  ICheckout,
  CheckoutOrder,
  ItemCheckout,
  CheckoutReviewResult,
  checkoutReviewResultSchema,
  ICreateOrder,
  IOrder,
  orderSchema
} from '~/modules/Checkouts/dtos'
import { DiscountService } from '~/modules/Discount/services'
import { checkProductByServer } from '~/modules/products/utils'
import { OrderModel } from '~/modules/Checkouts/models'
import { OrderStatus } from '~/modules/Checkouts/enums'

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
        feeShip: 0,
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

  static async orderByUser({
    cart_id,
    user_id,
    shop_order_ids,
    user_address,
    user_payment,
    user_note
  }: ICreateOrder): Promise<SuccessResponseBody<IOrder>> {
    const checkoutPreview = await this.checkOutReview({
      cartId: cart_id,
      userId: user_id,
      shop_order_ids
    })

    const { shop_order_ids_new, checkout_order } = checkoutPreview.data
    console.log('[0]shop_order_ids_new::', shop_order_ids_new)

    // check product that has in stock or not
    const products = shop_order_ids_new.flatMap((order) => order.item_products)
    console.log('[1]products::', products)
    /*
        1. Duyệt qua từng sản phẩm trong giỏ hàng
        2. Thực hiện tạo khoá -> đảm bảo chỉ có 1 khoá 1 người trong cùng 1 thời điểm có thể thao tác được với sản phẩm đó
        3. Nếu tạo khoá thành công -> thực hiện thao tác với sản phẩm trong hàm (acquireLock)
        4. Nếu thao tác thành công -> giải phóng khoá
      */
    for (let i = 0; i < products.length; i++) {
      const { product_id, product_quantity } = products[i]
      const keyLock = await acquireLock(product_id, product_quantity)
      console.log('[2]keyLock::', keyLock)
    }

    const newOrder = await OrderModel.create({
      order_userId: user_id,
      order_checkout: checkout_order,
      order_shipping_address: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
      order_trackingNumber: `order_${Date.now()}`,
      order_status: OrderStatus.PENDING,
      order_note: user_note
    })

    console.log('[3]newOrder::', newOrder)

    if (!newOrder) {
      throw new BadRequestException('Order failed')
    }

    // update cart
    await CartModel.findByIdAndUpdate(
      { _id: cart_id },
      {
        $set: {
          cart_products: [],
          cart_totalPrice: 0,
          cart_totalQuantity: 0
        }
      },
      { new: true }
    )

    return {
      data: orderSchema.parse(newOrder)
    }
  }
}
