'use client'

import {useEffect, useMemo, useState} from 'react'
import {PropHaveRepository} from '@/lib/repositories/PropHave'
import {ALL_KEY, WarehouseRow} from '@/lib/models/warehouse'

export function useWarehouse(
  items: Record<string, string>,
  groupItems: Record<string, Record<string, string>>
) {
  const repo = useMemo(() => new PropHaveRepository(), [])

  const [warehouse, setWarehouse] = useState<WarehouseRow[]>([])
  const [selectedLeft, setSelectedLeft] = useState<Set<string>>(new Set())
  const [selectedRight, setSelectedRight] = useState<Set<string>>(new Set())
  const [selectedGroup, setSelectedGroup] = useState<string>(ALL_KEY)

  const refreshWarehouse = async () => {
    const rows = await repo.all()
    setWarehouse(rows.map(r => ({id: r[0], quantity: r[1] ?? '1'})))
  }

  /* ===== LOAD ===== */
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const rows = await repo.all()
      if (cancelled) return

      setWarehouse(
        rows.map(r => ({
          id: r[0],
          quantity: r[1] ?? '1',
        }))
      )
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [repo])

  /* ===== RIGHT TABLE DATA ===== */
  const rightTableData = useMemo<Record<string, string>>(() => {
    if (selectedGroup === ALL_KEY) return items
    return groupItems[selectedGroup] ?? {}
  }, [selectedGroup, items, groupItems])

  /* ===== SELECT ===== */
  const toggleLeft = (id: string) => {
    setSelectedLeft(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleRight = (id: string) => {
    setSelectedRight(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  /* ===== SELECT ALL ===== */
  const allLeftIds = warehouse.map(w => w.id)
  const isAllLeftSelected =
    allLeftIds.length > 0 && allLeftIds.every(id => selectedLeft.has(id))

  const toggleSelectAllLeft = () => {
    setSelectedLeft(isAllLeftSelected ? new Set() : new Set(allLeftIds))
  }

  const allRightIds = Object.keys(rightTableData)
  const isAllRightSelected =
    allRightIds.length > 0 && allRightIds.every(id => selectedRight.has(id))

  const toggleSelectAllRight = () => {
    setSelectedRight(isAllRightSelected ? new Set() : new Set(allRightIds))
  }

  /* ===== ACTIONS ===== */
  const addToWarehouse = async () => {
    const exists = new Set(warehouse.map(w => w.id))
    const toAdd = Array.from(selectedRight).filter(id => !exists.has(id))

    for (const id of toAdd) {
      await repo.createRow([id, '1'])
    }

    setSelectedRight(new Set())
    await refreshWarehouse()
    return toAdd.length
  }

  const deleteFromWarehouse = async () => {
    const toDelete = new Set(selectedLeft)

    await repo.deleteWhere(row => toDelete.has(row[0]))
    setSelectedLeft(new Set())
    await refreshWarehouse()
    return toDelete.size
  }

  const updateQuantity = async (id: string, value: string) => {
    setWarehouse(w =>
      w.map(row => (row.id === id ? {...row, quantity: value} : row))
    )
    await repo.updateQuantity(id, value)
  }

  return {
    warehouse,
    rightTableData,
    selectedGroup,
    setSelectedGroup,

    selectedLeft,
    selectedRight,

    toggleLeft,
    toggleRight,
    toggleSelectAllLeft,
    toggleSelectAllRight,

    isAllLeftSelected,
    isAllRightSelected,

    addToWarehouse,
    deleteFromWarehouse,
    updateQuantity,
  }
}
