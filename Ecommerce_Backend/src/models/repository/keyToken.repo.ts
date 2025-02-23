import KeyTokenModel, { IKeyToken } from './../keyToken.model'

const createKeyToken = async (keyToken: IKeyToken): Promise<IKeyToken | null> => {
  return await KeyTokenModel.create(keyToken)
}

const findKeyTokenByKey = async (key: string): Promise<IKeyToken | null> => {
  return KeyTokenModel.findOne({
    key: key,
    status: true
  }).lean()
}

export { createKeyToken, findKeyTokenByKey }
