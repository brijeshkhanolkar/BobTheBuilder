import React, { useEffect, useState } from 'react'

interface Props { score: number; company: string; jobTitle: string }

export default function Score({ score, company, jobTitle }: Props) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const dur = 900
    const step = () => {
      const p = Math.min((performance.now() - start) / dur, 1)
      setDisplay(Math.round(p * score))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [score])

  const label =
    score >= 80 ? 'Strong match — a few important gaps remain.'
    : score >= 65 ? 'Good match — consider key improvements.'
    : 'Partial match — significant gaps to address.'

  return (
    <div className="border border-gray-200 bg-white p-8 rounded-sm">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{jobTitle} · {company}</p>
      <h2 className="text-3xl font-semibold text-[#1A1A1A] mb-6">Resume Match</h2>
      <div className="flex items-end gap-2 mb-3 animate-count">
        <span className="text-8xl font-bold text-[#E8501A] tabular-nums">{display}</span>
        <span className="text-2xl text-gray-400 mb-3">/ 100</span>
      </div>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}
