import {BaseRepository} from "@/lib/baseRepository";

export class MemberOtherQuRepository extends BaseRepository {
  protected sectionKey = 'Member_Other_Qu'

  /**
   * Đếm tổng số thành viên nội tộc theo family index
   */
  async countByFamilyIndex(
    familyIndex: number,
  ): Promise<number> {
    const data = await this.getValue<any[][]>()

    if (!Array.isArray(data)) return 0
    if (!Array.isArray(data[familyIndex])) return 0

    return data[familyIndex].length
  }
}
