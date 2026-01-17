import {useCallback, useMemo} from 'react'
import {MemberNowRepository} from '@/lib/repositories/MemberNow'
import {MemberParsed} from '@/lib/models/members'
import {useRowEditor} from '@/lib/hooks/useRowEditor'
import {useTableEditor} from '@/lib/hooks/useTableEditor'

/* =======================
 * ROW (1 MEMBER)
 * ======================= */

export function useMember(index: number) {
  const repo = useMemo(() => new MemberNowRepository(), [])

  const loadRow = useCallback(
    (i: number) => repo.getParsed(i),
    [repo],
  )

  const updateRow = useCallback(
    (i: number, updater: (row: MemberParsed) => MemberParsed) =>
      repo.updateParsed(i, updater),
    [repo],
  )

  return useRowEditor<MemberParsed>({
    index,
    loadRow,
    updateRow,
  })
}

/* =======================
 * TABLE (N MEMBERS)
 * ======================= */

export function useMembers() {
  const repo = useMemo(() => new MemberNowRepository(), [])

  return useTableEditor({
    loadCount: async () => {
      const rows = await repo.all()
      return Array.isArray(rows) ? rows.length : 0
    },
  })
}
