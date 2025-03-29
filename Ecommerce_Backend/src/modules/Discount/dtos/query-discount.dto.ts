import { z } from 'zod'
import { commonQueryDto } from '~/base/common/dtos'
import { SortingUtils } from '~/base/common/utils'

export const queryDiscountDto = commonQueryDto
  .extend({
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
