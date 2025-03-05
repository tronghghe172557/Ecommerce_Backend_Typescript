import { ShopModel, IShop } from '~/modules/auth/models'

const findShopByEmail = async (email: string): Promise<IShop | null> => {
  return await ShopModel.findOne({ email })
}

const createShop = async (shop: IShop): Promise<IShop | null> => {
  return await ShopModel.create(shop)
}

export { findShopByEmail, createShop }
