// The '~' alias is used to refer to the root directory or the 'src' directory of the project.
// It is configured in the project's module resolution settings (e.g., tsconfig.json or webpack.config.js).
// import ShopModel from '~/models/access.model'
// import roleShop from '~/constants/role'
import { ISignUp } from '~/types/signup'

// Promise<void> => Hàm không trả về giá trị
class AccessService {
  static signUp = async ({ name, email, password }: ISignUp): Promise<void> => {
    // logic
    console.log(name, email, password)
  }
}

export default AccessService
