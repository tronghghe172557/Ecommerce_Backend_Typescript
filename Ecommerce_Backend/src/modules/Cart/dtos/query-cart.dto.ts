import { z } from 'zod'
import { commonQueryDto } from '~/base/common/dtos'
import { SortingUtils } from '~/base/common/utils'
import { CartState } from '~/modules/Cart/enums'

export const queryCartDto = commonQueryDto
  .extend({
    cart_state: z.enum([CartState.ACTIVE, CartState.COMPLETED, CartState.FAILED, CartState.PENDING]).optional(),
    cart_userId: z.string().optional(),
    sorting: SortingUtils.getSortingValueSchema(['cart_state', 'cart_userId', 'createTimestamp'])
  })
  .transform((payload) => {
    SortingUtils.transformSorting(payload)
  })

export type IQueryCartDto = z.infer<typeof queryCartDto>
