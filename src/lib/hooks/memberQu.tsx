import {useCallback, useMemo} from 'react'
import {MemberQuRepository} from '@/lib/repositories/MemberQu'
import {MemberQuParsed} from '@/lib/models/memberQu'
import {useRowEditor} from '@/lib/hooks/useRowEditor'
import {useTableEditor} from '@/lib/hooks/useTableEditor'

/* =======================
 * ROW (1 MEMBER QU)
 * ======================= */

export function useMemberQu(index: number) {
  const repo = useMemo(() => new MemberQuRepository(), [])

  const loadRow = useCallback(
    (i: number) => repo.getParsed(i),
    [repo],
  )

  const updateRow = useCallback(
    (i: number, updater: (row: MemberQuParsed) => MemberQuParsed) =>
      repo.updateParsed(i, updater),
    [repo],
  )

  return useRowEditor<MemberQuParsed>({
    index,
    loadRow,
    updateRow,
  })
}

/* =======================
 * TABLE (N MEMBER QU)
 * ======================= */

export function useMembersQu() {
  const repo = useMemo(() => new MemberQuRepository(), [])

  return useTableEditor({
    loadCount: async () => {
      const rows = await repo.all()
      return Array.isArray(rows) ? rows.length : 0
    },
  })
}
