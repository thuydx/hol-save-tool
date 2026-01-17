import {MemberNowRepository} from '@/repositories/MemberNow'
import {MemberOtherRepository} from '@/repositories/MemberOther'
import {MemberKingRepository} from '@/repositories/MemberKing'
import {string} from "prop-types";

export type ResolvedMemberFengdi = {
  name: string
  fengdi: string
  fengdiTitle: string
}

function buildResult(state:number, member: any, t: any) {
  const name = member.person?.name ?? ''
  const level = Number(member.titleFengdi.level)
  const prefectureId = Number(member.titleFengdi.prefectureId)

  let fengdi: string
    if(state == 2) {
      fengdi = t.city_name?.[prefectureId] ?? ''
    }else if (state == -1) {
      fengdi = t.fief_name?.[prefectureId] ?? ''
    } else {
      fengdi = ''
  }
  const levelName = t.fief_level?.[level] ?? ''

  return {
    name,
    fengdi,
    levelName,
    fengdiTitle: `${fengdi}`.trim(),
  }
}

export async function resolveMemberByRef(
  state: number,
  memberId: string,
  t: any,
): Promise<ResolvedMemberFengdi | null> {
  if (!memberId) return null
  // 1️⃣ Member Now
  const memberNowRepo = new MemberNowRepository()
  const memberNow = await memberNowRepo.findMemberById(memberId)
  if (memberNow) {
    return buildResult(state, memberNow, t)
  }

  // 2️⃣ Member Other
  const memberOtherRepo = new MemberOtherRepository()
  const memberOther = await memberOtherRepo.findMemberById(memberId)
  if (memberOther) {
    return buildResult(state, memberOther, t)
  }

  // 3️⃣ Member King
  const memberKingRepo = new MemberKingRepository()
  const memberKing = await memberKingRepo.findMemberById(memberId)
  if (memberKing) {
    return buildResult(state, memberKing, t)
  }

  return null
}
