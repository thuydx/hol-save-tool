'use client'

import {useEffect, useState} from 'react'
import {KingCityDataParsed} from '@/types/KingCityData'
import {KingCityDataRepository} from '@/repositories/KingCityData'

const repo = new KingCityDataRepository()

export function useKingCityData() {
  const [data, setData] = useState<KingCityDataParsed | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    repo.get().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const update = async (
    updater: (m: KingCityDataParsed) => KingCityDataParsed,
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
