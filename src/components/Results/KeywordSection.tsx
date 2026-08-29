import React from 'react'

interface Props { found: string[]; weak: string[]; missing: string[] }

function Chip({ text, cls }: { text: string; cls: string }) {
  return <span className={`inline-block px-3 py-1 rounded-sm text-sm font-medium mr-2 mb-2 border ${cls}`}>{text}</span>
}

export default function KeywordSection({ found, weak, missing }: Props) {
  return (
    <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Keyword Coverage</h2>
      </div>
      <div className="grid md:grid-cols-3 divide-x divide-gray-100">
        <div className="p-6">
          <p className="text-xs uppercase tracking-widest text-green-600 mb-3 font-medium">Found</p>
          <div>{found.length ? found.map(k=><Chip key={k} text={k} cls="border-green-200 bg-green-50 text-green-700"/>) : <span className="text-gray-400 text-sm">None</span>}</div>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-widest text-amber-600 mb-3 font-medium">Weak</p>
          <div>{weak.length ? weak.map(k=><Chip key={k} text={k} cls="border-amber-200 bg-amber-50 text-amber-700"/>) : <span className="text-gray-400 text-sm">None</span>}</div>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-widest text-red-500 mb-3 font-medium">Missing</p>
          <div>{missing.length ? missing.map(k=><Chip key={k} text={k} cls="border-red-200 bg-red-50 text-red-600"/>) : <span className="text-gray-400 text-sm">None</span>}</div>
        </div>
      </div>
    </div>
  )
}
