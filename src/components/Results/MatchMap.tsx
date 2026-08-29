import React, { useState } from 'react'
import { EXPLANATIONS } from '../../utils/matcher'

interface Props { matched: string[]; missing: string[]; partial: string[]; allRequired: string[] }

const STATUS = {
  matched: { label: '✓ Strong',  color: 'text-green-600 bg-green-50' },
  partial: { label: '⚠ Partial', color: 'text-amber-600 bg-amber-50' },
  missing: { label: '✕ Missing', color: 'text-red-600 bg-red-50'     },
}

export default function MatchMap({ matched, missing, partial, allRequired }: Props) {
  const [open, setOpen] = useState<string | null>(null)

  const getStatus = (skill: string) => {
    const lo = skill.toLowerCase()
    if (matched.map(s=>s.toLowerCase()).includes(lo)) return 'matched'
    if (partial.map(s=>s.toLowerCase()).includes(lo))  return 'partial'
    return 'missing'
  }

  return (
    <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Match Map</h2>
        <p className="text-sm text-gray-400 mt-0.5">Click any row to see details</p>
      </div>
      {allRequired.map((skill, i) => {
        const status = getStatus(skill)
        const { label, color } = STATUS[status]
        const isOpen = open === skill
        return (
          <div
            key={skill}
            className={`border-b border-gray-100 last:border-b-0 cursor-pointer ${i%2===0 ? 'bg-white' : 'bg-gray-50/50'}`}
            onClick={() => setOpen(isOpen ? null : skill)}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="w-4 text-xs text-gray-300">{String(i+1).padStart(2,'0')}</span>
                <span className="font-medium text-[#1A1A1A]">{skill}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-sm ${color}`}>{label}</span>
                <span className="text-gray-300 text-sm">{isOpen ? '−' : '+'}</span>
              </div>
            </div>
            {isOpen && (
              <div className="px-6 pb-5 pt-2 bg-gray-50 border-t border-gray-100 animate-slide">
                <p className="text-sm text-gray-600">
                  {EXPLANATIONS[skill] ?? `${skill} was evaluated against your resume content.`}
                </p>
                {status === 'missing' && (
                  <p className="text-xs text-[#E8501A] mt-2 font-medium">
                    Suggested action: Add this skill explicitly to your resume or skills section.
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
