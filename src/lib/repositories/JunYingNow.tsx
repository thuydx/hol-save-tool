import {BaseGroupedRepository} from "@/lib/BaseGroupedRepository";
import {JunYingRow} from "@/models/junYingNow";

export class JunYingNowRepository
  extends BaseGroupedRepository<JunYingRow> {
  protected sectionKey = 'JunYing_now'
}
