import {useCallback, useState} from 'react'

type UseRowEditorOptions<T> = {
  /** index của row (do page quyết định) */
  index: number

  /** load 1 row (pure async, không setState bên trong) */
  loadRow: (index: number) => Promise<T | null>

  /**
   * update 1 row
   * updater: (currentRow) => nextRow
   */
  updateRow: (
    index: number,
    updater: (row: T) => T,
  ) => Promise<void>
}

export function useRowEditor<T>({
                                  index,
                                  loadRow,
                                  updateRow,
                                }: UseRowEditorOptions<T>) {
  const [row, setRow] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  /* =======================
   * LOAD (MANUAL)
   * ======================= */
  const load = useCallback(async () => {
    setLoading(true)
    const data = await loadRow(index)
    setRow(data)
    setLoading(false)
  }, [index, loadRow])

  /* =======================
   * UPDATE (OPTIMISTIC)
   * ======================= */
  const update = useCallback(
    async (updater: (row: T) => T) => {
      if (!row) return
      const next = updater(row)
      setRow(next)
      await updateRow(index, () => next)
    },
    [row, index, updateRow],
  )

  return {
    row,
    setRow,
    loading,
    load,
    update,
  }
}
