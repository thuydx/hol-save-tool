'use client'

import {useEffect, useState} from 'react'
import {ZhuangTouNowRepository} from '@/repositories/ZhuangTouNow'
import {ZhuangTouParsed} from '@/models/zhuangTou'

const repo = new ZhuangTouNowRepository()

export function useZhuangTou() {
  const [groups, setGroups] = useState<
    ZhuangTouParsed[][]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await repo.getAllGroups()
      setGroups(data)
      setLoading(false)
    }
    load()
  }, [])

  return {
    loading,
    groups,
  }
}
