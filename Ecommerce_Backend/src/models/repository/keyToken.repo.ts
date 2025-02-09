import KeyTokenModel, { IKeyToken } from './../keyToken.model'

const createKeyToken = async (keyToken: IKeyToken): Promise<IKeyToken | null> => {
  return await KeyTokenModel.create(keyToken)
}

export { createKeyToken }
