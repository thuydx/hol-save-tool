import {BaseRepository, MemberRepository} from "@/lib/baseRepository";
import {deserializeMemberOther, MemberOtherParsed, MemberOtherRawRow} from "@/models/memberOther"

export class MemberOtherRepository extends BaseRepository implements MemberRepository<MemberOtherParsed> {
  protected sectionKey = 'Member_other'

  /**
   * Đếm tổng số thành viên nội tộc theo family index
   */
  async countByFamilyIndex(
    familyIndex: number,
  ): Promise<number> {
    const data = await this.getValue<MemberOtherRawRow[][]>()

    if (!Array.isArray(data)) return 0
    if (!Array.isArray(data[familyIndex])) return 0

    return data[familyIndex].length
  }

  async findMemberById(memberId: string): Promise<MemberOtherParsed | null> {
    const families = await this.getRows<MemberOtherRawRow[][]>()
    if (!Array.isArray(families)) return null

    for (const familyRows of families) {
      for (const row of familyRows) {
        const parsed = deserializeMemberOther(row)
        if (parsed.id === memberId) {
          return parsed
        }
      }
    }
    return null
  }

}
