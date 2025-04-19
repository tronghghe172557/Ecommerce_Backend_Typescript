import { z } from 'zod'

/**
 * This DTO is meant as a base for other query params DTOs to extend. It can validate but won't transform any data.
 */
export const commonQueryDto = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  pageSize: z.coerce.number().int().positive().catch(10).default(10),
  deleted: z.boolean().default(false).catch(false),
  fromCreateTimestamp: z.coerce.date().optional(),
  toCreateTimestamp: z.coerce.date().optional(),
  fromDeleteTimestamp: z.coerce.date().optional(),
  toDeleteTimestamp: z.coerce.date().optional()
})

export type CommonQueryDto = z.infer<typeof commonQueryDto>
