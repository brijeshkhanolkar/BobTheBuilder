import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loadAnalyses } from '../utils/storage'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`
}

export default function MyAnalyses() {
  const navigate = useNavigate()
  const list = loadAnalyses()
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-[#1A1A1A] mb-8">My Analyses</h2>
      {list.length === 0 ? (
        <div className="border border-gray-200 bg-white rounded-sm p-12 text-center">
          <p className="text-gray-400 mb-4">No saved analyses yet.</p>
          <button onClick={() => navigate('/analyzer')} className="text-[#E8501A] border border-[#E8501A] px-4 py-2 rounded-sm text-sm hover:bg-orange-50">
            Start an Analysis
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a, i) => (
            <div key={i} className="border border-gray-200 bg-white rounded-sm px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1A1A1A]">{a.jobTitle}</p>
                <p className="text-sm text-gray-400">{a.company} · {timeAgo(a.timestamp)}</p>
              </div>
              <div className="text-2xl font-bold text-[#E8501A]">{a.score}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
