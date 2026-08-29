import React, { useState } from 'react'
import { Fix } from '../../types'

const IMPACT_COLOR: Record<Fix['impact'], string> = {
  HIGH:   'bg-red-100 text-red-700 border border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-700 border border-amber-200',
  LOW:    'bg-gray-100 text-gray-600 border border-gray-200',
}

export default function TopFixes({ fixes }: { fixes: Fix[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const copy = (fix: Fix) => {
    navigator.clipboard.writeText(fix.suggestion).then(() => {
      setCopied(fix.id)
      setTimeout(() => setCopied(null), 1800)
    })
  }

  return (
    <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">If you only change 5 things…</h2>
      </div>
      {fixes.map(fix => (
        <div key={fix.id} className="border-b border-gray-100 last:border-b-0">
          <div
            className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setOpen(open === fix.id ? null : fix.id)}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-200 w-8">{String(fix.id).padStart(2,'0')}</span>
              <span className="font-medium text-[#1A1A1A]">{fix.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-sm font-medium ${IMPACT_COLOR[fix.impact]}`}>
                {fix.impact} IMPACT
              </span>
              <span className="text-gray-300 text-sm">{open === fix.id ? '−' : '+'}</span>
            </div>
          </div>
          {open === fix.id && (
            <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100 animate-slide">
              <p className="text-sm text-gray-600 mt-3 mb-1"><strong>Why:</strong> {fix.why}</p>
              <p className="text-sm text-gray-600 mb-3"><strong>What to change:</strong> {fix.suggestion}</p>
              <button
                onClick={() => copy(fix)}
                className="text-xs bg-[#1A1A1A] text-white px-3 py-1.5 rounded-sm hover:bg-[#333] transition-colors"
              >
                {copied === fix.id ? 'Copied ✓' : 'Copy Suggestion'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
