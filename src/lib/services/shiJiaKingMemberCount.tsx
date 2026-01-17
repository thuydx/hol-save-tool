import {MemberKingRepository} from '@/repositories/MemberKing'
import {MemberKingQuRepository} from '@/repositories/MemberKingQu'

const memberKingRepo = new MemberKingRepository()
const memberKingQuRepo = new MemberKingQuRepository()

export async function countTotalClanMembers(): Promise<number> {
  const [inner, outer] = await Promise.all([
    memberKingRepo.countByFamilyIndex(),
    memberKingQuRepo.countByFamilyIndex(),
  ])

  return inner + outer
}
