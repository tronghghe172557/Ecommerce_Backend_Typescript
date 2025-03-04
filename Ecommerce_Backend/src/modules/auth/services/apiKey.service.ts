import { KeyApiModel, IApiKey } from '~/modules/auth/models'

const findApiKeyByKey = async (key: string): Promise<IApiKey | null> => {
  return KeyApiModel.findOne({
    key: key,
    status: true
  }).lean()
}

export { findApiKeyByKey }
