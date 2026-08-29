import React, { createContext, useState, ReactNode } from 'react'
import { Analysis } from '../types'

interface Ctx {
  analysis?: Analysis
  setAnalysis: (a: Analysis) => void
}

export const AnalysisContext = createContext<Ctx>({ setAnalysis: () => {} })

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analysis, setAnalysis] = useState<Analysis | undefined>(undefined)
  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  )
}
