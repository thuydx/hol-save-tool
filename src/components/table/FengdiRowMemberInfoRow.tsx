import {CTableDataCell} from '@coreui/react'
import {resolveMemberByRef} from '@/services/memberResolver'
import {useEffect, useState} from 'react'

type MemberInfo = {
  fengdiTitle?: string
  fengdi?: string
  name?: string
  levelName?: string
}

export function FengdiRowMemberInfo({
                                      index,
                                      state,
                                      memberRef,
                                      t,
                                    }: Readonly<{
  index: number
  state: number
  memberRef: string | null
  t: any
}>) {
  const [member, setMember] = useState<MemberInfo | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!memberRef) return

    resolveMemberByRef(state, memberRef, t).then(res => {
      if (!cancelled) {
        setMember(res ?? null)
      }
    })

    return () => {
      cancelled = true
    }
  }, [memberRef, t])

  let fengdi = member?.fengdi ?? ''
  // if (!fengdi) fengdi = t.city_name?.[index] ?? ''
  const memberName = member?.name ?? ''
  const memberLevel = member?.levelName != null ? `${member.levelName}` : ''
  const stateLabel = state === -2 ? t.shiJiaKing.fengdi_state.empty
    : state === -1
      ? t.shiJiaKing.fengdi_state.external
      : t.shiJiaKing.fengdi_state.internal
  return (
    <>
      {/* FENGDI TITLE */}
      <CTableDataCell style={{width: '180px'}}>
        {fengdi}
      </CTableDataCell>
      {/* FENGDI LEVEL */}
      <CTableDataCell style={{width: '180px'}}>
        {memberLevel}
      </CTableDataCell>
      {/* MEMBER NAME */}
      <CTableDataCell style={{width: '180px'}}>
        {memberName}
      </CTableDataCell>
      {/* STATE */}
      <CTableDataCell style={{width: '120px'}}>
        {stateLabel}
      </CTableDataCell>
    </>
  )
}
