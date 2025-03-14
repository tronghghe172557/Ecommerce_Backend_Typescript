import { z } from 'zod'
import { deleteDto } from '~/base/dtos'

const baseClothingSchema = z
  .object({
    _id: z.string(),
    brand: z.string(),
    size: z.string(),
    material: z.string(),
    createTimestamp: z.date()
  })
  .partial()

const baseElectronicSchema = z
  .object({
    _id: z.string(),
    manufacturer: z.string(),
    model: z.string(),
    color: z.string(),
    createTimestamp: z.date()
  })
  .partial()

export const clothingDto = baseClothingSchema.transform((data) => data)
export const electronicDto = baseElectronicSchema.transform((data) => data)

export const deleteClothingDto = baseClothingSchema.merge(deleteDto).transform((data) => data)
export const deleteElectronicDto = baseElectronicSchema.merge(deleteDto).transform((data) => data)

export type IClothingDto = z.infer<typeof baseClothingSchema>
export type IElectronicDto = z.infer<typeof baseElectronicSchema>
export type IDeleteClothingDto = z.infer<typeof baseElectronicSchema>
export type IDeleteElectronicDto = z.infer<typeof baseElectronicSchema>
