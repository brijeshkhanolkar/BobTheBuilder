import React, { useState } from 'react'
import { Question } from '../../types'

export default function InterviewPrep({ questions }: { questions: Question[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Questions You Should Prepare For</h2>
        <p className="text-sm text-gray-400 mt-0.5">Based on the job description</p>
      </div>
      {questions.map(q => (
        <div key={q.id} className="border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50"
          onClick={() => setOpen(open === q.id ? null : q.id)}>
          <div className="flex items-start justify-between px-6 py-4">
            <div className="flex gap-4">
              <span className="text-sm font-bold text-gray-300 mt-0.5">{String(q.id).padStart(2,'0')}</span>
              <p className="text-sm font-medium text-[#1A1A1A]">{q.text}</p>
            </div>
            <span className="text-gray-300 ml-4">{open === q.id ? '−' : '+'}</span>
          </div>
          {open === q.id && (
            <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100 animate-slide">
              <p className="text-sm text-gray-500 mt-2 mb-1"><strong>Why they're asking:</strong> {q.why}</p>
              <p className="text-sm text-gray-500"><strong>What to prepare:</strong> {q.preparation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
