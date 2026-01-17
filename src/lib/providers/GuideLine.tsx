'use client'

import {createContext, ReactNode, useContext, useState} from 'react'

export type GuideLineData = {
  title?: string
  description?: string
  content?: ReactNode
}

type GuideLineContextType = {
  data: GuideLineData | null
  setGuideData: (data: GuideLineData | null) => void
}

const GuideLineContext = createContext<GuideLineContextType | null>(null)

export const useGuideLine = () => {
  const ctx = useContext(GuideLineContext)
  if (!ctx) {
    throw new Error('useGuideLine must be used inside GuideLineProvider')
  }
  return ctx
}

export function GuideLineProvider({ children }: { children: React.ReactNode }) {
  const [data, setGuideData] = useState<GuideLineData | null>(null)

  return (
    <GuideLineContext.Provider value={{ data, setGuideData }}>
      {children}
    </GuideLineContext.Provider>
  )
}
