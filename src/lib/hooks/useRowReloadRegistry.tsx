import {useCallback, useRef} from 'react'

export type RowReloadFn = () => void

export function useRowReloadRegistry() {
  const registryRef = useRef<Map<number, RowReloadFn>>(new Map())

  /* =======================
   * REGISTER / UNREGISTER
   * ======================= */

  const register = useCallback((rowIndex: number, reloadFn: RowReloadFn) => {
    registryRef.current.set(rowIndex, reloadFn)
  }, [])

  const unregister = useCallback((rowIndex: number) => {
    registryRef.current.delete(rowIndex)
  }, [])

  /* =======================
   * RELOAD
   * ======================= */

  const reloadAll = useCallback(() => {
    registryRef.current.forEach(fn => {
      fn()
    })
  }, [])

  const reloadOne = useCallback((rowIndex: number) => {
    const fn = registryRef.current.get(rowIndex)
    if (fn) {
      fn()
    }
  }, [])

  return {
    register,
    unregister,
    reloadAll,
    reloadOne,
  }
}
