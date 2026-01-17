import {useCallback, useMemo, useState} from 'react'

type UseTableEditorOptions = {
  /**
   * Hàm trả về số lượng row
   * KHÔNG được setState bên trong
   */
  loadCount: () => Promise<number>
}

export function useTableEditor({
                                 loadCount,
                               }: UseTableEditorOptions) {
  const [count, setCount] = useState(0)

  /* =======================
   * LOAD (MANUAL)
   * ======================= */
  const load = useCallback(async () => {
    const nextCount = await loadCount()
    setCount(nextCount)
  }, [loadCount])

  /* =======================
   * INDEXES
   * ======================= */
  const indexes = useMemo(
    () => Array.from({length: count}, (_, i) => i),
    [count],
  )

  /* =======================
   * FORCE RELOAD
   * ======================= */
  const forceReload = useCallback(() => {
    void load()
  }, [load])

  return {
    indexes,
    count,
    load,
    forceReload,
  }
}
