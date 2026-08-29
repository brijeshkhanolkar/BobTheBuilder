import React, { useState } from 'react'

interface Props { metrics: { skills: number; keywords: number; experience: number; responsibilities: number } }

const SECTIONS = [
  { key: 'experience',       label: 'Experience',  detail: 'Your experience section is strong. Quantify outcomes where possible.' },
  { key: 'skills',           label: 'Skills',      detail: 'Some required skills are missing. Add TypeScript, AWS, and Testing.' },
  { key: 'responsibilities', label: 'Projects',    detail: 'Projects are relevant. Add measurable impact (users, speed gains).' },
  { key: 'keywords',         label: 'Summary',     detail: 'Strengthen your summary to mirror job description language.' },
  { key: 'keywords',         label: 'Keywords',    detail: 'Several keywords from the job description are absent in your resume.' },
] as const

export default function ResumeHealth({ metrics }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const valueMap: Record<string, number> = { experience: metrics.experience, skills: metrics.skills, responsibilities: metrics.responsibilities, keywords: metrics.keywords }
  const icon = (v: number) => v >= 80 ? '✓' : '⚠'
  const iconColor = (v: number) => v >= 80 ? 'text-green-600' : 'text-amber-500'
  return (
    <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Resume Health</h2>
      </div>
      {SECTIONS.map(sec => {
        const val = valueMap[sec.key]
        const isOpen = open === sec.label
        return (
          <div key={sec.label} className="border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50"
            onClick={() => setOpen(isOpen ? null : sec.label)}>
            <div className="flex items-center px-6 py-3">
              <span className="w-32 text-sm font-medium text-gray-700">{sec.label}</span>
              <div className="flex-1 mx-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#E8501A] transition-all duration-700" style={{ width: `${val}%` }} />
              </div>
              <span className="w-8 text-right text-sm font-semibold text-[#1A1A1A]">{val}</span>
              <span className={`ml-3 text-sm ${iconColor(val)}`}>{icon(val)}</span>
            </div>
            {isOpen && (
              <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100 animate-slide">
                <p className="text-sm text-gray-600 mt-2">{sec.detail}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
