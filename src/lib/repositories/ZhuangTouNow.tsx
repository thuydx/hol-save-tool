import {BaseRepository} from '@/lib/baseRepository'
import {parseZhuangTou, ZhuangTouParsed, ZhuangTouRawRow,} from '@/models/zhuangTou'

export class ZhuangTouNowRepository extends BaseRepository {
  protected sectionKey = 'ZhuangTou_now'

  /**
   * value structure:
   * value[regionIndex][nongzIndex][zhuangtouIndex]
   *
   * Farm page uses:
   * region = 0
   */
  async getAllGroups(): Promise<ZhuangTouParsed[][]> {
    const value =
      await this.getValue<ZhuangTouRawRow[][][]>()

    if (!Array.isArray(value)) return []

    const region = value[0]
    if (!Array.isArray(region)) return []

    return region.map((nongzGroup) => {
      if (!Array.isArray(nongzGroup)) return []
      return nongzGroup.map(parseZhuangTou)
    })
  }
}
