import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnalysisContext } from '../context/AnalysisContext'
import { saveAnalysis } from '../utils/storage'
import Score from '../components/Results/Score'
import Metrics from '../components/Results/Metrics'
import MatchMap from '../components/Results/MatchMap'
import KeywordSection from '../components/Results/KeywordSection'
import TopFixes from '../components/Results/TopFixes'
import ResumeHealth from '../components/Results/ResumeHealth'
import InterviewPrep from '../components/Results/InterviewPrep'
import { demoJob } from '../data/demoJob'

export default function ResultsPage() {
  const { analysis } = useContext(AnalysisContext)
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  if (!analysis) { navigate('/'); return null }

  const handleSave = () => {
    saveAnalysis({ jobTitle: analysis.jobTitle, company: analysis.company, score: analysis.score, timestamp: analysis.timestamp })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <Score score={analysis.score} jobTitle={analysis.jobTitle} company={analysis.company} />
      <Metrics metrics={analysis.metrics} />
      <MatchMap
        matched={analysis.matchedSkills}
        missing={analysis.missingSkills}
        partial={analysis.partialSkills}
        allRequired={demoJob.requiredSkills}
      />
      <KeywordSection found={analysis.foundKeywords} weak={analysis.weakKeywords} missing={analysis.missingKeywords} />
      <TopFixes fixes={analysis.topFixes} />
      <ResumeHealth metrics={analysis.metrics} />
      <InterviewPrep questions={analysis.interviewQuestions} />
      <div className="flex justify-between items-center py-4">
        <button onClick={() => navigate('/analyzer')} className="text-sm text-gray-400 hover:text-[#1A1A1A]">
          ← New Analysis
        </button>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-sm text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-[#1A1A1A] text-white hover:bg-[#333]'}`}
        >
          {saved ? 'Saved ✓' : 'Save Analysis'}
        </button>
      </div>
    </div>
  )
}
