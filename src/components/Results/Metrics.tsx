import React from 'react'

interface Props {
  metrics: { skills: number; experience: number; keywords: number; responsibilities: number }
}

export default function Metrics({ metrics }: Props) {
  const items = [
    { label: 'Skills',           value: metrics.skills },
    { label: 'Experience',       value: metrics.experience },
    { label: 'Keywords',         value: metrics.keywords },
    { label: 'Responsibilities', value: metrics.responsibilities },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.label} className="border border-gray-200 bg-white p-4 rounded-sm text-center">
          <div className="text-2xl font-semibold text-[#1A1A1A]">{item.value}%</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{item.label}</div>
          <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E8501A] rounded-full transition-all duration-700"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
