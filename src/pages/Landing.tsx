import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">

      {/* Hero */}
      <div className="mb-16">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Bob — Resume Intelligence</p>
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-[#1A1A1A] mb-6">
          Your resume isn't bad.<br />
          It's just not optimized<br />
          <span className="text-[#E8501A]">for this job.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-8">
          See exactly what matches, what's missing, and what to fix before you apply.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/analyzer')}
            className="bg-[#1A1A1A] text-white px-6 py-3 rounded-sm font-medium hover:bg-[#333] transition-colors"
          >
            Analyze My Resume
          </button>
          <button
            onClick={() => navigate('/analyzer?demo=1')}
            className="border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 rounded-sm font-medium hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            Try Demo
          </button>
        </div>
      </div>

      {/* Flow strip */}
      <div className="flex items-center gap-3 text-sm text-gray-400 uppercase tracking-widest mb-16 border-y border-gray-200 py-4">
        {['Resume', 'â†’', 'Job', 'â†’', 'Match', 'â†’', 'Improve'].map((s, i) => (
          <span key={i} className={s === 'â†’' ? '' : 'font-medium text-[#1A1A1A]'}>{s}</span>
        ))}
      </div>

      {/* Feature blocks */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Match', desc: 'See how closely your experience fits the job description.' },
          { title: 'Gaps',  desc: 'Find missing skills and keywords that cost you interviews.' },
          { title: 'Improve', desc: 'Get specific, ranked changes that are actually worth making.' },
        ].map(f => (
          <div key={f.title} className="border border-gray-200 bg-white p-6 rounded-sm">
            <h3 className="text-lg font-semibold mb-2 text-[#1A1A1A]">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

