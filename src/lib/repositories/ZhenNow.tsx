import {BaseGroupedRepository} from "@/lib/BaseGroupedRepository";
import {zhenRow} from "@/models/zhenNow";

export class ZhenNowRepository
  extends BaseGroupedRepository<zhenRow> {
  protected sectionKey = 'Zhen_now'
}
