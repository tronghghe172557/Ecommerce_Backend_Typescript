import mongoose from 'mongoose'

const convertToObjectId = (id: string) => new mongoose.Types.ObjectId(id)

export { convertToObjectId }
