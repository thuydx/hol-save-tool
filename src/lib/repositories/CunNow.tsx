import {BaseGroupedRepository} from '@/lib/BaseGroupedRepository'
import type {cunRow} from '@/models/cunNow'

export class CunNowRepository
  extends BaseGroupedRepository<cunRow> {
  protected sectionKey = 'Cun_now'
}

