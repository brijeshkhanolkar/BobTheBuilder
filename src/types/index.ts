export interface Resume {
  name: string
  experienceYears: number
  skills: string[]
  projects: string[]
  summary: string
}

export interface Job {
  title: string
  company: string
  description: string
  requiredSkills: string[]
  responsibilities: string[]
}

export interface Fix {
  id: number
  title: string
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  why: string
  suggestion: string
}

export interface Question {
  id: number
  text: string
  why: string
  preparation: string
}

export interface Analysis {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  partialSkills: string[]
  foundKeywords: string[]
  weakKeywords: string[]
  missingKeywords: string[]
  metrics: { skills: number; keywords: number; responsibilities: number; experience: number }
  topFixes: Fix[]
  interviewQuestions: Question[]
  timestamp: string
  jobTitle: string
  company: string
}
