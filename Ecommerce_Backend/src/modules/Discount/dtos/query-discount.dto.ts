import { z } from 'zod'
import { commonQueryDto } from '~/base/common/dtos'
import { SortingUtils } from '~/base/common/utils'

export const queryDiscountDto = commonQueryDto
  .extend({
    discount_name: z.string().optional(),
    discount_description: z.string().optional(),
    discount_type: z.enum(['FIX_AMOUNT', 'PERCENTAGE']).optional(),
    discount_value: z.coerce.number().optional(),
    discount_code: z.string().optional(),
    discount_start_date: z.date().optional(),
    discount_end_date: z.date().optional(),
    discount_max_uses: z.coerce.number().optional(),
    discount_uses_count: z.coerce.number().optional(),
    discount_max_user_per_user: z.coerce.number().optional(),
    discount_min_order_value: z.coerce.number().optional(),
    discount_shopId: z.string().optional(),
    discount_is_active: z.boolean().optional(),
    discount_applies_to: z.enum(['ALL', 'SPECIFIC']).optional(),
    sorting: SortingUtils.getSortingValueSchema([
      'discount_name',
      'discount_type',
      'discount_value',
      'discount_start_date',
      'discount_end_date',
      'discount_max_uses',
      'discount_uses_count',
      'discount_max_user_per_user',
      'discount_min_order_value',
      'discount_is_active',
      'createTimestamp'
    ])
  })
  .transform((payload) => SortingUtils.transformSorting(payload))

export type IQueryDiscountDto = z.infer<typeof queryDiscountDto>
