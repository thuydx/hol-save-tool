'use client'

import {useEffect, useState} from 'react'
import {ShiJiaKingParsed} from '@/types/ShiJiaKing'
import {ShiJiaKingRepository} from '@/repositories/ShiJiaKing'

const repo = new ShiJiaKingRepository()

export function useShiJiaKing() {
  const [data, setData] = useState<ShiJiaKingParsed | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    repo.get().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const update = async (
    updater: (m: ShiJiaKingParsed) => ShiJiaKingParsed,
  ) => {
    if (!data) return
    const next = updater(data)
    await repo.save(next)
    setData(next)
  }

  return {
    data,
    loading,
    update,
  }
}
