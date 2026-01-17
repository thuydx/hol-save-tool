import {useCallback, useEffect, useMemo, useState} from 'react'
import {getRows} from '@/lib/gameData.model'
import {HorseHaveRepository} from '@/repositories/HorseHave'
import {DEFAULT_HORSE_HAVE_ROW, HorseHaveRow,} from '@/models/horseHave'

const repo = new HorseHaveRepository()

export function useHorseHave() {
  const [rows, setRows] = useState<HorseHaveRow[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())

  /* ---------- Load ---------- */

  const load = useCallback(async () => {
    const data = await getRows('Horse_Have')
    setRows(data as HorseHaveRow[])
  }, [])

  /* =======================
   * EFFECT – load once
   * ======================= */
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!mounted) return
      await load()
    })()
    return () => {
      mounted = false
    }
  }, [load])


  /* ---------- Derived ---------- */

  const usedOwnerIds = useMemo(
    () =>
      new Set(
        rows.map(r => r[6]).filter(v => v !== 'null')
      ),
    [rows]
  )

  /* ---------- Actions ---------- */

  const add = async (row: HorseHaveRow = DEFAULT_HORSE_HAVE_ROW) => {
    await repo.create(row)
    await load()
  }

  const removeSelected = async () => {
    await repo.deleteByIndexes(selected)
    await load()
    setSelected(new Set())
  }

  const updateCell = async (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const v = value === '' ? 'null' : value
    await repo.updateByIndex(rowIndex, colIndex, v)

    // optimistic update
    setRows(prev => {
      const next = [...prev]
      next[rowIndex] = [...next[rowIndex]]
      next[rowIndex][colIndex] = v
      return next
    })
  }

  const toggleRow = (rowIndex: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(rowIndex) ? next.delete(rowIndex) : next.add(rowIndex)
      return next
    })
  }

  return {
    rows,
    selected,
    usedOwnerIds,

    load,
    add,
    removeSelected,
    updateCell,
    toggleRow,
  }
}
