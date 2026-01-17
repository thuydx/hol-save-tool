import {BaseRepository} from "@/lib/baseRepository";

export class MemberKingQuRepository extends BaseRepository {
  protected sectionKey = 'Member_King_Qu'

  /**
   * Đếm tổng số thành viên nội tộc theo family index
   */
  async countByFamilyIndex(): Promise<number> {
    const data = await this.getValue<any[]>()

    if (!Array.isArray(data)) return 0

    return data.length
  }
}
