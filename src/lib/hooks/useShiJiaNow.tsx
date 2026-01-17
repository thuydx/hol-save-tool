'use client'

import {useEffect, useState} from 'react'
import {ShiJiaNowParsed} from '@/types/ShiJiaNow'
import {ShiJiaNowRepository} from '@/repositories/ShiJiaNow'

const repo = new ShiJiaNowRepository()

export function useShiJiaNow() {
  const [data, setData] = useState<ShiJiaNowParsed[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    repo.getAll().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const update = async (
    id: number,
    fn: (m: ShiJiaNowParsed) => ShiJiaNowParsed,
  ) => {
    await repo.update(id, fn)
    setData(await repo.getAll())
  }

  const updateColumn = async (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    await repo.updateColumnByIndex(rowIndex, colIndex, value)
    setData(await repo.getAll())
  }

  const updateSubColumn = async (
    rowId: string,
    colKey: number,
    subKey: string,
    value: string,
  ) => {
    await repo.updateSubColumn(
      rowId,
      String(colKey),
      subKey,
      value,
    )
    setData(await repo.getAll())
  }

  return {
    data,
    loading,
    update,
    updateColumn,
    updateSubColumn,
  }

}

