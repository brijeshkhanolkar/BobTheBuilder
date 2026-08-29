import OpenAI from 'openai'
import { Resume, Job, Analysis, Fix, Question } from '../types'

// ─── Deterministic fallback (used if API fails) ───────────────────────────────
const KNOWN_SKILLS = [
  'react', 'javascript', 'typescript', 'node.js', 'python', 'java', 'sql',
  'mongodb', 'aws', 'docker', 'git', 'rest apis', 'graphql', 'html', 'css',
  'testing', 'performance optimization',
]

function detect(text: string): string[] {
  const low = text.toLowerCase()
  return KNOWN_SKILLS.filter(s => low.includes(s))
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

export const EXPLANATIONS: Record<string, string> = {
  'React':                   'Your resume demonstrates solid React experience through multiple projects.',
  'JavaScript':              'JavaScript is clearly evident in your skill list and project work.',
  'TypeScript':              'TypeScript is not explicitly mentioned — add it if you have practical experience.',
  'REST APIs':               'REST API usage is mentioned in both projects — strong match.',
  'Git':                     'Git is listed in your skill set.',
  'Testing':                 'No testing frameworks mentioned. Add Jest or React Testing Library if applicable.',
  'AWS':                     'AWS is not present in your resume. This is a required skill for the role.',
  'Performance optimization':'Performance work is not explicitly described. Add specific examples.',
}

function localFallback(resume: Resume, job: Job): Analysis {
  const resumeText = [...resume.skills, ...resume.projects, resume.summary].join(' ')
  const detected = detect(resumeText)
  const required = job.requiredSkills.map(s => s.toLowerCase())
  const matched = detected.filter(s => required.includes(s))
  const missing = required.filter(s => !detected.includes(s)).map(cap)
  const partial = detected.filter(s => !required.includes(s)).map(cap)
  const skillPct = Math.round((matched.length / required.length) * 100)
  const expPct   = resume.experienceYears >= 2 ? 100 : 60
  const respPct  = Math.round((matched.length / Math.max(job.responsibilities.length, 1)) * 100)
  const score    = Math.round(skillPct * 0.40 + skillPct * 0.25 + Math.min(respPct, 100) * 0.20 + expPct * 0.15)

  const fixes: Fix[] = missing.slice(0, 5).map((skill, i) => ({
    id: i + 1,
    title: `Add ${skill} experience`,
    impact: i < 2 ? 'HIGH' : i < 4 ? 'MEDIUM' : 'LOW',
    why: `The job requires ${skill}, which is absent from your resume.`,
    suggestion: `Include a bullet point or project where you specifically used ${skill}.`,
  }))

  const questions: Question[] = [
    { id:1, text:`Tell me about your experience with ${job.requiredSkills[0]}.`, why:'Assesses primary skill depth.', preparation:'Prepare 2-3 specific projects with outcomes.' },
    { id:2, text:`How have you used ${job.requiredSkills[1] ?? 'REST APIs'} in production?`, why:'Tests practical knowledge.', preparation:'Describe error handling and data patterns.' },
    { id:3, text:`What is your experience with ${job.requiredSkills[2] ?? 'TypeScript'}?`, why:'Identifies secondary skill depth.', preparation:'Mention strict mode and typing patterns.' },
    { id:4, text:'How do you approach frontend performance optimization?', why:'Evaluates engineering maturity.', preparation:'Talk about lazy loading, memoization, code splitting.' },
    { id:5, text:'Describe a challenging technical problem you solved.', why:'Assesses problem-solving mindset.', preparation:'Use STAR format: Situation, Task, Action, Result.' },
  ]

  return {
    score, matchedSkills: matched.map(cap), missingSkills: missing,
    partialSkills: partial, foundKeywords: matched.map(cap),
    weakKeywords: partial, missingKeywords: missing,
    metrics: { skills: skillPct, keywords: skillPct, responsibilities: Math.min(respPct,100), experience: expPct },
    topFixes: fixes, interviewQuestions: questions,
    timestamp: new Date().toISOString(), jobTitle: job.title, company: job.company,
  }
}

// ─── OpenAI-powered analysis ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are CareerFit, an expert resume analyst and career coach.
Given a resume and job description, return ONLY valid JSON matching this exact schema:
{
  "score": number (0-100),
  "matchedSkills": string[],
  "missingSkills": string[],
  "partialSkills": string[],
  "foundKeywords": string[],
  "weakKeywords": string[],
  "missingKeywords": string[],
  "metrics": {
    "skills": number (0-100),
    "keywords": number (0-100),
    "responsibilities": number (0-100),
    "experience": number (0-100)
  },
  "topFixes": [
    { "id": number, "title": string, "impact": "HIGH"|"MEDIUM"|"LOW", "why": string, "suggestion": string }
  ],
  "interviewQuestions": [
    { "id": number, "text": string, "why": string, "preparation": string }
  ]
}
Rules:
- score = weighted average: skills 40% + keywords 25% + responsibilities 20% + experience 15%
- Return exactly 5 topFixes ranked by impact
- Return exactly 5 interviewQuestions based on the job description
- matchedSkills = skills present in both resume and job
- missingSkills = skills required by job but absent from resume
- partialSkills = skills mentioned in resume but not strongly evidenced
- Be specific and actionable. Tailor everything to the actual content provided.
- Return ONLY the JSON object, no markdown, no explanation.`

export async function analyze(resume: Resume, job: Job): Promise<Analysis> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    console.warn('No OpenAI API key found, using local fallback.')
    return localFallback(resume, job)
  }

  const userContent = `
RESUME:
Name: ${resume.name}
Experience: ${resume.experienceYears} years
Skills: ${resume.skills.join(', ')}
Projects: ${resume.projects.join('\n')}
Summary: ${resume.summary}

JOB DESCRIPTION:
Title: ${job.title}
Company: ${job.company}
Required Skills: ${job.requiredSkills.join(', ')}
Description: ${job.description}
`

  try {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    const response = await client.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const raw = response.choices[0]?.message?.content?.trim() ?? ''
    const parsed = JSON.parse(raw)

    return {
      ...parsed,
      timestamp: new Date().toISOString(),
      jobTitle: job.title,
      company: job.company,
    } as Analysis
  } catch (err) {
    console.error('OpenAI API error, falling back to local analysis:', err)
    return localFallback(resume, job)
  }
}
