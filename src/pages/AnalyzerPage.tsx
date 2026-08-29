import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Resume, Job } from '../types'
import { demoResume } from '../data/demoResume'
import { demoJob } from '../data/demoJob'
import { AnalysisContext } from '../context/AnalysisContext'
import { analyze } from '../utils/matcher'

export default function AnalyzerPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setAnalysis } = useContext(AnalysisContext)

  const [resume, setResume] = useState<Resume | null>(null)
  const [job, setJob] = useState<Partial<Job>>({})
  const [fileName, setFileName] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (params.get('demo') === '1') {
      setResume(demoResume)
      setJob(demoJob)
      setFileName('arjun_sharma_resume.pdf')
    }
  }, [params])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setFileName(f.name); setResume(demoResume) }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) { setFileName(f.name); setResume(demoResume) }
  }

  const handleAnalyze = async () => {
    if (!resume || !job.title) return
    setAnalyzing(true)
    setStatus('Sending to AI...')
    try {
      setStatus('Analyzing resume against job...')
      const result = await analyze(resume, job as Job)
      setAnalysis(result)
      navigate('/results')
    } catch (err) {
      setStatus('Analysis failed. Please try again.')
      setAnalyzing(false)
    }
  }

  const ready = !!resume && !!job.title

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold mb-8 text-[#1A1A1A]">Analyze Your Resume</h2>
      <div className="grid md:grid-cols-2 gap-8">

        {/* Resume */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#1A1A1A]">Your Resume</h3>
          <div
            className="border-2 border-dashed border-gray-200 rounded-sm p-8 text-center mb-4 hover:border-[#E8501A] transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input id="file-input" type="file" accept=".pdf,.docx" className="hidden" onChange={handleFile} />
            {fileName ? (
              <p className="text-green-600 font-medium">Uploaded: {fileName}</p>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-1">Drag & drop your PDF or DOCX</p>
                <p className="text-xs text-gray-300">or click to browse</p>
              </>
            )}
          </div>
          <button
            onClick={() => { setResume(demoResume); setFileName('arjun_sharma_resume.pdf') }}
            className="text-sm text-[#E8501A] border border-[#E8501A] px-4 py-2 rounded-sm hover:bg-orange-50 transition-colors w-full"
          >
            Use Demo Resume (Arjun Sharma)
          </button>
          {resume && (
            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <p>Experience detected: {resume.experienceYears} years</p>
              <p>Skills detected: {resume.skills.join(', ')}</p>
              <p>Projects: {resume.projects.length} found</p>
            </div>
          )}
        </div>

        {/* Job */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#1A1A1A]">Target Job</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Job Title"
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#E8501A]"
              value={job.title ?? ''}
              onChange={e => setJob(p => ({ ...p, title: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Company"
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#E8501A]"
              value={job.company ?? ''}
              onChange={e => setJob(p => ({ ...p, company: e.target.value }))}
            />
            <textarea
              placeholder="Paste the full job description here..."
              rows={7}
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#E8501A] resize-none"
              value={job.description ?? ''}
              onChange={e => setJob(p => ({ ...p, description: e.target.value, requiredSkills: demoJob.requiredSkills, responsibilities: demoJob.responsibilities }))}
            />
            <button
              onClick={() => setJob(demoJob)}
              className="text-sm text-[#E8501A] border border-[#E8501A] px-4 py-2 rounded-sm hover:bg-orange-50 transition-colors w-full"
            >
              Use Demo Job (Infosys Digital)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={!ready || analyzing}
          className="bg-[#E8501A] text-white px-8 py-3 rounded-sm font-medium text-lg hover:bg-[#c94218] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Match ->'}
        </button>
        {analyzing && (
          <div className="text-center">
            <p className="text-sm text-gray-500 animate-pulse">{status}</p>
            <div className="mt-2 flex justify-center gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-[#E8501A] rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
