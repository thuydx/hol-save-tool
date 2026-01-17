'use client'

import {useCallback, useEffect, useState} from 'react'
import {NongZNowRepository} from '@/repositories/NongZNow'
import {FarmParsed, FarmRawRow, parseFarm, serializeFarm,} from '@/models/farms'

const repo = new NongZNowRepository()

export function useFarm() {
  const [rawRows, setRawRows] = useState<FarmRawRow[]>([])
  const [loading, setLoading] = useState(true)

  /* =============================
   * LOAD
   * ============================= */
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const rows = await repo.getAllRows()
      setRawRows(rows)
      setLoading(false)
    }

    load()
  }, [])

  /* =============================
   * UPDATE (PATCH)
   * ============================= */
  const updateFarm = useCallback(
    async (
      rowIndex: number,
      patch: Partial<FarmParsed>
    ) => {
      setRawRows(prev =>
        prev.map((row, i) =>
          i === rowIndex
            ? serializeFarm(row, patch)
            : row
        )
      )

      const current = rawRows[rowIndex]
      if (!current) return

      const next = serializeFarm(current, patch)
      await repo.updateRowByIndex(rowIndex, next)
    },
    [rawRows]
  )

  /* =============================
   * DERIVED
   * ============================= */
  const farms: FarmParsed[] = rawRows.map(parseFarm)

  return {
    loading,
    farms,
    rawRows,
    updateFarm,
  }
}

export function useFarmRow(index: number) {
  const {farms, updateFarm, loading} = useFarm()

  const farm = farms[index]

  return {
    loading,
    farm,
    update: (patch: Partial<FarmParsed>) =>
      updateFarm(index, patch),
  }
}

