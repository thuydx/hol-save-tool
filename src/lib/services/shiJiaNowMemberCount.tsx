import {MemberOtherRepository} from '@/repositories/MemberOther'
import {MemberOtherQuRepository} from '@/repositories/MemberOtherQu'

const memberOtherRepo = new MemberOtherRepository()
const memberOtherQuRepo = new MemberOtherQuRepository()

export async function countTotalClanMembers(
  familyIndex: number,
): Promise<number> {
  const [inner, outer] = await Promise.all([
    memberOtherRepo.countByFamilyIndex(familyIndex),
    memberOtherQuRepo.countByFamilyIndex(familyIndex),
  ])

  return inner + outer
}
