import { Router } from 'express'
import { asyncHandler } from '~/base/common/handlers'
import { CartController } from '~/modules/Cart/controllers/cart.controller'

const cartRouter = Router()

/**
 * Cart routes
 * 1. Create user cart
 * 2. Update user cart
 * 3. Add product to cart
 * 4. Get user cart
 * 5. Delete cart
 * 6. Delete cart item
 */

// [POST] /api/v1/carts - Create a new cart for user
cartRouter.post('/', asyncHandler(CartController.CreateUserCart))

// [PUT] /api/v1/carts - Update user cart
cartRouter.put('/', asyncHandler(CartController.UpdateUserCart))

// [POST] /api/v1/carts/add - Add product to cart
cartRouter.post('/add', asyncHandler(CartController.AddToCart))

// [GET] /api/v1/carts - Get user cart
cartRouter.get('/', asyncHandler(CartController.GetUserCart))

// [DELETE] /api/v1/carts - Delete user cart
cartRouter.delete('/', asyncHandler(CartController.DeleteCart))

// [DELETE] /api/v1/carts/item - Delete cart item
cartRouter.delete('/item', asyncHandler(CartController.DeleteCartItem))

// /api/v1/carts
export { cartRouter }
