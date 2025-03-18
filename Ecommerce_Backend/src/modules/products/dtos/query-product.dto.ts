import { z } from 'zod'

import { commonQueryDto } from '~/base/common/dtos'
import { SortingUtils } from '~/base/common/utils'

export const queryQueryProductDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'product_name',
      'product_price',
      'product_quantity',
      'product_type',
      'product_shop',
      'product_ratingAverage',
      'createTimestamp'
    ])
  })
  .transform((payload) => SortingUtils.transformSorting(payload))

export type IQueryProductDto = z.infer<typeof queryQueryProductDto>
