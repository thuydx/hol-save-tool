import {useCallback, useMemo} from "react";
import {useTableEditor} from "@/hooks/useTableEditor";
import {useRowEditor} from "@/hooks/useRowEditor";
import {MenKeNowParsed} from '@/lib/models/menKeNow'
import {MenKeNowRepository} from '@/repositories/MenKeNow'

/* =======================
 * ROW (1 MENKE NOW)
 * ======================= */

export function useMenKeNow(index: number) {
  const repo = useMemo(() => new MenKeNowRepository(), [])

  const loadRow = useCallback(
    (i: number) => repo.getParsed(i),
    [repo],
  )

  const updateRow = useCallback(
    (i: number, updater: (row: MenKeNowParsed) => MenKeNowParsed) =>
      repo.updateParsed(i, updater),
    [repo],
  )

  return useRowEditor<MenKeNowParsed>({
    index,
    loadRow,
    updateRow,
  })
}

/* =======================
 * TABLE (N MENKE NOW)
 * ======================= */

export function useMenKesNow() {
  const repo = useMemo(() => new MenKeNowRepository(), [])

  return useTableEditor({
    loadCount: async () => {
      const rows = await repo.all()
      return Array.isArray(rows) ? rows.length : 0
    },
  })
}
