import KeyApiModel from '~/models/apiKey.model'
import { IApiKey } from '~/models/apiKey.model'

const findApiKeyByKey = async (key: string): Promise<IApiKey | null> => {
  return KeyApiModel.findOne({
    key: key,
    status: true
  }).lean()
}

export { findApiKeyByKey }
